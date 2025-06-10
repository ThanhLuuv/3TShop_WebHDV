// import Utils from "../Utils.js";

// const container = document.querySelector('.personal-infor-container')

// Utils.getHeader()
// // Utils.protectUser()
// container.insertAdjacentHTML("beforeend", Utils.getFooter())

// const decreaseButtons = document.querySelectorAll('#decrease');
// const increaseButtons = document.querySelectorAll('#increase');

// decreaseButtons.forEach(button => {
//     button.addEventListener('click', function() {
//         let quantityDisplay = this.nextElementSibling;
//         let currentQuantity = parseInt(quantityDisplay.textContent);
//         if (currentQuantity > 1) {
//             quantityDisplay.textContent = currentQuantity - 1;
//         }
//     });
// });

// increaseButtons.forEach(button => {
//     button.addEventListener('click', function() {
//         let quantityDisplay = this.previousElementSibling; 
//         let currentQuantity = parseInt(quantityDisplay.textContent); 
//         quantityDisplay.textContent = currentQuantity + 1; 
//     });
// });

// const containerOrder = document.querySelector(".order-list")

// const canceledOrders = ()=>{
//     const html = `
//     <div class="order">
//         <div class="item-list">
//             <div class="item-container">
//                 <ul class="item">
//                     <li>
//                         <img src="../../img/product/detail.png" alt="">
//                     </li>
//                     <li class="product-detail">
//                         <a href="" class="name">Basic tee</a>
//                         <p class="color">Màu sắc: Xanh đậm</p>
//                         <p class="size">Size: XL</p>
//                     </li>
//                     <li class="quantity"><p>x1</p></li>
//                     <li class="price"><p>120.000đ</p></li>
//                 </ul>
//                 <ul class="item">
//                     <li>
//                         <img src="../../img/product/detail.png" alt="">
//                     </li>
//                     <li class="product-detail">
//                         <a href="" class="name">Basic tee</a>
//                         <p class="color">Màu sắc: Xanh đậm</p>
//                         <p class="size">Size: XL</p>
//                     </li>
//                     <li class="quantity"><p>x1</p></li>
//                     <li class="price"><p>120.000đ</p></li>
//                 </ul>
//                 <ul class="item">
//                     <li>
//                         <img src="../../img/product/detail.png" alt="">
//                     </li>
//                     <li class="product-detail">
//                         <a href="" class="name">Basic tee</a>
//                         <p class="color">Màu sắc: Xanh đậm</p>
//                         <p class="size">Size: XL</p>
//                     </li>
//                     <li class="quantity"><p>x1</p></li>
//                     <li class="price"><p>120.000đ</p></li>
//                 </ul>
//                 <ul class="item">
//                     <li>
//                         <img src="../../img/product/detail.png" alt="">
//                     </li>
//                     <li class="product-detail">
//                         <a href="" class="name">Basic tee</a>
//                         <p class="color">Màu sắc: Xanh đậm</p>
//                         <p class="size">Size: XL</p>
//                     </li>
//                     <li class="quantity"><p>x1</p></li>
//                     <li class="price"><p>120.000đ</p></li>
//                 </ul>
//                 <ul class="item">
//                     <li>
//                         <img src="../../img/product/detail.png" alt="">
//                     </li>
//                     <li class="product-detail">
//                         <a href="" class="name">Basic tee</a>
//                         <p class="color">Màu sắc: Xanh đậm</p>
//                         <p class="size">Size: XL</p>
//                     </li>
//                     <li class="quantity"><p>x1</p></li>
//                     <li class="price"><p>120.000đ</p></li>
//                 </ul>
//             </div>
//             <div class="total-container">
//                 <div>
//                     <label for="">Tổng số</label>
//                     <p>8</p>
//                 </div>
//                 <div>
//                     <label for="">Tổng tiền</label>
//                     <p>520.000đ</p>
//                 </div>
//             </div>
//         </div>
//         <div class="order-detail">
//             <div class="info-row status">
//                 <span class="label">Đơn hàng đã được hủy bởi quý khách lúc</span>
//                 <span class="value">25/09/2024 12:30:00</span>
//             </div>
//             <div class="info-row status">
//                 <span class="label">Lý do hủy đơn hàng</span>
//                 <span class="value">Thay đổi địa chỉ giao hàng</span>
//             </div>
//             <div class="order-container">
//                 <div class="order-header">
//                     <div class="dots">
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                     </div>
//                     <div class="heading">
//                         <span class="title">THÔNG TIN ĐƠN HÀNG</span>
//                         <span class="order-id">MÃ ĐƠN <strong>988334</strong></span>    
//                     </div>
//                 </div>
//                 <h3>Thông tin khách hàng</h3>
//                 <div class="customer-info">
//                     <div class="info-row">
//                         <span class="label">Người nhận hàng</span>
//                         <span class="value">PHẠM THANH TRƯỜNG</span>
//                     </div>
//                     <div class="info-row">
//                         <span class="label">Số điện thoại</span>
//                         <span class="value">0998844432</span>
//                     </div>
//                     <div class="info-row">
//                         <span class="label">Địa chỉ giao hàng</span>
//                         <span class="value">41/15, đường số 11, phường Trường Thọ, TP. Thủ Đức, TP.HCM</span>
//                     </div>
//                 </div>
//                 <h3>Thông tin đơn đặt hàng</h3>
//                 <div class="customer-info">
//                     <div class="info-row">
//                         <span class="label">Người nhận hàng</span>
//                         <span class="value">PHẠM THANH TRƯỜNG</span>
//                     </div>
//                     <div class="info-row">
//                         <span class="label">Số điện thoại</span>
//                         <span class="value">0998844432</span>
//                     </div>
//                     <div class="info-row">
//                         <span class="label">Địa chỉ giao hàng</span>
//                         <span class="value">41/15, đường số 11, phường Trường Thọ, TP. Thủ Đức, TP.HCM</span>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     </div>
//     `
//     containerOrder.innerHTML = html
// }

