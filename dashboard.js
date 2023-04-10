const selects = document.querySelectorAll("select");
cardContainer = document.querySelector(".card-container");
const ul = document.querySelector(".courses-list");
ul.insertAdjacentHTML(
  "afterbegin",
  `<select name="type"><option selected value="">All</option><option value="notes">Notes</option><option value="paper">Question papers</option><option value="practical">Practical Files</option><option value="ebook">Ebook</option></select>`
);
const options = ul.lastElementChild;
options.style.display = "none";

options.addEventListener("change", () => {
  type = options.value;
  numLoaded = 0;
  cardContainer.innerHTML = "";
  if (courseid) fetchDocuments();
});

window.addEventListener("load", async function () {
  fetch("/universities", {
    method: "POST",
  })
    .then((res) => res.json())
    .then((data) => {
      const options = data.map((university) => {
        const option = document.createElement("option");
        option.value = university.name;
        option.textContent = university.name;
        return option;
      });
      selects[0].append(...options);
    });
});

selects.forEach((select) => {
  select.addEventListener("change", () => {
    select.classList.add("valid");
    if (select.name === "uni") {
      const data = JSON.stringify({ university: select.value });
      fetch("/degrees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          const options = data.map((degree) => {
            const option = document.createElement("option");
            option.value = degree.id;
            option.textContent = degree.degree;
            return option;
          });
          for (let i = 1; i < 4; i++) {
            selects[i].classList.remove("valid");
            while (selects[i].children.length > 1) {
              selects[i].children[1].remove();
            }
            selects[i].classList.remove("valid");
            selects[i].children[0].selected = true;
          }
          selects[1].append(...options);
        })
        .catch((err) => console.log(err));
    } else if (select.name === "degree") {
      const data = JSON.stringify({
        degree: +select.value,
      });
      fetch("/specializations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          const options = data.map((spec) => {
            const option = document.createElement("option");
            option.value = spec.id;
            option.textContent = spec.specialization;
            return option;
          });
          selects[2].classList.remove("valid");
          for (let i = 2; i < 4; i++) {
            while (selects[i].children.length > 1) {
              selects[i].children[1].remove();
            }
            selects[i].classList.remove("valid");
            selects[i].children[0].selected = true;
          }
          selects[2].append(...options);
        })
        .catch((err) => console.log(err));
    } else if (select.name === "specialization") {
      const data = JSON.stringify({
        degree: +selects[1].value,
      });
      fetch("/semesters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          const num = +data[0].semesters;
          const options = [];
          for (let i = 1; i <= num; i++) {
            const option = document.createElement("option");
            option.value = i;
            option.textContent = i;
            options.push(option);
          }
          selects[3].classList.remove("valid");
          for (let i = 3; i < 4; i++) {
            while (selects[i].children.length > 1) {
              selects[i].children[1].remove();
            }
            selects[i].classList.remove("valid");
            selects[i].children[0].selected = true;
          }
          selects[3].append(...options);
        })
        .catch((err) => console.log(err));
    }
  });
});

const form = document.querySelector(".dashboard-header");

function checkInput() {
  selects.forEach((select) => {
    if (select.value === "") return false;
  });
  return true;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!checkInput()) {
    alert("Please fill in all the fields first");
    return;
  }

  const formdata = JSON.stringify({
    specialization: selects[2].value,
    semester: selects[3].value,
  });
  fetch("/semesterCourses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: formdata,
  })
    .then((res) => res.json())
    .then((data) => {
      ul.innerHTML = "";
      cardContainer.innerHTML = "";
      btn.style.display = "none";
      const lis = [];
      data.forEach((course) => {
        const li = document.createElement("li");
        li.textContent = course.name;
        li.classList.add("course-item");
        li.addEventListener("click", () => {
          options.value = "";
          cardContainer.innerHTML = "";
          lis.forEach((li) => {
            li.classList.remove("selected");
          });
          li.classList.add("selected");
          numLoaded = 0;
          courseid = course.id;
          type = "";
          fetchDocuments();
        });
        lis.push(li);
      });
      ul.prepend(...lis);
      if (data.length === 0) {
        ul.innerHTML = "<div class='no-data'>No courses found</div>";
      } else {
        if (!ul.contains(options)) ul.append(options);
        options.style.display = "block";
      }
    });
});
