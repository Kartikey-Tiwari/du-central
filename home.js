const recent = document.querySelector("#recent .list-links");
const mostViewed = document.querySelector("#most-viewed .list-links");

function createLis(data) {
  const temp = data.map((course) => {
    const li = document.createElement("li");

    const file = document.createElement("a");
    file.classList.add("file-link");
    file.href = `https://drive.google.com/uc?export=media&id=${course.id}`;
    file.target = "_blank";
    file.textContent = course.name;
    file.addEventListener("click", () => {
      fetch("/updateViews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: course.id }),
      }).then(() => {});
    });
    li.append(file);

    const courseLink = document.createElement("a");
    courseLink.classList.add("subject-link");
    courseLink.addEventListener("click", () => {
      resetDOM({ name: course.course_name, id: course.course });
    });
    courseLink.textContent = course.course_name;
    li.append(courseLink);

    const uploaderLink = document.createElement("a");
    uploaderLink.classList.add("uploader-link");
    uploaderLink.textContent = course.contributor;
    uploaderLink.addEventListener("click", () => {
      return;
    });
    li.append(uploaderLink);
    return li;
  });
  return temp;
}

window.addEventListener("load", () => {
  fetch("/recent", {
    method: "POST",
  })
    .then((res) => res.json())
    .then((data) => {
      recent.append(...createLis(data));
    })
    .then(() => {
      fetch("/mostViewed", {
        method: "POST",
      })
        .then((res) => res.json())
        .then((data) => {
          mostViewed.append(...createLis(data));
        });
    });
});