// const shippedOrders = ()=>{
//     const html = `
//     <div class="order">
//         <div class="item-list">
//             <div class="item-container">
//                 <ul class="item">
//                     <li>
//                         <img src="../../img/product/detail.png" alt="">
//                     </li>
//                     <li class="product-detail">
//                         <a href="" class="name">Basic tee</a>
//                         <p class="color">Màu sắc: Xanh đậm</p>
//                         <p class="size">Size: XL</p>
//                     </li>
//                     <li class="quantity"><p>x1</p></li>
//                     <li class="price"><p>120.000đ</p></li>
//                 </ul>
//                 <ul class="item">
//                     <li>
//                         <img src="../../img/product/detail.png" alt="">
//                     </li>
//                     <li class="product-detail">
//                         <a href="" class="name">Basic tee</a>
//                         <p class="color">Màu sắc: Xanh đậm</p>
//                         <p class="size">Size: XL</p>
//                     </li>
//                     <li class="quantity"><p>x1</p></li>
//                     <li class="price"><p>120.000đ</p></li>
//                 </ul>
//                 <ul class="item">
//                     <li>
//                         <img src="../../img/product/detail.png" alt="">
//                     </li>
//                     <li class="product-detail">
//                         <a href="" class="name">Basic tee</a>
//                         <p class="color">Màu sắc: Xanh đậm</p>
//                         <p class="size">Size: XL</p>
//                     </li>
//                     <li class="quantity"><p>x1</p></li>
//                     <li class="price"><p>120.000đ</p></li>
//                 </ul>
//                 <ul class="item">
//                     <li>
//                         <img src="../../img/product/detail.png" alt="">
//                     </li>
//                     <li class="product-detail">
//                         <a href="" class="name">Basic tee</a>
//                         <p class="color">Màu sắc: Xanh đậm</p>
//                         <p class="size">Size: XL</p>
//                     </li>
//                     <li class="quantity"><p>x1</p></li>
//                     <li class="price"><p>120.000đ</p></li>
//                 </ul>
//                 <ul class="item">
//                     <li>
//                         <img src="../../img/product/detail.png" alt="">
//                     </li>
//                     <li class="product-detail">
//                         <a href="" class="name">Basic tee</a>
//                         <p class="color">Màu sắc: Xanh đậm</p>
//                         <p class="size">Size: XL</p>
//                     </li>
//                     <li class="quantity"><p>x1</p></li>
//                     <li class="price"><p>120.000đ</p></li>
//                 </ul>
//             </div>
//             <div class="total-container">
//                 <div>
//                     <label for="">Tổng số</label>
//                     <p>8</p>
//                 </div>
//                 <div>
//                     <label for="">Tổng tiền</label>
//                     <p>520.000đ</p>
//                 </div>
//             </div>
//         </div>
//         <div class="order-detail">
//             <div class="info-row status">
//                 <span class="label">Đơn hàng đã được giao đến bạn lúc</span>
//                 <span class="value">25/09/2024 12:30:00</span>
//             </div>
//             <div class="order-container">
//                 <div class="order-header">
//                     <div class="dots">
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                     </div>
//                     <div class="heading">
//                         <span class="title">THÔNG TIN ĐƠN HÀNG</span>
//                         <span class="order-id">MÃ ĐƠN <strong>988334</strong></span>    
//                     </div>
//                 </div>
//                 <h3>Thông tin khách hàng</h3>
//                 <div class="customer-info">
//                     <div class="info-row">
//                         <span class="label">Người nhận hàng</span>
//                         <span class="value">PHẠM THANH TRƯỜNG</span>
//                     </div>
//                     <div class="info-row">
//                         <span class="label">Số điện thoại</span>
//                         <span class="value">0998844432</span>
//                     </div>
//                     <div class="info-row">
//                         <span class="label">Địa chỉ giao hàng</span>
//                         <span class="value">41/15, đường số 11, phường Trường Thọ, TP. Thủ Đức, TP.HCM</span>
//                     </div>
//                 </div>
//                 <h3>Thông tin đơn đặt hàng</h3>
//                 <div class="customer-info">
//                     <div class="info-row">
//                         <span class="label">Người nhận hàng</span>
//                         <span class="value">PHẠM THANH TRƯỜNG</span>
//                     </div>
//                     <div class="info-row">
//                         <span class="label">Số điện thoại</span>
//                         <span class="value">0998844432</span>
//                     </div>
//                     <div class="info-row">
//                         <span class="label">Địa chỉ giao hàng</span>
//                         <span class="value">41/15, đường số 11, phường Trường Thọ, TP. Thủ Đức, TP.HCM</span>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     </div>
//     `
//     containerOrder.innerHTML = html
// }

