let courses = [];
let coursesDOM = [];
let numLoaded = 0;
let courseid = 0;
let curInput;
let type = "";

const forms = document.querySelectorAll(".form");
forms.forEach((form) => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    return;
  });
});

const clearBtns = document.querySelectorAll(".clear-search-input");
const div = document.createElement("div");
let cardContainer = document.createElement("div");
const main = document.querySelector("main");
div.classList.add("container");
cardContainer.classList.add("card-container");
const html = `<div class="course-files-header"><h1></h1><select name="type"><option selected value="">All</option><option value="notes">Notes</option><option value="paper">Question papers</option><option value="practical">Practical Files</option><option value="ebook">Ebook</option></select></div>`;
div.insertAdjacentHTML("afterbegin", html);
div.append(cardContainer);
const select = div.querySelector("select");
const h1 = div.firstElementChild.firstElementChild;

clearBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    btn.previousElementSibling.value = "";
    btn.previousElementSibling.focus();
    btn.nextElementSibling.innerHTML = "";
    btn.nextElementSibling.style.display = "none";
    btn.style.display = "none";
  });
});

select.addEventListener("change", () => {
  type = select.value;
  numLoaded = 0;
  cardContainer.innerHTML = "";
  fetchDocuments();
});

function createCard(dat) {
  const html = `<div class="card">
          <div class="flex card-header">
            <h3>${
              dat.type === "ebook"
                ? "Ebook"
                : dat.type === "paper"
                ? "Question Paper"
                : dat.type === "notes"
                ? "Notes"
                : "Practical File"
            }</h3>
            <!--<div>
              <button>⬆️</button>
              <button>⬇️</button>
              <span>${dat.votes}</span>
            </div> -->
          </div>
          <div class="card-data">
            <div class="card-row">
              <span class="card-key">Topic</span>
              <span class="card-value">${dat.name}</span>
            </div>
            <div class="card-row">
              <span class="card-key">Course</span>
              <span class="card-value">${dat.course_name}</span>
            </div>
            <div class="card-row">
              <span class="card-key">Degree</span>
              <span class="card-value">${dat.degree}</span>
            </div>
            <div class="card-row">
              <span class="card-key">University</span>
              <span class="card-value">${dat.uni}</span>
            </div>
            <div class="card-row">
              <span class="card-key">Contributor</span>
              <span class="card-value">${dat.contributor}</span>
            </div>
            <div class="card-row">
              <span class="card-key">Upload Date</span>
              <span class="card-value">${new Intl.DateTimeFormat().format(
                new Date(dat.upload_date)
              )}</span>
            </div>
            <div class="card-footer">
              <span class="views">👀 ${dat.views} views</span>
              <button class="download">Download</button>
            </div>
          </div>
        </div>`;
  cardContainer.insertAdjacentHTML("beforeend", html);
  const card = cardContainer.lastElementChild;
  card.querySelector(".download").addEventListener("click", () => {
    window.open(
      `https://drive.google.com/uc?id=${dat.id}&export=download`,
      "_blank"
    );
  });
  card.addEventListener("click", () => {
    fetch("/updateViews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: dat.id }),
    })
      .then((res) => res.json())
      .then((views) => {
        card.querySelector(".views").textContent = `👀 ${views[0].views} views`;
      })
      .then(() => {
        window.open(
          `https://drive.google.com/uc?export=media&id=${dat.id}`,
          "_blank"
        );
      });
  });
}

function fetchDocuments() {
  fetch("/getDocuments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      courseid: +courseid,
      offset: numLoaded,
      num: 10,
      type: type,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      numLoaded += data[0].length;

      if (numLoaded !== data[1].count) {
        if (!main.contains(btn)) main.append(btn);
        btn.style.display = "block";
      } else {
        btn.style.display = "none";
      }
      data[0].forEach((dat) => {
        createCard(dat);
      });
      if (data[0].length === 0) {
        cardContainer.innerHTML = `<div class="no-data">Sorry no data available!</div>`;
      }
    });
}

function clearInput() {
  curInput.nextElementSibling.nextElementSibling.style.display = "none";
  curInput.nextElementSibling.nextElementSibling.innerHTML = "";
  curInput.value = "";
}

function resetDOM(course) {
  type = "";
  courseid = course.id;
  numLoaded = 0;
  h1.textContent = course.name;
  main.innerHTML = "";
  main.append(div);
  cardContainer.innerHTML = "";
  div.lastElementChild.remove();
  div.append(cardContainer);

  fetchDocuments();
}

const btn = document.createElement("button");
btn.classList.add("load-more");
btn.textContent = "Load More";
btn.addEventListener("click", fetchDocuments);

window.addEventListener("load", async function () {
  fetch("/allCourses", {
    method: "POST",
  })
    .then((res) => res.json())
    .then((data) => {
      courses = data;
      coursesDOM = courses.map((course) => {
        const li = document.createElement("li");
        li.classList.add("autocomplete-item");
        li.dataset.id = course.id;
        li.innerHTML = `<span>${course.name}</span><span class="autocomplete-uni">${course.uni}</span>`;
        li.addEventListener("click", () => {
          clearInput();
          resetDOM(course);
        });
        return { course, li };
      });
    });
});

const inputs = document.querySelectorAll(".sub-input");
inputs.forEach((input) => {
  input.addEventListener("input", () => {
    const val = input.value.trim();
    input.nextElementSibling.nextElementSibling.innerHTML = "";

    if (!val) {
      input.nextElementSibling.nextElementSibling.style.display = "none";
      console.log(input.value);
      if (input.value === "") {
        input.nextElementSibling.style.display = "none";
      }
      return;
    }

    input.nextElementSibling.style.display = "block";

    const filteredCourses = coursesDOM.filter((obj) =>
      obj.course.name.match(new RegExp(val, "i"))
    );

    if (!filteredCourses.length) {
      input.nextElementSibling.nextElementSibling.style.display = "none";
      input.nextElementSibling.nextElementSibling.innerHTML = "";
      return;
    }

    input.nextElementSibling.nextElementSibling.style.display = "block";
    console.log(filteredCourses);
    filteredCourses.forEach((course) => {
      input.nextElementSibling.nextElementSibling.append(course.li);
      curInput = input;
    });
  });
});
