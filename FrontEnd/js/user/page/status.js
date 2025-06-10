import Utils from "../Utils.js";

Utils.getHeader();

document.addEventListener('DOMContentLoaded', () => {
    const successImage = document.getElementById('success-img');
    const errorImage = document.getElementById('error-img');
    const successStatus = document.getElementById('success-status')
    const errorMess = document.getElementById('error-message')
    const errorStatus = document.getElementById('error-status')
    const successContainer = document.getElementById('success');
    const errorContainer = document.getElementById('error');
    successContainer.style.display = 'none';
    errorContainer.style.display = 'none';
    successImage.style.display = "none";
    errorImage.style.display = "none";
    successStatus.style.display = "none";
    errorStatus.style.display = "none";
    const orderSuccess = sessionStorage.getItem('orderSuccess') === 'true';
    const orderError = sessionStorage.getItem('orderError') === 'true';


    console.log("orderError:", orderError, "orderSuccess:", orderSuccess);

    if (orderSuccess) {
        console.log("Đặt hàng thành công");
        successContainer.style.display = 'block';
        errorContainer.style.display = 'none';
        successImage.style.display = "block";
        errorImage.style.display = "none";
        successStatus.style.display = "block";
        errorStatus.style.display = "none";
        errorMess.style.display = "none"
        sessionStorage.removeItem('orderSuccess');
        return;
    }

    if (orderError) {
        console.log("Đặt hàng thất bại");
        errorContainer.style.display = 'block';
        successContainer.style.display = 'none';
        successImage.style.display = "none";
        errorImage.style.display = "block";
        successStatus.style.display = "none";
        errorStatus.style.display = "block";
        sessionStorage.removeItem('orderError');
        return;
    }

    console.log("Không có trạng thái, chuyển về trang chủ");
    window.location.href = '/';
});
