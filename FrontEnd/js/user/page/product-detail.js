import Api from "../Api.js";
import Utils from "../Utils.js";
import ViewTracker from "./view-tracker.js";

document.addEventListener("DOMContentLoaded", () => {
    // Lấy ID sản phẩm từ URL
    const path = window.location.pathname;
    const match = path.match(/\/product-detail\/(\d+)/);
    const productId = match ? match[1] : null;

    // Bắt đầu đếm thời gian
    if (productId) {
        ViewTracker.startTracking(productId);
    }

    // Dừng đếm khi rời khỏi trang
    window.addEventListener('beforeunload', () => {
        ViewTracker.stopTracking(productId);
        ViewTracker.saveToStorage();
    });
    
    const state = {
        data: {},
        specifications: [],
        selectedColor: null,
        selectedSize: null,
        currentIndexSameProduct: 0,
        itemsPerPageSameProduct: 4
    };
    
    const imageSrc = document.querySelector(".detail-container .image img");
    
    async function fetchSpecifications(productId) {
        try {
            const data = await Api.getSpecByProduct(productId);
            console.log(data)
            if(data.status === 200){
                state.specifications = Array.isArray(data.specificationsDTOList) ? data.specificationsDTOList : [];
                renderOptions();
            }
        } catch (error) {
            console.error('Error fetching specifications:', error);
            state.specifications = [];
            renderOptions();
        }
    }
    
    function renderOptions() {
        renderColors();
        renderSizes();
    }
    
    function getAvailableItems(items, type) {
        console.log(items)
        return [...new Set(
            state.specifications
                .filter(spec => {
                    if (type === 'colors' && state.selectedSize) {
                        return spec.quantity > 0 && spec.sizeDTO.size_id === state.selectedSize.size_id;
                    } else if (type === 'sizes' && state.selectedColor) {
                        return spec.quantity > 0 && spec.colorDTO.color_id === state.selectedColor.color_id;
                    }
                    return spec.quantity > 0;
                })
                .map(spec => JSON.stringify(type === 'colors' ? spec.colorDTO : spec.sizeDTO))
        )].map(item => JSON.parse(item));
    }
    
    function renderColors() {
        const colorOption = document.querySelector('.color-option');
        if (!colorOption) return;
    
        colorOption.innerHTML = '';
        const availableColors = getAvailableItems(state.specifications, 'colors');
    
        availableColors.forEach(color => {
            const li = document.createElement('li');
            li.dataset.colorId = color.color_id;
            li.dataset.name = color.name;
            li.style.backgroundColor = "#" + color.hex;
            li.classList.add('color-item');
            li.addEventListener('click', () => onColorSelected(color));
            colorOption.appendChild(li);
        });
    
        updateColorSelection();
    }
    
    function renderSizes() {
        const sizeOption = document.querySelector('.size-option');
        if (!sizeOption) return;
    
        sizeOption.innerHTML = '';
        const availableSizes = getAvailableItems(state.specifications, 'sizes');
        console.log(availableSizes)
    
        availableSizes.forEach(size => {
            const li = document.createElement('li');
            li.textContent = size.name;
            li.dataset.sizeId = size.size_id;
            li.classList.add('size-item');
            li.addEventListener('click', () => onSizeSelected(size));
            sizeOption.appendChild(li);
        });
    
        updateSizeSelection();
    }
    
    function onColorSelected(color) {
        if (state.selectedColor && state.selectedColor.color_id === color.color_id) {
            state.selectedColor = null;
            renderOptions();
        } else {
            state.selectedColor = color;
            renderSizes();
        }
        updateColorSelection();
    }
    
    function onSizeSelected(size) {
        if (state.selectedSize && state.selectedSize.size_id === size.size_id) {
            state.selectedSize = null;
            renderOptions(); 
        } else {
            state.selectedSize = size;
            renderColors(); 
        }
        updateSizeSelection();
    }
    
    function updateColorSelection() {
        const colorItems = document.querySelectorAll('.color-item');
        colorItems.forEach(item => {
            const colorId = parseInt(item.dataset.colorId, 10);
            item.classList.toggle('selected', 
                state.selectedColor && colorId === state.selectedColor.color_id
            );
        });
    }
    
    function updateSizeSelection() {
        const sizeItems = document.querySelectorAll('.size-item');
        sizeItems.forEach(item => {
            const sizeId = parseInt(item.dataset.sizeId, 10);
            item.classList.toggle('selected', 
                state.selectedSize && sizeId === state.selectedSize.size_id
            );
        });
    }
    
    function fillData(data) {
        const productDetailContainer = document.querySelector(".product-detail");
        if (!productDetailContainer) return;
        
        imageSrc.setAttribute("src", `data:image/jpeg;base64,${data.image}`);
        productDetailContainer.innerHTML = `
            <div class="navigate">
                <a href="">Trang chủ / </a>
                <a href="">Áo thun / </a>
                <a href="">${data.name}</a>
            </div>
            <div>
                <h4 class="name">${data.name}</h4>
                <p class="sold">Đã bán được ${data.sold} sản phẩm</p>
            </div>
            <p class="price">${(data.price).toLocaleString() + "đ"}</p>
            <div class="color">
                <label for="">Color</label>
                <ul class="color-option">
                </ul>
            </div>
            <div class="size">
                <label for="">Size</label>
                <ul class="size-option">
                </ul>
            </div>
            <button class="guide"> 
                <img src="../../img/utils//ruler.png" alt="">
                Hướng dẫn chọn size
            </button>
            <p class="err-mess"></p>
            <div class="quantity">
                <label for="">Số lượng</label>
                <div>
                    <button id="decrease" class="quantity-button">-</button>
                    <input id="quantity" class="quantity-display" value="1">
                    <button id="increase" class="quantity-button">+</button>
                </div>
            </div>
            <div class="action">
                <button class="buy-now"><a href="/pay-page" id="checkout-button">Mua ngay</a></button>
                <button class="add-cart">Thêm vào giỏ hàng</button>
            </div>
            <div class="description">
                <h2>MÔ TẢ SẢN PHẨM</h2>
                <p>${data.description}</p>
            </div>
        `;
        
        setupModalHandlers();
        setupCartHandler();
        setupQuantityHandlers();
        buyNowHandlers();
    }

    function parsePrice(priceString) {
        return parseInt(priceString.replace(/\D/g, ""), 10);
    }    

    function setUpNextPrev(){
        let currentIndexNewProduct = 0;
        const itemsPerPageNewProduct = 4;
        const totalNewProduct = document.querySelectorAll('.same-product-list .product').length;
        const nextNewProductBtn = document.querySelector(".next-same-product")
        const prevNewProductBtn = document.querySelector(".prev-same-product")

        totalNewProduct > 4 ? nextNewProductBtn.style.display = "inline-block" : nextNewProductBtn.style.display = "none"

        function updateCarouselNewProduct() {
            const newProductList = document.querySelector('.same-product-list')
            const offset = -(currentIndexNewProduct * 25);
            const pixel = currentIndexNewProduct * 14;
            newProductList.style.transform = `translateX(calc(${offset}% - ${pixel}px))`;
        }

        function prevNewProduct() {
            if (currentIndexNewProduct > 0) {
                currentIndexNewProduct--;
                updateCarouselNewProduct();
                if(currentIndexNewProduct <= 0){
                    prevNewProductBtn.style.display = "none"
                }
                nextNewProductBtn.style.display = "block"
            }
        }

        function nextNewProduct() {
            if (currentIndexNewProduct < totalNewProduct - itemsPerPageNewProduct) {
                currentIndexNewProduct++;
                updateCarouselNewProduct();
                if(currentIndexNewProduct >= totalNewProduct - itemsPerPageNewProduct){
                    nextNewProductBtn.style.display = "none"
                }
                prevNewProductBtn.style.display = "block"
            }
        }

        prevNewProductBtn.addEventListener("click",()=>{
            prevNewProduct()
        })
        nextNewProductBtn.addEventListener("click",()=>{
            nextNewProduct()
        })
    }
    
    function buyNowHandlers(){
        const buyNowBtn = document.querySelector(".buy-now")
        const errMess = document.querySelector(".err-mess")
        buyNowBtn.addEventListener("click",(e)=>{
            const colorOptionChosse = document.querySelector(".color-option .selected")
            const sizeOptionChosse = document.querySelector(".size-option .selected")
            if(!sizeOptionChosse){
                e.preventDefault()
                errMess.textContent = "Vui lòng chọn kích thước!"
                errMess.style.opacity = 1
                return
            }
            if(!colorOptionChosse ){
                e.preventDefault()
                errMess.textContent = "Vui lòng chọn màu!"
                errMess.style.opacity = 1
                return
            }
            const cartData = [];    
            const name = document.querySelector(".product-detail .name").textContent.trim();
            const image = imageSrc.getAttribute("src");
            const colorId = colorOptionChosse.getAttribute("data-color-id");
            const sizeId = sizeOptionChosse.getAttribute("data-size-id");
            const size = sizeOptionChosse.textContent;
            const color = colorOptionChosse.getAttribute("data-name");
            const quantity = document.querySelector(".product-detail #quantity").value;
            const priceString = document.querySelector(".product-detail .price").textContent;
            const price = parsePrice(priceString );
            cartData.push({ name, size, color, image, quantity, price, productId, colorId, sizeId });
            console.log(cartData)
            localStorage.setItem("cartData", JSON.stringify(cartData));
        })
    }

    function setupModalHandlers() {
        const modal = document.querySelector("#modal-guide-container");
        const openModalBtn = document.querySelector(".guide");
        const closeModalBtn = document.querySelector(".modal-body span");

        if (openModalBtn && modal) {
            openModalBtn.addEventListener("click", () => Utils.openModal(modal));
        }

        if (closeModalBtn && modal) {
            closeModalBtn.addEventListener("click", () => Utils.closeModal(modal));
        }

        if (modal) {
            modal.addEventListener("click", (e) => {
                if (e.target === modal) Utils.closeModal(modal);
            });
        }
    }

    function setupCartHandler() {
        const addToCartButton = document.querySelector(".add-cart");
        if (addToCartButton) {
            addToCartButton.addEventListener('click', addItemToCart);
        }
    }

    function getAvailableQuantity() {
        const selectedColorId = state.selectedColor ? state.selectedColor.color_id : null;
        const selectedSizeId = state.selectedSize ? state.selectedSize.size_id : null;
    
        if (!selectedColorId || !selectedSizeId) return -1;
    
        const spec = state.specifications.find(
            s => s.colorDTO.color_id === selectedColorId && s.sizeDTO.size_id === selectedSizeId
        );

        return spec ? spec.quantity : 0;
    } 
    
    function getIdSpec() {
        const selectedColorId = state.selectedColor ? state.selectedColor.color_id : null;
        const selectedSizeId = state.selectedSize ? state.selectedSize.size_id : null;
    
        if (!selectedColorId || !selectedSizeId) return -1;
    
        const spec = state.specifications.find(
            s => s.colorDTO.color_id === selectedColorId && s.sizeDTO.size_id === selectedSizeId
        );

        return spec ? spec.specifications_id : 0;
    } 

    // function setupQuantityHandlers() {
    //     document.querySelectorAll('#decrease').forEach(button => {
    //         button.addEventListener('click', function() {
    //             const quantityDisplay = this.nextElementSibling;
    //             const currentQuantity = parseInt(quantityDisplay.value);
    //             if (currentQuantity > 1) {
    //                 quantityDisplay.value = currentQuantity - 1;
    //             }
    //         });
    //     });

    //     document.querySelectorAll('#increase').forEach(button => {
    //         button.addEventListener('click', function() {
    //             const quantityDisplay = this.previousElementSibling;
    //             const currentQuantity = parseInt(quantityDisplay.value);
    //             quantityDisplay.value = currentQuantity + 1;
    //         });
    //     });
    // }

    function setupQuantityHandlers() {
        const quantityInput = document.querySelector(".product-detail #quantity");
        const decreaseButton = document.querySelector("#decrease");
        const increaseButton = document.querySelector("#increase");
        const errMess = document.querySelector(".err-mess");
    
        decreaseButton.addEventListener('click', function () {
            const currentQuantity = parseInt(quantityInput.value);
            if (currentQuantity > 1) {
                quantityInput.value = currentQuantity - 1;
                errMess.style.opacity = 0;
            }
        });
    
        increaseButton.addEventListener('click', function () {
            const currentQuantity = parseInt(quantityInput.value);
            const availableQuantity = getAvailableQuantity();
            if(availableQuantity == -1){
                errMess.textContent = `Vui lòng chọn size và màu sắc!`;
                errMess.style.opacity = 1;
                quantityInput.value = 1
                return
            }
            if (currentQuantity < availableQuantity) {
                quantityInput.value = currentQuantity + 1;
                errMess.style.opacity = 0;
            } else {
                errMess.textContent = `Chỉ còn ${availableQuantity} sản phẩm có sẵn!`;
                errMess.style.opacity = 1;
            }
        });
    
        quantityInput.addEventListener('input', function () {
            const currentQuantity = parseInt(quantityInput.value);
            const availableQuantity = getAvailableQuantity();
    
            if (currentQuantity > availableQuantity) {
                quantityInput.value = availableQuantity;
                errMess.textContent = `Chỉ còn ${availableQuantity} sản phẩm có sẵn!`;
                errMess.style.opacity = 1;
            } else {
                errMess.style.opacity = 0;
            }
        });
    }
    

    async function fetchProductByCategory(id) {
        try {
            const response = await Api.getProductByCategory(id);
            if (response.status === 200) {
                state.data = response.productSpecDTOList;
                console.log(state.data)
                const containerSamePro = document.querySelector(".same-product-list")
                Utils.fillProduct(state.data, containerSamePro);
                setUpNextPrev();
            }
        } catch (error) {
            Utils.getToast("error", "Máy chủ lỗi lấy sp theo danh mục");
        }
    }

    async function fetchData(id) {
        try {
            const response = await Api.getProductById(id);
            if (response.status === 200) {
                state.data = response.productDTO;
                fillData(state.data);
                console.log(state.data.categoryDTO)
                await fetchProductByCategory(state.data.categoryDTO.category_id);
            }
        } catch (error) {
            Utils.getToast("error", "Máy chủ lỗi vui lòng thử lại");
        }
    }

    // async function addItemToCart() {
    //     const errMess = document.querySelector(".err-mess")
    //     const colorOptionChosse = document.querySelector(".color-option .selected")
    //     const sizeOptionChosse = document.querySelector(".size-option .selected")
    //     if(!colorOptionChosse ){
    //         errMess.textContent = "Vui lòng chọn màu!"
    //         errMess.style.opacity = 1
    //         return
    //     }
    //     if(!sizeOptionChosse){
    //         errMess.textContent = "Vui lòng chọn kích thước!"
    //         errMess.style.opacity = 1
    //         return
    //     }
    //     const colorId = colorOptionChosse.getAttribute("data-color-id");
    //     const sizeId = sizeOptionChosse.getAttribute("data-size-id");
    //     const quantity = document.querySelector(".product-detail #quantity").value;
    //     const data = {
    //         productId, 
    //         sizeId, 
    //         colorId,
    //         quantity
    //     }
    //     try {
    //         const response = await Api.addCartItem(data)
    //         if(response.status === 200){
    //             Utils.getToast("success", "Thêm vào giỏ hàng thành công!")
    //             errMess.style.opacity = 0
    //         }
    //     } catch (error) {
    //         Utils.getToast("error", "Máy chủ lỗi, vui lòng thử lại!")
    //     }
    // }

    async function addItemToCart() {
        const errMess = document.querySelector(".err-mess");
        const colorOptionChosse = document.querySelector(".color-option .selected");
        const sizeOptionChosse = document.querySelector(".size-option .selected");

        
        if (!colorOptionChosse) {
            errMess.textContent = "Vui lòng chọn màu!";
            errMess.style.opacity = 1;
            return;
        }
        if (!sizeOptionChosse) {
            errMess.textContent = "Vui lòng chọn kích thước!";
            errMess.style.opacity = 1;
            return;
        }
        
        // const colorId = colorOptionChosse.getAttribute("data-color-id");
        // const sizeId = sizeOptionChosse.getAttribute("data-size-id");
        const quantity = parseInt(document.querySelector(".product-detail #quantity").value);
        const availableQuantity = getAvailableQuantity();
        
        if (quantity > availableQuantity) {
            errMess.textContent = `Chỉ còn ${availableQuantity} sản phẩm có sẵn!`;
            errMess.style.opacity = 1;
            return;
        }

        const spec_id = getIdSpec();
        
        const data = {
            productId,
            spec_id,
            quantity
        };

    
        try {
            const response = await Api.addCartItem(data);
            if (response.status === 200) {
                console.log(response)
                Utils.getToast("success", "Thêm vào giỏ hàng thành công!");
                errMess.style.opacity = 0;
            }
        } catch (error) {
            Utils.getToast("error", "Máy chủ lỗi, vui lòng thử lại!");
        }
    }
    

    function initializePage() {
        Utils.getHeader();
        const container = document.querySelector('.container');
        if (container) {
            container.insertAdjacentHTML("beforeend", Utils.getFooter());
        }

        const btnAddAnimation = document.querySelectorAll(".btn");
        btnAddAnimation.forEach((btn) => Utils.addAnimation(btn));

        if (productId) {
            fetchData(productId);
            fetchSpecifications(productId);
        }
    }

    initializePage();
});