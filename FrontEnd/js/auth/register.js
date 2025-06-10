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
  const statusMessage = document.getElementById(
    "confirm__password__match__status"
  );

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
function successRegister() {
  const normalDisplay = document.querySelector(".normal__display");
  const successRegisterBox = document.querySelector(".success___register__box");

  // Kiểm tra sự tồn tại của các phần tử trước khi thao tác
  if (normalDisplay) {
    normalDisplay.style.display = "none";
  }

  if (successRegisterBox) {
    successRegisterBox.style.display = "flex";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("register__btn").onclick = function (event) {
    console.log("click");
    event.preventDefault();

    const username = document.getElementById("username__input").value.trim();
    const email = document.getElementById("email__input").value.trim();
    const password = document.getElementById("password__input").value;
    const confirmPassword = document.getElementById(
      "confirm__password__input"
    ).value;
    console.log(username, email, password, confirmPassword);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const specialCharRegex = /[^a-zA-Z0-9_]/;

    if (username.length < 8) {
      document.getElementById("username__status").style.display = "block";
      document.getElementById("username__status").innerText =
        "Username tối thiểu 8 kí tự";
      return;
    } else {
      document.getElementById("username__status").style.display = "none";
    }
    if (username.length > 65) {
      document.getElementById("username__status").style.display = "block";
      document.getElementById("username__status").innerText =
        "Username tối đa 65 kí tự";
      return;
    } else {
      document.getElementById("username__status").style.display = "none";
    }

    if (specialCharRegex.test(username)) {
      document.getElementById("username__status").style.display = "block";
      document.getElementById("username__status").innerText =
        "Username không được chứa kí tự đặt biệt";
      return;
    } else {
      document.getElementById("username__status").style.display = "none";
    }

    if (!emailRegex.test(email)) {
      document.getElementById("email__status").style.display = "block";
      document.getElementById("email__status").innerText =
        "Email không đúng định dạng";
      return;
    } else {
      document.getElementById("email__status").style.display = "none";
    }

    if (password.length < 8) {
      document.getElementById("password__status").style.display = "block";
      document.getElementById("password__status").innerText =
        "Mật khẩu tối thiểu 8 ký tự.";
      return;
    } else {
      document.getElementById("password__status").style.display = "none";
    }

    if (password.length > 65) {
      document.getElementById("password__status").style.display = "block";

      document.getElementById("password__status").innerText =
        "Mật khẩu tối đa 65 ký tự.";
      return;
    } else {
      document.getElementById("password__status").style.display = "none";
    }

    if (password !== confirmPassword) {
      document.getElementById(
        "confirm__password__match__status"
      ).style.display = "block";
      document.getElementById("confirm__password__match__status").innerText =
        "Mật khẩu không khớp";
      return;
    } else {
      document.getElementById(
        "confirm__password__match__status"
      ).style.display = "nonee";
    }

    const userData = {
      username: username,
      password: password,
      email: email,
    };
    console.log(userData);
    fetch("http://localhost:8080/api/v1/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.status === 200) {
          successRegister();
        } else if (data.status === 209) {
          document.querySelector(".exist__noti").style.display = "block";
        }
      })
      .catch((error) => {
        console.error(error);
        alert(error.message);
      });
  };
});
