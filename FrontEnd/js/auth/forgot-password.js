function toggleEyeIcons() {
  const passwordInput = document.getElementById("password__input");
  const eyeIcon = document.querySelector(".toggle__eye");
  const eyeSlashIcon = document.querySelector(".toggle__eye__slash");

  // Show the eye icon only if there's text in the input
  if (passwordInput.value.length > 0) {
    eyeIcon.style.display = "inline";
    eyeSlashIcon.style.display = "none";
  } else {
    eyeIcon.style.display = "none";
    eyeSlashIcon.style.display = "none";
  }
}

function togglePassword() {
  const passwordInput = document.getElementById("password__input");
  const eyeIcon = document.querySelector(".toggle__eye");
  const eyeSlashIcon = document.querySelector(".toggle__eye__slash");

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
function successHandler() {
  const email__box = document.querySelector(".email__box");
  const action__form = document.querySelector(".action_form");
  const successHandlerBox = document.querySelector(".success___handler__box");

  // Kiểm tra sự tồn tại của các phần tử trước khi thao tác
  if (email__box && action__form) {
    email__box.style.display = "none";
    action__form.style.display = "none";
  }

  if (successHandlerBox) {
    successHandlerBox.style.display = "flex";
  }
}

document.getElementById("request__btn").addEventListener("click", function () {
  const emailInput = document.getElementById("email__input").value;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailInput) {
    document.getElementById("email__status").innerHTML = "Vui lòng nhập Email";
    document.getElementById("email__status").style.display = "block";
    return;
  } else if (!emailPattern.test(emailInput)) {
    document.getElementById("email__status").innerHTML =
      "Vui lòng nhập đúng định dạng Email";
    document.getElementById("email__status").style.display = "block";
    return;
  } else {
    document.getElementById("email__status").style.display = "none";
  }

  fetch("http://localhost:8080/api/v1/auth/forgot-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: emailInput }),
  })
    .then((response) => {
      if (response.status === 201) {
        alert("Email chưa đăng kí hoặc chưa xác minh tài khoản");
      } else if (response.status === 202) {
        alert("Account không tồn tại");
      } else if (response.status === 200) {
        successHandler();
      }
    })
    .catch((error) => {
      console.error("Lỗi khi gửi yêu cầu:", error);
      alert("Không thể gửi yêu cầu. Vui lòng thử lại.");
    });
});
