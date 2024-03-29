const fs = require("fs");
const mime = require("mime-types");
const { google } = require("googleapis");
const bodyParser = require("body-parser");
const credentials = require("./credentials.json");
const { Client } = require("pg");
const scopes = ["https://www.googleapis.com/auth/drive"];

const con = new Client({
  host: process.env.host,
  user: process.env.username,
  password: process.env.password,
  database: process.env.database,
  ssl: {
    rejectUnauthorized: false,
  },
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

const auth = new google.auth.JWT(
  credentials.client_email,
  null,
  credentials.private_key,
  scopes
);

const drive = google.drive({ version: "v3", auth });

async function changePermission(fileId) {
  const permission = {
    role: "reader",
    type: "anyone",
  };
  try {
    const result = await drive.permissions.create({
      fileId,
      resource: permission,
    });
  } catch (err) {
    console.log("error: ", err);
  }
}

async function uploadBasic(fileName) {
  const requestBody = {
    name: fileName,
    fields: "id",
  };
  const media = {
    mimeType: mime.lookup(fileName),
    body: fs.createReadStream(`uploads/${fileName}`),
  };
  try {
    const file = await drive.files.create({
      requestBody,
      media,
    });
    changePermission(file.data.id);
    return file.data.id;
  } catch (err) {
    console.log("error: ", err);
  }
}

const express = require("express");
const multer = require("multer");
const app = express();

app.use(bodyParser.json());

// Set up multer middleware
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/");
//   },
//   filename: function (req, file, cb) {
//     const fileName = `${Date.now()}${file.originalname}`;
//     cb(null, fileName);
//   },
// });
// const upload = multer({ storage: storage });
const upload = multer();

// Route for serving the file upload form
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/upload", (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.sendFile(__dirname + "/upload.html");
});

app.get("/dashboard", (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.sendFile(__dirname + "/dashboard.html");
});

app.get("/about", (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.sendFile(__dirname + "/about.html");
});

app.get("/dashboard.js", (req, res) => {
  res.setHeader("Content-Type", "text/javascript");
  res.sendFile(__dirname + "/dashboard.js");
});

app.get("/style.css", (req, res) => {
  res.setHeader("Content-Type", "text/css");
  res.sendFile(__dirname + "/style.css");
});

app.get("/script.js", (req, res) => {
  res.setHeader("Content-Type", "text/javascript");
  res.sendFile(__dirname + "/script.js");
});

app.get("/index.js", (req, res) => {
  res.setHeader("Content-Type", "text/javascript");
  res.sendFile(__dirname + "/index.js");
});

app.get("/home.js", (req, res) => {
  res.setHeader("Content-Type", "text/javascript");
  res.sendFile(__dirname + "/home.js");
});

app.get("/favicon.ico", (req, res) => {
  res.setHeader("Content-Type", "image/x-icon");
  res.sendFile(__dirname + "/favicon.ico");
});

app.get("/University_of_Delhi.png", (req, res) => {
  res.setHeader("Content-Type", "image/png");
  res.sendFile(__dirname + "/University_of_Delhi.png");
});

app.post("/mostViewed", (req, res) => {
  const sql =
    'SELECT *, (select name from course where id=course) as course_name FROM "material" ORDER BY "views" DESC LIMIT 3';
  con.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result.rows);
  });
});

app.post("/recent", (req, res) => {
  const sql =
    'SELECT *, (select name from course where id=course) as course_name FROM "material" ORDER BY "upload_date" DESC LIMIT 3';
  con.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result.rows);
  });
});

app.post("/semesters", (req, res) => {
  const degree = req.body.degree;
  con.query(
    'SELECT semesters FROM "degree" WHERE "name"=(SELECT "degree" from "unidegree" where "id"=$1)',
    [degree],
    (err, result) => {
      if (err) throw err;
      res.send(result.rows);
    }
  );
});

app.post("/semesterCourses", (req, res) => {
  const specialization = req.body.specialization;
  const semester = req.body.semester;
  con.query(
    'SELECT "name","id" FROM "course" WHERE "spec_id"=$1 and semester=$2',
    [specialization, semester],
    (err, result) => {
      if (err) throw err;
      res.send(result.rows);
    }
  );
});

