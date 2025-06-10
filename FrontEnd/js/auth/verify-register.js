document.addEventListener("DOMContentLoaded", function () {
  // Lấy mã token từ URL
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");

  // Gửi yêu cầu xác thực tới API
  fetch(`http://localhost:8080/api/v1/auth/verify?code=${code}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const notificationBox = document.querySelector(".noti__box");

      if (data.status === 200) {
        // Xác thực thành công
        notificationBox.innerText = "Xác nhận đăng kí tài khoản thành công";
        notificationBox.style.color = "green"; // Màu chữ cho thành công
      } else {
        // Xác thực thất bại
        notificationBox.innerText = "Xác nhận đăng kí không thành công";
        notificationBox.style.color = "red"; // Màu chữ cho thất bại
      }
    })
    .catch((error) => {
      console.error("Lỗi khi gửi yêu cầu xác thực:", error);
    });
});
