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

async function login() {
  const username = document.getElementById("username__input").value;
  const password = document.getElementById("password__input").value;

  if (!username) {
    document.getElementById("username__status").style.display = "block";
    return;
  } else {
    document.getElementById("username__status").style.display = "none";
  }

  if (!password) {
    document.getElementById("password__status").style.display = "block";
    return;
  } else {
    document.getElementById("password__status").style.display = "none";
  }

  const payload = {
    username: username,
    password: password,
  };
  try {
    const response = await fetch(
      "http://localhost:8080/api/v1/auth/authenticate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();
    if (response.status === 200) {
      localStorage.setItem("token", data.token);
      try {
        const decoded = jwt_decode(data.token);
        const userRole = decoded.role;
        if (userRole === "[USER]") {
          console.log("Account", decoded);
          window.location.href = "/";
        } else if (userRole === "[ADMIN]") {
          console.log("Account:", decoded);
          window.location.href = "/admin/dashboard";
        }
      } catch (error) {
        console.error("Lỗi khi giải mã JWT:", error);
      }
    } else if (response.status === 201) {
      const statusElement = document.querySelector("#username__status");
      if (statusElement) {
        statusElement.innerHTML = "Tên tài khoản và mật khẩu không đúng.";
        statusElement.style.display = "block";
      }
    } else if (response.status === 203) {
      const statusElement = document.querySelector("#username__status");
      if (statusElement) {
        statusElement.innerHTML = "Tài khoản của bạn chưa được xác minh.";
        statusElement.style.display = "block";
      }
    } else if (response.status === 202) {
      const statusElement = document.querySelector("#username__status");
      if (statusElement) {
        statusElement.innerHTML = "Tài khoản không tồn tại.";
        statusElement.style.display = "block";
      }
    }
  } catch (error) {
    alert("Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại!");
  }
}

document.addEventListener("DOMContentLoaded",()=>{
  localStorage.removeItem("token")
})