// const waitConfirmOrders = ()=>{
//     const html = `
//     <div class="order">
//         <div class="item-list">
//             <div class="item-container">
//                 <ul class="item">
//                     <li>
//                         <img src="../../img/product/detail.png" alt="">
//                     </li>
//                     <li class="product-detail">
//                         <a href="" class="name">Basic tee</a>
//                         <p class="color">Màu sắc: Xanh đậm</p>
//                         <p class="size">Size: XL</p>
//                     </li>
//                     <li class="quantity"><p>x1</p></li>
//                     <li class="price"><p>120.000đ</p></li>
//                 </ul>
//                 <ul class="item">
//                     <li>
//                         <img src="../../img/product/detail.png" alt="">
//                     </li>
//                     <li class="product-detail">
//                         <a href="" class="name">Basic tee</a>
//                         <p class="color">Màu sắc: Xanh đậm</p>
//                         <p class="size">Size: XL</p>
//                     </li>
//                     <li class="quantity"><p>x1</p></li>
//                     <li class="price"><p>120.000đ</p></li>
//                 </ul>
//                 <ul class="item">
//                     <li>
//                         <img src="../../img/product/detail.png" alt="">
//                     </li>
//                     <li class="product-detail">
//                         <a href="" class="name">Basic tee</a>
//                         <p class="color">Màu sắc: Xanh đậm</p>
//                         <p class="size">Size: XL</p>
//                     </li>
//                     <li class="quantity"><p>x1</p></li>
//                     <li class="price"><p>120.000đ</p></li>
//                 </ul>
//                 <ul class="item">
//                     <li>
//                         <img src="../../img/product/detail.png" alt="">
//                     </li>
//                     <li class="product-detail">
//                         <a href="" class="name">Basic tee</a>
//                         <p class="color">Màu sắc: Xanh đậm</p>
//                         <p class="size">Size: XL</p>
//                     </li>
//                     <li class="quantity"><p>x1</p></li>
//                     <li class="price"><p>120.000đ</p></li>
//                 </ul>
//                 <ul class="item">
//                     <li>
//                         <img src="../../img/product/detail.png" alt="">
//                     </li>
//                     <li class="product-detail">
//                         <a href="" class="name">Basic tee</a>
//                         <p class="color">Màu sắc: Xanh đậm</p>
//                         <p class="size">Size: XL</p>
//                     </li>
//                     <li class="quantity"><p>x1</p></li>
//                     <li class="price"><p>120.000đ</p></li>
//                 </ul>
//             </div>
//             <div class="total-container">
//                 <div>
//                     <label for="">Tổng số</label>
//                     <p>8</p>
//                 </div>
//                 <div>
//                     <label for="">Tổng tiền</label>
//                     <p>520.000đ</p>
//                 </div>
//             </div>
//         </div>
//         <div class="order-detail">
//             <div class="order-container">
//                 <div class="order-header">
//                     <div class="dots">
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                     </div>
//                     <div class="heading">
//                         <span class="title">THÔNG TIN ĐƠN HÀNG</span>
//                         <span class="order-id">MÃ ĐƠN <strong>988334</strong></span>    
//                     </div>
//                 </div>
//                 <h3>Thông tin khách hàng</h3>
//                 <div class="customer-info">
//                     <div class="info-row">
//                         <span class="label">Người nhận hàng</span>
//                         <span class="value">PHẠM THANH TRƯỜNG</span>
//                     </div>
//                     <div class="info-row">
//                         <span class="label">Số điện thoại</span>
//                         <span class="value">0998844432</span>
//                     </div>
//                     <div class="info-row">
//                         <span class="label">Địa chỉ giao hàng</span>
//                         <span class="value">41/15, đường số 11, phường Trường Thọ, TP. Thủ Đức, TP.HCM</span>
//                     </div>
//                 </div>
//                 <h3>Thông tin đơn đặt hàng</h3>
//                 <div class="customer-info">
//                     <div class="info-row">
//                         <span class="label">Người nhận hàng</span>
//                         <span class="value">PHẠM THANH TRƯỜNG</span>
//                     </div>
//                     <div class="info-row">
//                         <span class="label">Số điện thoại</span>
//                         <span class="value">0998844432</span>
//                     </div>
//                     <div class="info-row">
//                         <span class="label">Địa chỉ giao hàng</span>
//                         <span class="value">41/15, đường số 11, phường Trường Thọ, TP. Thủ Đức, TP.HCM</span>
//                     </div>
//                 </div>
//                 <button class="cancel-order">Hủy đơn hàng</button>
//             </div>
//         </div>
//     </div>
//     `
//     containerOrder.innerHTML = html
// }

