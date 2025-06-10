import Utils from "../Utils.js"
import Api from "../Api.js"

async function loadAddress() {
    try {
        const response = await Api.getDeleveryByUser();

        if (response.status === 200) {
            const addresses = response.delevery_InformationDTOList;

            // Nếu không có địa chỉ nào thì chuyển hướng về trang /personal-infor
            if (!addresses || addresses.length === 0) {
                window.location.href = "/personal-infor";
                return;
            }

            const defaultAddressContainer = document.querySelector('.infor-container .address-content');
            const otherAddressesContainer = document.querySelector('#modal-container .content');
            const openModalBtn = document.querySelector(".btn-change-address button");

            defaultAddressContainer.innerHTML = '';
            otherAddressesContainer.innerHTML = '';

            openModalBtn.disabled = addresses.length <= 1;

            addresses.forEach((address) => {
                if (address._default) {
                    defaultAddressContainer.setAttribute("data-id", `${address.de_infor_id}`);
                    defaultAddressContainer.innerHTML = `
                        <div>
                            <p id="name" class="default-name">${address.name}</p>
                            <p id="phone" class="default-phone-number">${address.phone}</p>
                        </div>
                        <p id="address" class="address-detail">${address.address_line_2}, ${address.address_line_1}</p>
                    `;
                } else {
                    const addressHTML = `
                        <div class="address-container" data-id="${address.de_infor_id}">
                            <div class="action-address">
                                <input type="checkbox" name="" id="">
                            </div>
                            <div class="address-content">
                                <div>
                                    <p class="name">${address.name}</p>
                                    <p class="phone">${address.phone}</p>
                                </div>
                                <p class="address-detail">${address.address_line_2}, ${address.address_line_1}</p>
                            </div>
                        </div>
                    `;
                    otherAddressesContainer.innerHTML += addressHTML;
                }
            });
        } else {
            if (response.status === 202) {
                const payBtn = document.querySelector(".pay-btn");
                payBtn.disabled = true;
                const defaultAddressContainer = document.querySelector('.infor-container .address-container');
                defaultAddressContainer.innerHTML = `
                    <button class="new-address-btn">
                        <a href="/personal-infor">Thêm địa chỉ giao hàng mới</a>
                    </button>
                `;
            }
        }
    } catch (error) {
        if(error.status === 400){
            window.location.href = "/personal-infor";
            return
        }
        console.error('Lỗi khi tải địa chỉ:', error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadAddress()
    const closeModalBtn = document.querySelector(".modal-body .close")
    const openModalBtn = document.querySelector(".btn-change-address")
    const modal = document.querySelector("#modal-container")
    const cancelBtn = document.querySelector(".cancel")
    const container = document.querySelector('.pay-container')
    const payBtn = document.querySelector(".pay-btn")
    
    Utils.getHeader()
    container.insertAdjacentHTML("beforeend", Utils.getFooter())
    
    openModalBtn.addEventListener("click", () => {
        Utils.openModal(modal)
    })
    
    closeModalBtn.addEventListener("click", () => {
        Utils.closeModal(modal)
    })
    
    cancelBtn.addEventListener("click", () => {
        Utils.closeModal(modal)
    })
    
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            Utils.closeModal(modal)
        }
    })

    const provisionalTotal = document.querySelector(".provisional-total")
    const finalTotal = document.querySelector(".final-total")
    const cartData = JSON.parse(localStorage.getItem("cartData")) || [];
    let totalPrice = 0
    
    // Kiểm tra nếu có sản phẩm trong giỏ hàng
    if (cartData.length > 0) {
        const tbody = document.querySelector(".pay-item-list tbody");
        tbody.innerHTML = "";
        cartData.forEach(product => {
            const row = document.createElement("tr");
            totalPrice += product.price * product.quantity
            row.innerHTML = `
                <td class="product-img">
                    <div><img src="${product.image}" alt=""></div>
                </td>
                <td class="product-detail">
                    <a href="" class="name">${product.name}</a>
                    <p class="color">Màu sắc: ${product.color}</p>
                    <p class="size">Size: ${product.size}</p>
                </td>
                <td><p class="quantity-display">x${product.quantity}</p></td>
                <td class="price">${(product.price * product.quantity).toLocaleString("vi-VN")+ "đ"} </td>
            `;
            tbody.appendChild(row);
        });
        provisionalTotal.textContent = totalPrice.toLocaleString("vi-VN") + "đ"
        finalTotal.textContent = (totalPrice + 30000).toLocaleString("vi-VN") + "đ"
        
        payBtn.addEventListener("click", async (e) => {
            if (cartData.length === 0) {
                Utils.getToast("warning", "Giỏ hàng của bạn không có sản phẩm để thanh toán.");
                return;
            }
            const defaultAddressContainer = document.querySelector('.infor-container .address-content');
            const idAddress = defaultAddressContainer.dataset.id
            const note = document.querySelector("#orderNote").value
            console.log(note)
            const orderData = {
                idAddress: idAddress,
                note: note,
                fee: 30000,
                orderRequests: cartData.map(product => ({
                    productId: product.productId,
                    colorId: product.colorId,
                    sizeId: product.sizeId,
                    quantity: product.quantity
                }))
            };

            try {
                const response = await Api.createNewOrder(orderData);
                if (response.status === 200) {
                    sessionStorage.setItem('orderSuccess', 'true');
                    localStorage.removeItem("cartData");
                    window.location.href = "/success";
                } else {
                    sessionStorage.setItem('orderError', 'true');
                    localStorage.removeItem("cartData");
                    window.location.href = "/error";
                }
            } catch (error) {
                Utils.getToast("error", "Có lỗi xảy ra, vui lòng thử lại!");
            }
        })
    } else {
        window.location.href = "/cart"
    }

    const checkboxes = document.querySelectorAll('.action-address input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            if (this.checked) {
                checkboxes.forEach(otherCheckbox => {
                    if (otherCheckbox !== this) {
                        otherCheckbox.checked = false;
                    }
                });
            }
        });
    });

    const submitBtn = document.querySelector(".modal-body .submit");
    
    submitBtn.addEventListener("click", () => {
        const checkedAddress = document.querySelector('.action-address input[type="checkbox"]:checked');
        
        if (!checkedAddress) {
            Utils.getToast("warning", "Vui lòng chọn địa chỉ giao hàng");
            return;
        }

        const selectedAddressContainer = checkedAddress.closest('.address-container');
        const selectedAddressId = selectedAddressContainer.dataset.id;
        
        const name = selectedAddressContainer.querySelector('.name').textContent;
        const phone = selectedAddressContainer.querySelector('.phone').textContent;
        const addressDetail = selectedAddressContainer.querySelector('.address-detail').textContent;

        const defaultAddressContainer = document.querySelector('.infor-container .address-content');
        defaultAddressContainer.setAttribute("data-id", selectedAddressId);
        defaultAddressContainer.innerHTML = `
            <div>
                <p id="name" class="default-name">${name}</p>
                <p id="phone" class="default-phone-number">${phone}</p>
            </div>
            <p id="address" class="address-detail">${addressDetail}</p>
        `;

        const modal = document.querySelector("#modal-container");
        Utils.closeModal(modal);
        
        Utils.getToast("success", "Đã cập nhật địa chỉ giao hàng");
    });
});
