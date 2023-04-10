(function () {
  const form = document.querySelector("#upload-form");
  const inputs = document.querySelectorAll("#upload-form input");
  const selects = document.querySelectorAll("#upload-form select");
  const uni = document.querySelector("#upload-form select[name='university']");
  const fileInput = document.querySelector("#upload-form input[type='file']");
  const submit = document.querySelector("#upload-form button");
  const p = document.querySelector(".response-msg");
  const loader = document.querySelector(".loader");
  const overlay = document.querySelector(".overlay");

  async function submitForm() {
    const formData = new FormData(form);
    overlay.style.display = "block";
    loader.style.display = "block";
    try {
      const response = await fetch("/uploadFile", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      overlay.style.display = "none";
      loader.style.display = "none";
      return data;
    } catch (error) {
      overlay.style.display = "none";
      loader.style.display = "none";
      console.error(error);
    }
  }

  function handleSubmit() {
    let returnVal = true;
    let radioSelected = false;
    let selected = null;

    selects.forEach((select) => {
      if (!select.value) {
        returnVal = false;
        select.classList.add("invalid");
        select.nextElementSibling.textContent =
          select.nextElementSibling.dataset.msg;
      }
    });

    inputs.forEach((input) => {
      if (input.type === "text" || input.type === "email") {
        if (!input.checkValidity()) {
          returnVal = false;
          input.previousElementSibling.textContent =
            input.previousElementSibling.dataset.msg;
          input.classList.add("invalid");
        }
      } else if (input.type === "radio") {
        if (input.checked) {
          radioSelected = true;
        }
        selected = input;
      } else if (input.type === "file") {
        if (!input.files.length) {
          returnVal = false;
          input.nextElementSibling.textContent =
            input.nextElementSibling.dataset.msg;
        }
      }
    });

    if (!radioSelected) {
      selected.closest(".flex").nextElementSibling.textContent =
        selected.closest(".flex").nextElementSibling.dataset.msg;
    }

    return returnVal;
  }

  function clearForm() {
    inputs.forEach((input) => {
      if (input.type === "text" || input.type === "email") {
        input.value = "";
        input.classList.remove("valid");
        input.nextElementSibling.classList.remove("has-text");
      } else if (input.type === "radio") {
        input.checked = false;
      } else if (input.type === "file") {
        input.value = "";
      }
    });
    selects.forEach((select) => {
      select.children[0].selected = true;
      select.classList.remove("valid");
    });
  }

  submit.addEventListener("click", async function (e) {
    e.preventDefault();
    if (handleSubmit()) {
      const data = await submitForm();
      clearForm();
      p.style.display = "block";
      if (!data) {
        p.textContent = p.dataset.err;
        return;
      }
      p.textContent = p.dataset.msg;
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (handleSubmit()) submitForm();
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
        uni.append(...options);
      });
  });

  inputs.forEach((input) => {
    if (input.type === "text" || input.type === "email") {
      input.addEventListener("focus", () => {
        input.classList.add("active");
      });
      input.addEventListener("blur", () => {
        input.classList.remove("active");
        if (input.value) {
          input.nextElementSibling.classList.add("has-text");
        } else {
          input.nextElementSibling.classList.remove("has-text");
        }
        if (!input.checkValidity()) {
          input.previousElementSibling.textContent =
            input.previousElementSibling.dataset.msg;
          input.classList.add("invalid");
        }
      });

      input.addEventListener("input", (e) => {
        p.textContent = "";
        p.style.display = "none";
        if (input.checkValidity()) {
          if (input.classList.contains("invalid")) {
            input.classList.remove("invalid");
          }
          input.previousElementSibling.textContent = "";
          input.classList.add("valid");
        } else {
          if (input.classList.contains("valid")) {
            input.previousElementSibling.textContent = input.dataset.msg;
          }
          input.classList.remove("valid");
          input.classList.add("invalid");
        }
      });
    } else if (input.type === "radio") {
      input.addEventListener("change", () => {
        p.textContent = "";
        p.style.display = "none";
        input.closest(".flex").nextElementSibling.textContent = "";
      });
    }
  });

  selects.forEach((select) => {
    select.addEventListener("change", () => {
      p.textContent = "";
      p.style.display = "none";
      if (select.value) {
        select.classList.remove("invalid");
        select.classList.add("valid");
        select.nextElementSibling.textContent = "";
      }
      if (select.name === "university") {
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
          specialization: +select.value,
        });
        fetch("/courses", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: data,
        })
          .then((res) => res.json())
          .then((data) => {
            const options = data.map((course) => {
              const option = document.createElement("option");
              option.value = course.id;
              option.textContent = course.name;
              return option;
            });
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

  fileInput.addEventListener("change", () => {
    p.textContent = "";
    p.style.display = "none";
    if (fileInput.files.length) {
      fileInput.nextElementSibling.textContent = "";
    }
  });
})();