// const shippingOrders = ()=>{
//     const html = `
//     <div class="order">
//         <div class="item-list">
//             <div class="item-container">
//                 <ul class="item">
//                     <li>
//                         <img src="../../img/product/detail.png" alt="">
//                     </li>
//                     <li class="product-detail">
//                         <a href="" class="name">Basic tee</a>
//                         <p class="color">Màu sắc: Xanh đậm</p>
//                         <p class="size">Size: XL</p>
//                     </li>
//                     <li class="quantity"><p>x1</p></li>
//                     <li class="price"><p>120.000đ</p></li>
//                 </ul>
//                 <ul class="item">
//                     <li>
//                         <img src="../../img/product/detail.png" alt="">
//                     </li>
//                     <li class="product-detail">
//                         <a href="" class="name">Basic tee</a>
//                         <p class="color">Màu sắc: Xanh đậm</p>
//                         <p class="size">Size: XL</p>
//                     </li>
//                     <li class="quantity"><p>x1</p></li>
//                     <li class="price"><p>120.000đ</p></li>
//                 </ul>
//                 <ul class="item">
//                     <li>
//                         <img src="../../img/product/detail.png" alt="">
//                     </li>
//                     <li class="product-detail">
//                         <a href="" class="name">Basic tee</a>
//                         <p class="color">Màu sắc: Xanh đậm</p>
//                         <p class="size">Size: XL</p>
//                     </li>
//                     <li class="quantity"><p>x1</p></li>
//                     <li class="price"><p>120.000đ</p></li>
//                 </ul>
//                 <ul class="item">
//                     <li>
//                         <img src="../../img/product/detail.png" alt="">
//                     </li>
//                     <li class="product-detail">
//                         <a href="" class="name">Basic tee</a>
//                         <p class="color">Màu sắc: Xanh đậm</p>
//                         <p class="size">Size: XL</p>
//                     </li>
//                     <li class="quantity"><p>x1</p></li>
//                     <li class="price"><p>120.000đ</p></li>
//                 </ul>
//                 <ul class="item">
//                     <li>
//                         <img src="../../img/product/detail.png" alt="">
//                     </li>
//                     <li class="product-detail">
//                         <a href="" class="name">Basic tee</a>
//                         <p class="color">Màu sắc: Xanh đậm</p>
//                         <p class="size">Size: XL</p>
//                     </li>
//                     <li class="quantity"><p>x1</p></li>
//                     <li class="price"><p>120.000đ</p></li>
//                 </ul>
//             </div>
//             <div class="total-container">
//                 <div>
//                     <label for="">Tổng số</label>
//                     <p>8</p>
//                 </div>
//                 <div>
//                     <label for="">Tổng tiền</label>
//                     <p>520.000đ</p>
//                 </div>
//             </div>
//         </div>
//         <div class="order-detail">
//             <div class="order-container">
//                 <div class="order-header">
//                     <div class="dots">
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                     </div>
//                     <div class="heading">
//                         <span class="title">THÔNG TIN ĐƠN HÀNG</span>
//                         <span class="order-id">MÃ ĐƠN <strong>988334</strong></span>    
//                     </div>
//                 </div>
//                 <h3>Thông tin khách hàng</h3>
//                 <div class="customer-info">
//                     <div class="info-row">
//                         <span class="label">Người nhận hàng</span>
//                         <span class="value">PHẠM THANH TRƯỜNG</span>
//                     </div>
//                     <div class="info-row">
//                         <span class="label">Số điện thoại</span>
//                         <span class="value">0998844432</span>
//                     </div>
//                     <div class="info-row">
//                         <span class="label">Địa chỉ giao hàng</span>
//                         <span class="value">41/15, đường số 11, phường Trường Thọ, TP. Thủ Đức, TP.HCM</span>
//                     </div>
//                 </div>
//                 <h3>Thông tin đơn đặt hàng</h3>
//                 <div class="customer-info">
//                     <div class="info-row">
//                         <span class="label">Người nhận hàng</span>
//                         <span class="value">PHẠM THANH TRƯỜNG</span>
//                     </div>
//                     <div class="info-row">
//                         <span class="label">Số điện thoại</span>
//                         <span class="value">0998844432</span>
//                     </div>
//                     <div class="info-row">
//                         <span class="label">Địa chỉ giao hàng</span>
//                         <span class="value">41/15, đường số 11, phường Trường Thọ, TP. Thủ Đức, TP.HCM</span>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     </div>
//     `
//     containerOrder.innerHTML = html
// }


