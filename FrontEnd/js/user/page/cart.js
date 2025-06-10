import Utils from "../Utils.js";
import Api from "../Api.js";

const SHIPPING_FEE = 30000;

const container = document.querySelector('.cart-container');
const checkAll = document.querySelector('.check-all');
const checkItems = document.querySelectorAll('.check-item');
const subtotalElement = document.querySelector('.subtotal');
const totalElement = document.querySelector('.total');
const cartItemsContainer = document.getElementById('cart-items');
const checkoutButton = document.getElementById('checkout-button');

function setupUI() {
    container.insertAdjacentHTML("beforeend", Utils.getFooter());
    Utils.getHeader();
}

function handleQuantityChange(event) {
    const button = event.target;
    const container = button.closest('.quantity');
    const input = container.querySelector('.quantity-display');
    const row = button.closest('tr');
    const maxQuantity = parseInt(row.dataset.maxQuantity, 10);
    let quantity = parseInt(input.value, 10);

    if (button.classList.contains('increase')) {
        if (quantity < maxQuantity) {
            quantity++;
        } else {
            return;
        }
    } else if (button.classList.contains('decrease') && quantity > 1) {
        quantity--;
    }

    input.value = quantity;
    updateTotalPrice();
}

function setupQuantityControls() {
    document.querySelectorAll('.quantity-button').forEach(button => {
        button.addEventListener('click', handleQuantityChange);
    });

    document.querySelectorAll('.quantity-display').forEach(input => {
        input.addEventListener('change', (event) => {
            const row = event.target.closest('tr');
            const maxQuantity = parseInt(row.dataset.maxQuantity, 10);
            let value = parseInt(event.target.value, 10);

            if (isNaN(value) || value < 1) {
                value = 1;
            } else if (value > maxQuantity) {
                value = maxQuantity;
            }

            event.target.value = value;
            updateTotalPrice();
        });
    });
}

function updateAllCheckboxes(checked) {
    const checkboxes = document.querySelectorAll('.check-item');
    checkboxes.forEach(checkbox => {
        checkbox.checked = checked;
    });
    updateTotalPrice();
}

function updateMainCheckbox() {
    const checkboxes = document.querySelectorAll('.check-item');
    const allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);
    const mainCheckbox = document.querySelector('.check-all');
    mainCheckbox.checked = allChecked;
    updateTotalPrice();
}

function setupCheckboxControls() {
    checkAll.addEventListener('change', (event) => {
        updateAllCheckboxes(event.target.checked);
    });

    document.addEventListener('change', (event) => {
        if (event.target.classList.contains('check-item')) {
            updateMainCheckbox();
        }
    });
}

function updateTotalPrice() {
    const subtotal = Array.from(document.querySelectorAll('.check-item'))
        .reduce((total, check) => {
            if (check.checked) {
                const row = check.closest('tr');
                const quantity = parseInt(row.querySelector('.quantity-display').value, 10);
                const price = parseInt(row.querySelector('.price').dataset.price, 10);
                return total + (price * quantity);
            }
            return total;
        }, 0);

    subtotalElement.textContent = `${formatCurrency(subtotal)}đ`;
    totalElement.textContent = `${formatCurrency(subtotal + SHIPPING_FEE)}đ`;
}

function handleCheckout() {
    const cartData = Array.from(document.querySelectorAll('.check-item'))
        .filter(check => check.checked)
        .map(check => {
            const row = check.closest('tr');
            const name = row.querySelector('.name').textContent.trim();
            const size = row.querySelector('.size').textContent.split(': ')[1];
            const color = row.querySelector('.color').textContent.split(': ')[1];
            const image = row.querySelector('.product-img .image').getAttribute('src');
            const quantity = parseInt(row.querySelector('.quantity-display').value, 10);
            const price = parsePrice(row.querySelector('.price').textContent);

            const productId = row.dataset.productId;
            const colorId = row.dataset.colorId;
            const sizeId = row.dataset.sizeId;

            return {
                name,
                size,
                color,
                image,
                quantity,
                price,
                productId,
                colorId,
                sizeId
            };
        });
    console.log(cartData)
    if(cartData.length > 0){
        console.log("heheh")
        localStorage.setItem('cartData', JSON.stringify(cartData));
        window.location.href = "/pay-page"
    }else{
        Utils.getToast("warning","Đơn hàng bạn đang trống!")
        return
    }
}


