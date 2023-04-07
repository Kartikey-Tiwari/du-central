const form = document.querySelector("#upload-form");
const inputs = document.querySelectorAll("#upload-form input");
const selects = document.querySelectorAll("#upload-form select");
const fileInput = document.querySelector("#upload-form input[type='file']");
const submit = document.querySelector("#upload-form button");

submit.addEventListener("click", (e) => {
  e.preventDefault();

  let radioSelected = false;
  let selected = null;

  selects.forEach((select) => {
    if (!select.value) {
      select.classList.add("invalid");
      select.nextElementSibling.textContent =
        select.nextElementSibling.dataset.msg;
    }
  });

  inputs.forEach((input) => {
    if (input.type === "text" || input.type === "email") {
      if (!input.checkValidity()) {
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
        input.nextElementSibling.textContent =
          input.nextElementSibling.dataset.msg;
      }
    }
  });

  if (!radioSelected) {
    selected.closest(".flex").nextElementSibling.textContent =
      selected.closest(".flex").nextElementSibling.dataset.msg;
  }
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
      input.closest(".flex").nextElementSibling.textContent = "";
    });
  }
});

selects.forEach((select) => {
  select.addEventListener("change", () => {
    if (select.value) {
      select.classList.remove("invalid");
      select.classList.add("valid");
      select.nextElementSibling.textContent = "";
    }
  });
});

fileInput.addEventListener("change", () => {
  if (fileInput.files.length) {
    fileInput.nextElementSibling.textContent = "";
  }
});