import Api from "../Api.js";
import Utils from "../Utils.js";

const container = document.querySelector('.personal-infor-container');
Utils.getHeader();
container.insertAdjacentHTML("beforeend", Utils.getFooter());

const containerOrder = document.querySelector(".order-list");

const renderOrderDetails = (order) => {
    let totalPrice = 0;

    const orderDetailsHTML = order.orderDetailDTOS.map(detail => {
        const price = detail.specificationsDTO.productDTO.price || 0;
        const quantity = detail.quantity || 0;
        const itemTotalPrice = price * quantity; 

        totalPrice += itemTotalPrice; 

        return `
            <ul class="item">
                <li><img src="${detail.specificationsDTO.productDTO.imageUrl || '../../img/product/detail.png'}" alt=""></li>
                <li class="product-detail">
                    <a href="" class="name">${detail.specificationsDTO.productDTO.name || 'Product Name'}</a>
                    <p class="color">Màu sắc: ${detail.specificationsDTO.colorDTO.name || 'Unknown'}</p>
                    <p class="size">Size: ${detail.specificationsDTO.sizeDTO.name || 'Unknown'}</p>
                </li>
                <li class="quantity"><p>x${quantity}</p></li>
                <li class="price"><p>${itemTotalPrice.toLocaleString("vi-VN")}đ</p></li> <!-- Hiển thị giá từng sản phẩm -->
            </ul>
        `;
    }).join('');

    return { orderDetailsHTML, totalPrice };
};