function createCartItemRow(item) {
    if (item.quantity > item.specificationsDTO.quantity) {
        item.quantity = item.specificationsDTO.quantity;
    }

    const tr = document.createElement('tr');
    tr.dataset.id = item.card_item_id;
    tr.dataset.maxQuantity = item.specificationsDTO.quantity;
    tr.dataset.productId = item.specificationsDTO.productDTO.product_id;
    tr.dataset.colorId = item.specificationsDTO.colorDTO.color_id;
    tr.dataset.sizeId = item.specificationsDTO.sizeDTO.size_id;

    tr.innerHTML = `
        <td class="product-img">
            <input type="checkbox" class="check-item rounded-checkbox">
            <div>
                <img class="image" src="data:image/jpeg;base64,${item.specificationsDTO.productDTO.image}" 
                     alt="${item.specificationsDTO.productDTO.name}">
            </div>
        </td>
        <td class="product-detail">
            <a href="#" class="name">${item.specificationsDTO.productDTO.name}</a>
            <p class="color">Màu sắc: ${item.specificationsDTO.colorDTO.name}</p>
            <p class="size">Size: ${item.specificationsDTO.sizeDTO.name}</p>
            <p class="stock">Còn lại: ${item.specificationsDTO.quantity} sản phẩm</p>
        </td>
        <td>
            <div class="quantity">
                <button class="quantity-button decrease">-</button>
                <input class="quantity-display" value="${item.quantity}">
                <button class="quantity-button increase">+</button>
            </div>
        </td>
        <td class="price" data-price="${item.specificationsDTO.productDTO.price}">
            ${formatCurrency(item.specificationsDTO.productDTO.price)}đ
        </td>
        <td class="action">
            <span data-id = ${item.specificationsDTO.specifications_id} class="material-symbols-outlined delete-item">close</span>
        </td>
    `;
    return tr;
}


async function fetchAndRenderCartItems() {
    try {
        const response = await Api.getCartByAccout();
        if(response.status === 200){

            const cartItems = response.cart_ItemsDTOList;

            if(cartItems.length > 0){
                const fragment = document.createDocumentFragment();
                cartItems.forEach(item => {
                    // if (item.quantity <= item.specificationsDTO.quantity) {
                    //     const row = createCartItemRow(item);
                    //     fragment.appendChild(row);
                    // }
                    const row = createCartItemRow(item);
                    fragment.appendChild(row);
                });
                
                cartItemsContainer.appendChild(fragment);
                
                setupQuantityControls();
                setupCheckboxControls();
                updateMainCheckbox();
            }else{
                document.querySelector(".cart-item-list").innerHTML = '<p style= "text-align: center;">Giỏ hàng trống!</p>'
            }
        }
    } catch (error) {
        console.log(error)
        Utils.getToast("error","Máy chủ lỗi, vui lòng thử lại!");
    }
}

function parsePrice(priceString) {
    return parseInt(priceString.replace(/\D/g, ''), 10);
}

function formatCurrency(price) {
    return price.toLocaleString();
}

async function deleteItemInCart(id) {
    try {
        const response = await Api.deleteItemInCart(id)
        console.log(response)
        if(response.status === 200){
            Utils.getToast("success","Xóa sản phẩm thành công!")
            updateMainCheckbox();
            updateTotalPrice();
            setTimeout(()=>{
                location.reload()
            },500)
        }
    } catch (error) {
        if(error.status === 400){
            Utils.getToast("warning", "Có lỗi, vui lòng thử lại!")
        }else{
            if(error.status === 500){
                Utils.getToast("error", "Máy chủ lỗi, vui lòng thử lại!")
            }
        }
    }
}

function initializeCart() {
    setupUI();
    setupQuantityControls();
    setupCheckboxControls();
    checkoutButton.addEventListener('click', handleCheckout);

    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('delete-item')) {
            const row = event.target.closest('tr');
            console.log(row)
            if (row) {
                const id = row.dataset.id
                console.log(id)
                deleteItemInCart(id)
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initializeCart();
    fetchAndRenderCartItems();
});