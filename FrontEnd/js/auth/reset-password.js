function toggleEyeIcons(inputId) {
  const passwordInput = document.getElementById(inputId);
  const eyeIcon = document.querySelector(
    `.${
      inputId === "password__input" ? "password_eye" : "confirm_password_eye"
    }`
  );
  const eyeSlashIcon = document.querySelector(
    `.${
      inputId === "password__input"
        ? "password_eye_slash"
        : "confirm_password_eye_slash"
    }`
  );

  if (passwordInput.value.length > 0) {
    eyeIcon.style.display = "inline";
    eyeSlashIcon.style.display = "none";
  } else {
    eyeIcon.style.display = "none";
    eyeSlashIcon.style.display = "none";
  }
}

function togglePassword(inputId, eyeClass, eyeSlashClass) {
  const passwordInput = document.getElementById(inputId);
  const eyeIcon = document.querySelector(`.${eyeClass}`);
  const eyeSlashIcon = document.querySelector(`.${eyeSlashClass}`);

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    eyeIcon.style.display = "none";
    eyeSlashIcon.style.display = "inline";
  } else {
    passwordInput.type = "password";
    eyeIcon.style.display = "inline";
    eyeSlashIcon.style.display = "none";
  }
}

function checkPasswordsMatch() {
  const passwordInput = document.getElementById("password__input");
  const confirmPasswordInput = document.getElementById(
    "confirm__password__input"
  );
  const statusMessage = document.getElementById("password_match_status");

  if (passwordInput.value && confirmPasswordInput.value) {
    if (passwordInput.value === confirmPasswordInput.value) {
      statusMessage.style.display = "none";
    } else {
      statusMessage.style.display = "block";
      statusMessage.innerText = "Mật khẩu không khớp";
    }
  } else {
    statusMessage.style.display = "none";
  }
}

function failHandler() {
  const passwordBox = document.querySelector(".password__box");
  const confirmPasswordBox = document.querySelector(".confirm__password__box");
  const handlerBox = document.querySelector(".__handler__box");
  const actionForm = document.querySelector(".action_form");
  var spanHandler = document.querySelector(".span__handler");
  console.log(spanHandler);
  // Kiểm tra sự tồn tại của các phần tử trước khi thao tác
  if (passwordBox && confirmPasswordBox && actionForm) {
    passwordBox.style.display = "none";
    actionForm.style.display = "none";
    confirmPasswordBox.style.display = "none";
  }

  if (handlerBox) {
    spanHandler.innerHTML = "Yêu câu làm mới mật khẩu không tồn tại";
    spanHandler.style.color = "red";
    handlerBox.style.display = "flex";
  }
}

function successHandler() {
  const passwordBox = document.querySelector(".password__box");
  const confirmPasswordBox = document.querySelector(".confirm__password__box");
  const handlerBox = document.querySelector(".__handler__box");
  const actionForm = document.querySelector(".action_form");
  var spanHandler = document.querySelector(".span__handler");

  // Kiểm tra sự tồn tại của các phần tử trước khi thao tác
  if (passwordBox && confirmPasswordBox && actionForm) {
    passwordBox.style.display = "none";
    actionForm.style.display = "none";
    confirmPasswordBox.style.display = "none";
  }

  if (handlerBox) {
    spanHandler.innerHTML = "Bạn đã đổi mật khẩu mới thành công";
    spanHandler.style.color = "Green";
    handlerBox.style.display = "flex";
  }
}
document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("reset__password__btn")
    .addEventListener("click", function () {
      console.log("click");
      const passwordInput = document.getElementById("password__input").value;
      const confirmPasswordInput = document.getElementById(
        "confirm__password__input"
      ).value;
      const statusMessage = document.getElementById("password_match_status");
      if (passwordInput.length < 8) {
        statusMessage.style.display = "block";
        statusMessage.innerText = "Mật khẩu tối thiểu 8 kí tự";
        return;
      } else {
        statusMessage.style.display = "none";
      }
      if (passwordInput.length > 65) {
        statusMessage.style.display = "block";
        statusMessage.innerText = "Mật khẩu tối da 65 kí tự";
      } else {
        statusMessage.style.display = "none";
      }

      if (passwordInput === confirmPasswordInput) {
        statusMessage.style.display = "none";
      } else {
        statusMessage.style.display = "block";
        statusMessage.innerText = "Mật khẩu không khớp";
        return;
      }

      console.log("hehe");
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("code");

      fetch("http://localhost:8080/api/v1/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newPassword: passwordInput,
          token: token,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          if (data.status === 201) {
            console.log("fail");
            failHandler();
          } else if (data.status === 200) {
            console.log("success");
            successHandler();
          }
        })
        .catch((error) => {
          console.error("Lỗi khi gửi yêu cầu:", error);
        });
    });
});