const renderOrder = (order) => {
    console.log(order);

    const { orderDetailsHTML, totalPrice } = renderOrderDetails(order);

    const orderHTML = `
    <div class="order">
        <div class="item-list">
            <div class="item-container">
                ${orderDetailsHTML}
            </div>
            <div class="total-container">
                <div>
                    <label for="">Tổng số</label>
                    <p>${order.orderDetailDTOS.length}</p>
                </div>
                <div>
                    <label for="">Tổng tiền</label>
                    <p>${totalPrice.toLocaleString("vi-VN")}đ</p> <!-- Hiển thị tổng tiền -->
                </div>
            </div>
        </div>
        <div class="order-detail">
            <div class="info-row status">
                <span class="label">
                    ${
                        order.orderStatusDTO.status === 1 ? "" :
                        order.orderStatusDTO.status === 2 ? "" :
                        order.orderStatusDTO.status === 3 ? "Đơn hàng đã được giao lúc" : 
                        "Đơn hàng đã được hủy bởi quý khách lúc"
                    }
                </span>
                <span class="value">
                    ${
                        order.orderStatusDTO.status === 1 ? 
                        "": 
                        order.orderStatusDTO.status === 2 ? 
                        "": 
                        new Date(order.orderStatusDTO.create_at).toLocaleString("vi-VN")
                    }
                </span>
            </div>

            ${order.orderStatusDTO.status === 4 ? ` 
            <div class="info-row status">
                <span class="label">Lý do hủy đơn hàng</span>
                <span class="value">${order.note || 'N/A'}</span>
            </div>` : ''}

            <div class="order-container">
                <div class="order-header">
                    <div class="dots">
                        ${Array.from({length: 25}, () => '<span class="dot"></span>').join('')}
                    </div>
                    <div class="heading">
                        <span class="title">THÔNG TIN ĐƠN HÀNG</span>
                        <span class="order-id">MÃ ĐƠN <strong>${order.order_id}</strong></span>    
                    </div>
                </div>
                <h3>Thông tin khách hàng</h3>
                <div class="customer-info">
                    <div class="info-row">
                        <span class="label">Người nhận hàng</span>
                        <span class="value">${order.name}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Số điện thoại</span>
                        <span class="value">${order.phone}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Địa chỉ giao hàng</span>
                        <span class="value">${order.address_line_2}, ${order.address_line_1}</span>
                    </div>
                </div>
                <h3>Thông tin đơn đặt hàng</h3>
                <div class="customer-info">
                    <div class="info-row">
                        <span class="label">Thời gian đặt hàng</span>
                        <span class="value">
                            ${new Date(order.date).toLocaleDateString("vi-VN", {
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric'
                            })}
                        </span>
                    </div>
                    <div class="info-row">
                        <span class="label">Thời gian giao hàng dự kiến</span>
                        <span class="value">
                            ${
                                (function() {
                                    const date = new Date(order.orderStatusDTO.create_at);
                                    date.setDate(date.getDate() + 5);
                                    return date.toLocaleDateString("vi-VN", {
                                        weekday: 'long', 
                                        year: 'numeric', 
                                        month: 'long', 
                                        day: 'numeric'
                                    });
                                })()    
                            }
                        </span>
                    </div>
                    ${
                        order.note !== null && order.orderStatusDTO.status !== 4? `<div class="info-row">
                            <span class="label">Ghi chú đơn hàng</span>
                            <span class="value">${order.note}</span>
                        </div>` : ""
                    }

                    <div class="info-row">
                        <span class="label">Tổng giá trị đơn hàng</span>
                        <span class="value total-price">${order.total_price.toLocaleString("vi-VN") + " đ"}</span>
                    </div>
                </div>
                ${
                    order.orderStatusDTO.status === 1 ? `<button data-id="${order.order_id}" class="cancel-order">Hủy đơn hàng</button>` : ""
                }
            </div>
        </div>
    </div>
    `;

    return orderHTML;
};