app.post("/getDocuments", (req, res) => {
  const courseid = req.body.courseid;
  const type = req.body.type;
  const num = req.body.num;
  const offset = req.body.offset;
  let response = [];
  new Promise((res, rej) => {
    con.query(
      'SELECT *,(SELECT "name" from "course" where "id"="course") as "course_name", (select uni from unidegree where id=(select degree_id from specialization where id=(select spec_id from course where id=course))) as uni, (select concat((select degree from unidegree where id = (select degree_id from specialization where id=(select spec_id from course where id=course))),\' \' ,(select specialization from specialization where id=(select spec_id from course where id=course)))) as degree from "material" WHERE "course"=$1' +
        `${type !== "" ? ` and type='${type}'` : ""}` +
        ` limit ${num} offset ${offset}`,
      [courseid],
      function (err, result, fields) {
        if (err) throw err;
        res(result.rows);
      }
    );
  }).then((result) => {
    response.push(result);
    con.query(
      'SELECT count(*) as count FROM "material" WHERE "course"=$1' +
        `${type !== "" ? ` and "type"='${type}'` : ""}`,
      [courseid],
      function (err, result, fields) {
        if (err) throw err;
        response.push(result.rows[0]);
        res.send(response);
      }
    );
  });
});

// Route for handling file uploads
app.post(
  "/uploadFile",
  upload.fields([
    { name: "name", maxCount: 1 },
    { name: "type", maxCount: 1 },
    { name: "file", maxCount: 1 },
    { name: "contributor", maxCount: 1 },
    { name: "email", maxCount: 1 },
    { name: "university", maxCount: 1 },
    { name: "degree", maxCount: 1 },
    { name: "specialization", maxCount: 1 },
    { name: "course", maxCount: 1 },
  ]),
  async function (req, res) {
    // Process the uploaded file here
    res.send(`{"id": null}`);
    return;
    const id = await uploadBasic(req.files.file[0].filename);
    fs.unlink(`uploads/${req.files.file[0].filename}`, (err) => {
      if (err) console.log(err);
    });
    if (id === null) {
      res.send(`{"id": null}`);
      return;
    }
    let date = new Date().toISOString().slice(0, 19).replace("T", " ");
    con.query(
      'INSERT INTO "material" values ($1,$2,$3,$4,$5,$6,$7,$8,$9)',
      [
        id,
        req.body.name,
        +req.body.course,
        req.body.contributor,
        date,
        0,
        0,
        req.body.type,
        req.body.email,
      ],
      function (err, results, fields) {
        if (err) res.send(`{"id": null}`);
      }
    );

    res.send(`{"id": "${id}"}`);
  }
);

app.post("/universities", (req, res) => {
  con.query('SELECT * FROM "university"', function (err, results, fields) {
    if (err) throw err;
    res.send(results.rows);
  });
});

app.post("/degrees", (req, res) => {
  con.query(
    'SELECT "degree","id" FROM "unidegree" where "uni"=$1',
    [req.body.university],
    function (err, results, fields) {
      if (err) throw err;
      res.send(results.rows);
    }
  );
});

app.post("/specializations", (req, res) => {
  con.query(
    'SELECT "specialization","id" FROM "specialization" where "degree_id"=$1',
    [req.body.degree],
    function (err, results, fields) {
      if (err) throw err;
      res.send(results.rows);
    }
  );
});

app.post("/allCourses", (req, res) => {
  con.query(
    'SELECT "name","id",(SELECT "uni" from "unidegree" where id = (SELECT "degree_id" from "specialization" where "id"="spec_id")) as "uni" FROM "course"',
    function (err, results, fields) {
      if (err) throw err;
      res.send(results.rows);
    }
  );
});

app.post("/courses", (req, res) => {
  con.query(
    'SELECT "name","id" FROM "course" where "spec_id"=$1',
    [req.body.specialization],
    function (err, results, fields) {
      if (err) throw err;
      res.send(results.rows);
    }
  );
});

app.post("/updateViews", (req, res) => {
  con.query(
    'UPDATE "material" SET "views"="views"+1 WHERE "id"=$1',
    [req.body.id],
    function (err, results, fields) {
      if (err) {
        throw err;
      }
    }
  );
  con.query(
    'SELECT "views" FROM "material" WHERE "id"=$1',
    [req.body.id],
    function (err, results, fields) {
      if (err) throw err;
      res.send(results.rows);
    }
  );
});

// Start the server
app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
