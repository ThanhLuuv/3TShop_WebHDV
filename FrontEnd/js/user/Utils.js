import Api from "./Api.js";
export default class Utils{
    static async addItemToCart(idProduct) {
        try {
            const response = await Api.addCartItem(idProduct);
            if (response.status === 200) {
                this.getToast("success", "Thêm vào giỏ hàng thành công!");
            }
        } catch (error) {
            this.getToast("error","Có lỗi xảy ra vui lòng thử lại!");
        }
    }    
    static getHeader() {
        const html = `
            <header class="header">
                <div class="logo">
                    <a href="/"><img src="../../img/utils/logoShop.png" alt=""></a>
                </div>

                <div class="menu-action">
                    <div class="search-container">
                        <i id="search-btn" class="material-icons">search</i>
                        <input type="text" id="search-input" placeholder="Tìm kiếm sản phẩm...">
                        <i class="border-left material-symbols-outlined image-search-btn">image_search</i>
                    </div>

                    <div class="menu-icons">
                        <a href="/cart">
                            <i class="material-symbols-outlined">shopping_cart</i>
                        </a>
                        <div>
                            <i class="material-symbols-outlined menu-btn">account_circle</i>
                            <ul class="nav">
                                <li>
                                    <a href="/personal-infor">
                                        Tài khoản của bạn
                                        <span class="material-symbols-outlined">shield_person</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="/order">
                                        Đơn hàng
                                        <span class="material-symbols-outlined">package_2</span>
                                    </a>
                                </li>
                                <li class="btn-logout">
                                    <a href="#">
                                        Đăng xuất
                                        <span class="material-symbols-outlined">move_item</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div id="toast-container"></div>
                <div id="logout">
                    <div class="modal-logout">
                        <span class="close material-symbols-outlined">close</span>
                        <div class="content">
                            <div>
                                <img src="../../img/utils/quit.png" />
                            </div>
                            <h4>ĐĂNG XUẤT</h4>
                            <p>Bạn có chắc chắn muốn đăng xuất không?</p>
                            <div class="btn-container">
                                <a class="cancel">Thoát</a>
                                <a href="/login" class="submit">Đăng xuất</a>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal-upload">
                    <div class="modal-upload-content">
                        <div class="upload-area">
                            <div class="upload-placeholder">
                                <img src="../../img/utils/icon-upload.png" alt="Upload icon" class="upload-icon">
                                <input type="file" id="file-upload" accept="image/*" multiple hidden>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button class="upload-file-btn">
                                    Tải hình ảnh lên
                                    <span class="material-symbols-outlined">
                                        upload
                                    </span>                 
                            </button>
                            <button class="search-product-btn">
                                Tìm kiếm sản phẩm 
                                <span class="material-symbols-outlined">
                                    action_key
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>
        `;
        document.body.insertAdjacentHTML('afterbegin', html);

        const openMenu = () => {
            const nav = document.querySelector('.nav');
            nav.classList.toggle("active-menu");
        };

        const menuBtn = document.querySelector('.menu-btn');
        if (menuBtn) {
            menuBtn.addEventListener('click', openMenu);
        }

        const logoutContainer = document.querySelector("#logout");
        const closeLogout = document.querySelector("#logout .close");
        const cancelLogout = document.querySelector("#logout .cancel");
        const logout = document.querySelector("#logout .submit");
        const btnLogout = document.querySelector(".btn-logout");
        
        btnLogout.addEventListener("click", () => {
            this.openModal(logoutContainer);
        });
        closeLogout.addEventListener("click", () => {
            this.closeModal(logoutContainer);
        });
        cancelLogout.addEventListener("click", () => {
            this.closeModal(logoutContainer);
        });
        logoutContainer.addEventListener("click", (e) => {
            if (e.target === logoutContainer) {
                this.closeModal(logoutContainer);
            }
        });

        const searchInput = document.querySelector("#search-input");
        const searchBtn = document.querySelector("#search-btn");

        const handleSearch = () => {
            let query = searchInput.value.trim();
            if (query) {
                query = query.replace(/\s+/g, '-').toLowerCase();
                window.location.href = `/product/search?name=${encodeURIComponent(query)}`;
            }
        };

        searchInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                handleSearch();
            }
        });

        searchBtn.addEventListener("click", handleSearch);

        const imageSearchModal = document.querySelector(".modal-upload");
        const imageSearchBtn = document.querySelector(".image-search-btn");
        const uploadArea = imageSearchModal.querySelector(".upload-area");
        const fileInput = document.getElementById("file-upload");
        const searchProductBtn = imageSearchModal.querySelector(".search-product-btn");
        const uploadFileBtn = imageSearchModal.querySelector(".upload-file-btn");

        imageSearchBtn.addEventListener("click", () => {
            this.openModal(imageSearchModal);
        });

        imageSearchModal.addEventListener("click", (e) => {
            if (e.target === imageSearchModal) {
                this.closeModal(imageSearchModal);
            }
        });

        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('drag-over');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('drag-over');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('drag-over');
            const files = e.dataTransfer.files;
            handleFiles(files);
        });

        fileInput.addEventListener('change', (e) => {
            handleFiles(e.target.files);
        });

        uploadFileBtn.addEventListener('click', () => {
            fileInput.click();
        });

        function handleFiles(files) {
            if (files.length > 0) {
                const file = files[0];
                if (file.type.startsWith('image/')) {
                    console.log('Selected image:', file);
        
                    // Clear any previous image
                    const existingImage = uploadArea.querySelector('img');
                    if (existingImage) {
                        existingImage.remove();
                    }
        
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        const previewImg = document.createElement('img');
                        previewImg.src = e.target.result;
                        previewImg.style.maxWidth = '100%';
                        previewImg.style.maxHeight = '200px';
        
                        // Hide the placeholder and add the new image
                        uploadArea.querySelector('.upload-placeholder').style.display = 'none';
                        uploadArea.appendChild(previewImg);
        
                        // Store Base64 data for API submission
                        uploadArea.dataset.base64Image = e.target.result.split(',')[1]; // Remove 'data:image/...;base64,'
                    };
                    reader.readAsDataURL(file);
                } else {
                    Utils.getToast("error", "Vui lòng chọn file hình ảnh!");
                }
            }
        }
        
        searchProductBtn.addEventListener('click', async () => {
            const base64Image = uploadArea.dataset.base64Image;
        
            if (!base64Image) {
                Utils.getToast("error", "Vui lòng chọn hình ảnh trước khi tìm kiếm!");
                return;
            }

            const data = {
                image_data: base64Image,
            }
        
            try {
                const response = await Api.getProductByImage(data);
                if (response.status === 200) {
                    localStorage.setItem('productsByImage', JSON.stringify(response.productSpecDTOList));
                    localStorage.setItem('imageID', JSON.stringify(response.message));
                    localStorage.removeItem('viewTimes');
                    window.location.href = "/product/search-by-image";
                } else {
                    Utils.getToast("error", "Tìm kiếm thất bại!");
                }
            } catch (error) {
                console.error('Unexpected error:', error);
                Utils.getToast("error", "Có lỗi xảy ra trong quá trình tìm kiếm!");
            }
        });        
    }
    

    static getToast(type, mess){
        const html = `
            <div class="icon">
                <img src="../../img/toast/${type}.png" alt="">
            </div>
            <div class="toast-body">
                <h4 class="toast-status">THÀNH CÔNG</h4>
                <p class="toast-content">${mess}</p>
            </div>
        `;

        const toastContainer = document.querySelector("#toast-container");
        const newToast = document.createElement("div");
        newToast.setAttribute("id","toast")
        newToast.innerHTML = html;
        toastContainer.appendChild(newToast);
        
        const status = newToast.querySelector(".toast-status");
        const content = newToast.querySelector(".toast-content");
        
        if (type === "warning") {
            status.textContent = "CẢNH BÁO";
        }
        if (type === "error") {
            status.textContent = "THẤT BẠI";
        }
        content.textContent = mess;
    
        newToast.addEventListener("click", () => {
            newToast.classList.add('hide');
            setTimeout(() => {
                newToast.remove();
            }, 500);
        });
        
        setTimeout(() => {
            newToast.classList.add('hide');
            setTimeout(() => {
                newToast.remove();
            }, 500);
        }, 4000);
        
    }

    static fillProduct(products, container){
            
        container.innerHTML = '';
    
        products.forEach(product => {
            const productElement = document.createElement('div');
            productElement.classList.add('product');
            // <img src="${product.image.startsWith('data:image') ? product.image : `data:image/jpeg;base64,${product.image}` || '../../img/product/product.png'}" alt="${product.name}">
            // <img src="${product.image}">
            productElement.innerHTML = `
                <img src="${product.image? `data:image/jpeg;base64,${product.image}` : '../../img/utils/default.png'}" alt="${product.name}">
                <div class="decription">
                    <p class="name">${product.name}</p>
                    <p class="price">${product.price.toLocaleString()} đ</p>
                    <p class="sold">Đã bán ${product.sold}</p>
                </div>
            `;
            productElement.addEventListener('click', () => {
                window.location.href = `/product-detail/${product.product_id}`
            });
            container.appendChild(productElement);
        });
    }

    static getFooter(){
        return(
            `<div class="footer">
                <div class="infor">
                    <div class="contract">
                        <div class="footer-logo">
                            <img src="../../img/utils/footer-logo.png" alt="">
                        </div>
                        <div class="content-footer">
                            <h4>THÔNG TIN LIÊN HỆ</h4>
                            <div class="group-paraph">
                                <span class="material-symbols-outlined">
                                    phone
                                </span>
                                <p>0977655231</p>
                            </div>
                            <div class="group-paraph">
                                <span class="material-symbols-outlined">
                                    mail
                                </span>
                                <p>3tshop@business.com</p>
                            </div>
                            <div class="group-paraph">
                                <span class="material-symbols-outlined">
                                    mail
                                </span>
                                <p>3tshop@customer.com</p>
                            </div>
                        </div>
                    </div>
                    <div class="location">
                        <h4>HỆ THỐNG CỬA HÀNG</h4>
                        <div class="group-paraph">
                            <span class="material-symbols-outlined">
                                distance
                            </span> 
                            <p>Chi nhánh 1: 44A Trần Quang Diệu, Quận 3</p>
                        </div>
                        <div class="group-paraph">
                            <span class="material-symbols-outlined">
                                distance
                            </span>
                            <p>Chi nhánh 2: TNP Lý Tự Trọng, Quận 1</p>
                        </div>
                        <div class="group-paraph">
                            <span class="material-symbols-outlined">
                                distance
                            </span>
                            <p>Chi nhánh 3: TNP Lê Lai, Quận 1</p>
                        </div>
                    </div>
                </div>
                <div class="social">
                    <h4>THEO DÕI CHÚNG TÔI TRÊN</h4>
                    <div class="social-list">
                        <a href="">
                            <img src="../../img/utils/fb.png" alt="">
                        </a>
                        <a href="">
                            <img src="../../img/utils/insta.png" alt="">
                        </a>
                        <a href="">
                            <img src="../../img/utils/zalo.png" alt="">
                        </a>
                    </div>
                    <p>Copyrights © 2024 by 3TShop</p>
                </div>
            </div>`
        )
    }

    static renderSlide(url, element) {
        let countSlider = 1;
        const totalSlides = 6;
    
        const html = `
            <img src="../../img/${url}1.png" alt="Slide Image" id="sliderImage1" class="active">
            <img src="../../img/${url}2.png" alt="Slide Image" id="sliderImage2">
            <img src="../../img/${url}3.png" alt="Slide Image" id="sliderImage3">
            <img src="../../img/${url}4.png" alt="Slide Image" id="sliderImage4">
            <img src="../../img/${url}5.png" alt="Slide Image" id="sliderImage5">
            <img src="../../img/${url}6.png" alt="Slide Image" id="sliderImage6">`
        element.innerHTML = html
    
        const images = document.querySelectorAll(".slider img");
        const startSlider = () => {
            setInterval(() => {
                const currentImage = images[countSlider - 1];
    
                countSlider++;
                if (countSlider > totalSlides) {
                    countSlider = 1;
                }
    
                const nextImage = images[countSlider - 1];
    
                currentImage.classList.remove("active");
                currentImage.classList.add("exiting");
    
                setTimeout(() => {
                    currentImage.classList.remove("exiting");
                }, 1000);
    
                nextImage.classList.add("active");
            }, 4000);
        };
    
        startSlider();
    }

    static renderCategory(element){
        const html  = `
        <div class="item-list">
            <div class="item">
                <a href="/hoodie">
                    <img src="../../img/items/Category1.png" alt="">
                    <p class="category-name" >Áo Hoodie</p>
                </a>
            </div>
            <div class="item">
                <a href="/hoodie">
                    <img src="../../img/items/Category2.png" alt="">
                    <p class="category-name" >Áo sơ mi</p>
                </a>
            </div>
            <div class="item">
                <a href="/hoodie">
                    <img src="../../img/items/Category3.png" alt="">
                    <p class="category-name" >Quần short</p>
                </a>
            </div>
            <div class="item">
                <a href="/hoodie">
                    <img src="../../img/items/Category4.png" alt="">
                    <p class="category-name" >Quần kaki</p>
                </a>
            </div>
            <div class="item">
                <a href="/hoodie">
                    <img src="../../img/items/Category5.png" alt="">
                    <p class="category-name" >Quần jean</p>
                </a>
            </div>
            <div class="item">
                <a href="/hoodie">
                    <img src="../../img/items/Category6.png" alt="">
                    <p class="category-name" >Áo thun</p>
                </a>
            </div>
        </div>
        <button class="prev prev-item">
            <span class="material-symbols-outlined btn">
                arrow_back_ios
            </span>
        </button>
        <button class="next next-item">
            <span class="material-symbols-outlined btn">
                arrow_forward_ios
            </span>
        </button>`
        element.innerHTML = html
        let currentIndex = 0;
        const itemsPerPage = 4;
        const totalItems = document.querySelectorAll('.item-list .item').length;
        const nextBtn = document.querySelector(".next-item")
        const prevBtn = document.querySelector(".prev-item")

        function updateCarousel() {
            const itemList = document.querySelector('.item-list');
            const offset = -(currentIndex * 25);
            const pixel = currentIndex * 15;
            itemList.style.transform = `translateX(calc(${offset}% - ${pixel}px))`;
        }

        function prevSlide() {
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
                if(currentIndex <= 0){
                    prevBtn.style.display = "none"
                }
                nextBtn.style.display = "block"
            }
        }

        function nextSlide() {
            if (currentIndex < totalItems / itemsPerPage) {
                currentIndex++;
                updateCarousel();
                if(currentIndex >= totalItems / itemsPerPage){
                    nextBtn.style.display = "none"
                }
                prevBtn.style.display = "block"
            }
        }

        prevBtn.addEventListener("click",()=>{
            prevSlide()
        })
        nextBtn.addEventListener("click",()=>{
            nextSlide()
        })
    }

    static fillCategory(element, categories) {
        // <img src="${category.image || '../../img/items/Category4.png'}" alt="${category.name || ''}">
        const categoryItems = categories.map(category => `
            <div class="item">
                <a href="/category/${category.category_id}">
                    <img src="${category.image? `data:image/jpeg;base64,${category.image}` : '../../img/utils/default.png'}" alt="${category.name || ''}">
                    <p class="category-name">${category.name || ''}</p>
                </a>
            </div>
        `).join('');
    
        const html = `
            <div class="item-list">
                ${categoryItems}
            </div>
            <button class="prev prev-item">
                <span class="material-symbols-outlined btn">
                    arrow_back_ios
                </span>
            </button>
            <button class="next next-item">
                <span class="material-symbols-outlined btn">
                    arrow_forward_ios
                </span>
            </button>
        `;
    
        element.innerHTML = html;
    
        let currentIndex = 0;
        const itemsPerPage = 4;
        const totalItems = categories.length;
        const nextBtn = element.querySelector(".next-item");
        const prevBtn = element.querySelector(".prev-item");

        if(categories.length <= 4){
            console.log(categories.length)
            nextBtn.style.display = "none"
        }
    
        function updateCarousel() {
            const itemList = element.querySelector('.item-list');
            const offset = -(currentIndex * 25);
            const pixel = currentIndex * 15;
            itemList.style.transform = `translateX(calc(${offset}% - ${pixel}px))`;
        }
    
        function prevSlide() {
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
                if (currentIndex <= 0) {
                    prevBtn.style.display = "none";
                }
                nextBtn.style.display = "block";
            }
        }
    
        function nextSlide() {
            if (currentIndex < totalItems - itemsPerPage) {
                currentIndex++;
                updateCarousel();
                if (currentIndex >= totalItems - itemsPerPage) {
                    nextBtn.style.display = "none";
                }
                prevBtn.style.display = "block";
            }
        }
    
        prevBtn.addEventListener("click", prevSlide);
        nextBtn.addEventListener("click", nextSlide);
    }

    static addAnimation(e) {
        e.addEventListener("mousedown",()=>{
            // this.getToast("success")
            e.style.transform = "scale(.9)"
        })
        e.addEventListener("mouseup",()=>{
            e.style.transform = "scale(1)"
        })
    }

    static closeModal = (e)=>{
        e.style.display = "none"
    }
    static openModal = (e)=>{
        e.style.display = "flex"
    }
    static protectUser = () => {
        // Lấy token từ localStorage
        const token = localStorage.getItem("token");
        // const token = "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiW1VTRVJdIiwidXNlcm5hbWUiOiJsdXV0aGFuaCIsInN1YiI6Imx1dXRoYW5oIiwiaWF0IjoxNzMxNTAxNTk0LCJleHAiOjE3MzE2ODc5OTR9.VcSimoSwmp9TOh8y1-C3zy15B8JBoSdiqLPSlNKSDIk";

        // Nếu không có token, điều hướng đến trang login
        if (!token) {
            window.location.href = "/login";
            return;
        }

        const payloadBase64 = token.split(".")[1];
        try {
            const payload = JSON.parse(atob(payloadBase64));

            const role = payload.role;
            const exp = payload.exp;
            const currentTime = Math.floor(Date.now() / 1000);

            if (role !== "[USER]") {
                window.location.href = "/login";
                return;
            }

            if (exp < currentTime) {
                window.location.href = "/login";
                return;
            }
        } catch (error) {
            console.error("Lỗi giải mã token:", error);
            window.location.href = "/login";
        }
    }

    static protectAdmin = ()=>{
        const role = localStorage.getItem("role")
        if(role !== "admin"){
            window.location.href = "/login"
        }
    }
}