const renderOrders = (orders) => {
    containerOrder.innerHTML = orders.map(order => renderOrder(order)).join('');

    const cancelOrderBtns = document.querySelectorAll(".cancel-order");
    const modal = document.querySelector("#cancel-order");
    const closeModalBtn = modal.querySelector(".close");
    const cancelBtn = modal.querySelector(".cancel");
    const submitBtn = modal.querySelector(".submit");
    const errMess = document.querySelector(".err-mess")

    let selectedOrderId = null; 

    cancelOrderBtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            selectedOrderId = btn.getAttribute("data-id");
            Utils.openModal(modal);
            errMess.style.opacity = 0
        });
    });

    closeModalBtn.addEventListener("click", () => {
        Utils.closeModal(modal);
    });

    cancelBtn.addEventListener("click", () => {
        Utils.closeModal(modal);
    });
    modal.addEventListener("click",(e)=>{
        if(e.target === modal){
            Utils.closeModal(modal)
        }
    })

    submitBtn.addEventListener("click", async () => {
        const reason = document.getElementById("cancel-reason").value;
        const status = 4;

        if (reason.trim()) {
            errMess.style.opacity = 0
            const changeStatusRequest = {
                order_id: selectedOrderId,
                note: reason,
                status: status,
            };
            try {
                const response = await Api.changeStatusOrder(changeStatusRequest);
                if(response.status === 200){
                    console.log(response);
                    Utils.getToast("success","Đã hủy đơn hàng thành công.");
                    Utils.closeModal(modal);
                    location.reload()
                    
                }else{
                    console.log(response);
                    Utils.getToast("success","Hủy đơn hàng thất bại.");
                    Utils.closeModal(modal);
                }
            } catch (error) {
                console.error("Lỗi khi hủy đơn hàng:", error);
                Utils.closeModal(modal);
                Utils.getToast("success","Hủy đơn hàng thất bại.");
            }
        } else {
            errMess.style.opacity = 1
        }
    });
};


const fetchOrders = async (status) => {
    try {
        const response = await Api.getOrderByUserAndStatus(status);
        if (response.status === 200) {
            renderOrders(response.orderResponses);
        } else {
            if (response.status === 202) {
                const container = document.querySelector(".order-list");
                container.innerHTML = '<p style="text-align: center">Chưa có đơn hàng nào</p>'; 
            }
        }
    } catch (error) {
        console.log(error)
        Utils.getToast("error", "Máy chủ lỗi, vui lòng thử lại!");
    }
};


const menu = document.querySelectorAll(".menu li");
menu.forEach((e) => {
    e.addEventListener("click", () => {
        e.classList.add("active");
        menu.forEach((u) => {
            if (u !== e) {
                u.classList.remove("active");
            }
        });

        const statusId = e.getAttribute("id");
        switch (statusId) {
            case "waiting":
                fetchOrders(1); 
                break;
            case "shipping":
                fetchOrders(2); 
                break;
            case "shipped":
                fetchOrders(3); 
                break;
            case "canceled":
                fetchOrders(4); 
                break;
            default:
                fetchOrders(1); 
        }
    });
});

fetchOrders(1); 
