import Utils from "../Utils.js";
import Api from "../Api.js";

const hotProductListContainer = document.querySelector('.hot-product-list');
const newProductListContainer = document.querySelector('.new-product-list');
const hotProductSpinner = document.querySelector('#hot-product-spinner');
const newProductSpinner = document.querySelector('#new-product-spinner');

function showHotProductLoading() {
    hotProductSpinner.style.display = 'block';
    hotProductListContainer.classList.add('loading');
}

function hideHotProductLoading() {
    hotProductSpinner.style.display = 'none';
    hotProductListContainer.classList.remove('loading');
}

function showNewProductLoading() {
    newProductSpinner.style.display = 'block';
    newProductListContainer.classList.add('loading');
}

function hideNewProductLoading() {
    newProductSpinner.style.display = 'none';
    newProductListContainer.classList.remove('loading');
}

document.addEventListener("DOMContentLoaded", async () => {
    const homeContainer = document.querySelector(".home-container");
    const slider = document.querySelector(".slider");
    const carouselContainer = document.querySelector(".carousel-container");

    Utils.getHeader();
    Utils.renderCategory(carouselContainer);
    Utils.renderSlide("slide/slide", slider);
    homeContainer.insertAdjacentHTML("beforeend", Utils.getFooter());

    let hotProducts = [];
    let newProducts = [];
    let categories = [];

    const fillProductAsync = (products, container) => {
        return new Promise(resolve => {
            Utils.fillProduct(products, container);
            // Ensure DOM updates are complete
            requestAnimationFrame(() => resolve());
        });
    };

    const fetchNewProduct = async () => {
        showNewProductLoading();
        try {
            const response = await Api.getNewProduct();
            if (response.status === 200) {
                newProducts = response.productDTOList;
                await fillProductAsync(newProducts, newProductListContainer);
            }
        } catch (e) {
            Utils.getToast("error", "Máy chủ lỗi, vui lòng thử lại!");
        } finally {
            hideNewProductLoading();
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await Api.getAllCategory();
            if (response.status === 200) {
                categories = response.categoryDTOList;
                Utils.fillCategory(carouselContainer, categories);
            }
        } catch (e) {
            Utils.getToast("error", "Máy chủ lỗi, vui lòng thử lại!");
        }
    };

    const fetchHotProduct = async () => {
        showHotProductLoading();
        try {
            const response = await Api.getHotProduct();
            if (response.status === 200) {
                hotProducts = response.productDTOList;
                await fillProductAsync(hotProducts, hotProductListContainer);
            }
        } catch (e) {
            Utils.getToast("error", "Máy chủ lỗi, vui lòng thử lại!");
        } finally {
            hideHotProductLoading();
        }
    };

    await fetchCategories();
    await fetchNewProduct();
    await fetchHotProduct();

    // Slide new product
    let currentIndexNewProduct = 0;
    const itemsPerPageNewProduct = 4;
    const totalNewProduct = document.querySelectorAll('.new-product-list .product').length;
    const nextNewProductBtn = document.querySelector(".next-new-product");
    const prevNewProductBtn = document.querySelector(".prev-new-product");

    totalNewProduct > 4 ? nextNewProductBtn.style.display = "inline-block" : nextNewProductBtn.style.display = "none";
    prevNewProductBtn.style.display = totalNewProduct > 4 ? "none" : "none";

    function updateCarouselNewProduct() {
        const newProductList = document.querySelector('.new-product-list');
        const offset = -(currentIndexNewProduct * 25);
        const pixel = currentIndexNewProduct * 14;
        newProductList.style.transform = `translateX(calc(${offset}% - ${pixel}px))`;
    }

    function prevNewProduct() {
        if (currentIndexNewProduct > 0) {
            currentIndexNewProduct--;
            updateCarouselNewProduct();
            if (currentIndexNewProduct <= 0) {
                prevNewProductBtn.style.display = "none";
            }
            nextNewProductBtn.style.display = "inline-block";
        }
    }

    function nextNewProduct() {
        if (currentIndexNewProduct < totalNewProduct - itemsPerPageNewProduct) {
            currentIndexNewProduct++;
            updateCarouselNewProduct();
            if (currentIndexNewProduct >= totalNewProduct - itemsPerPageNewProduct) {
                nextNewProductBtn.style.display = "none";
            }
            prevNewProductBtn.style.display = "inline-block";
        }
    }

    prevNewProductBtn.addEventListener("click", prevNewProduct);
    nextNewProductBtn.addEventListener("click", nextNewProduct);

    // Slide hot product
    let currentIndexHotProduct = 0;
    const itemsPerPageHotProduct = 4;
    const totalHotProduct = document.querySelectorAll('.hot-product-list .product').length;
    const nextHotProductBtn = document.querySelector(".next-hot-product");
    const prevHotProductBtn = document.querySelector(".prev-hot-product");

    totalHotProduct > 4 ? nextHotProductBtn.style.display = "inline-block" : nextHotProductBtn.style.display = "none";
    prevHotProductBtn.style.display = totalHotProduct > 4 ? "none" : "none";

    function updateCarouselHotProduct() {
        const hotProductList = document.querySelector('.hot-product-list');
        const offset = -(currentIndexHotProduct * 25);
        const pixel = currentIndexHotProduct * 14;
        hotProductList.style.transform = `translateX(calc(${offset}% - ${pixel}px))`;
    }

    function prevHotProduct() {
        if (currentIndexHotProduct > 0) {
            currentIndexHotProduct--;
            updateCarouselHotProduct();
            if (currentIndexHotProduct <= 0) {
                prevHotProductBtn.style.display = "none";
            }
            nextHotProductBtn.style.display = "inline-block";
        }
    }

    function nextHotProduct() {
        if (currentIndexHotProduct < totalHotProduct - itemsPerPageHotProduct) {
            currentIndexHotProduct++;
            updateCarouselHotProduct();
            if (currentIndexHotProduct >= totalHotProduct - itemsPerPageHotProduct) {
                nextHotProductBtn.style.display = "none";
            }
            prevHotProductBtn.style.display = "inline-block";
        }
    }

    prevHotProductBtn.addEventListener("click", prevHotProduct);
    nextHotProductBtn.addEventListener("click", nextHotProduct);

    const btnAddAnimation = document.querySelectorAll(".btn");
    btnAddAnimation.forEach((b) => {
        Utils.addAnimation(b);
    });
});// import Utils from "../Utils.js";
// import Api from "../Api.js";

// const hotProductListContainer = document.querySelector('.hot-product-list');
// const newProductListContainer = document.querySelector('.new-product-list');

// document.addEventListener("DOMContentLoaded", async () => {
//     const homeContainer = document.querySelector(".home-container");
//     const slider = document.querySelector(".slider");
//     const carouselContainer = document.querySelector(".carousel-container")

//     Utils.getHeader()
//     // Utils.protectUser()
//     Utils.renderCategory(carouselContainer)
//     Utils.renderSlide("slide/slide", slider)
//     homeContainer.insertAdjacentHTML("beforeend", Utils.getFooter())

//     let hotProducts = []
//     let newProducts = []
//     let categories = []
//     const fetchNewProduct = async ()=>{
//         try {
//             const response = await Api.getNewProduct(); 
//             if (response.status === 200) {
//                 newProducts = response.productDTOList;
//                 Utils.fillProduct(newProducts, newProductListContainer)
//             }
//         } catch (e) {
//             Utils.getToast("error", "Máy chủ lỗi, vui lòng thử lại!")
//         }
//     }

//     const fetchCategories = async () => {
//         try {
//             const response = await Api.getAllCategory();
//             if (response.status === 200) {
//                 categories = response.categoryDTOList;
//                 Utils.fillCategory(carouselContainer, categories);
//             }
//         } catch (e) {
//             Utils.getToast("error", "Máy chủ lỗi, vui lòng thử lại!");
//         }
//     };

//     const fetchHotProduct = async ()=>{
//         try {
//             const response = await Api.getHotProduct(); 
//             if (response.status === 200) {
//                 hotProducts = response.productDTOList;
//                 Utils.fillProduct(hotProducts, hotProductListContainer)
//             }
//         } catch (e) {
//             Utils.getToast("error", "Máy chủ lỗi, vui lòng thử lại!")
//         }
//     }
//     await fetchCategories();
//     await fetchNewProduct();
//     await fetchHotProduct();

//     //slide new product
//     let currentIndexNewProduct = 0;
//     const itemsPerPageNewProduct = 4;
//     const totalNewProduct = document.querySelectorAll('.new-product-list .product').length;
//     const nextNewProductBtn = document.querySelector(".next-new-product")
//     const prevNewProductBtn = document.querySelector(".prev-new-product")
    

//     totalNewProduct > 4 ? nextNewProductBtn.style.display = "inline-block" : nextNewProductBtn.style.display = "none"

//     function updateCarouselNewProduct() {
//         const newProductList = document.querySelector('.new-product-list')
//         const offset = -(currentIndexNewProduct * 25);
//         const pixel = currentIndexNewProduct * 14;
//         newProductList.style.transform = `translateX(calc(${offset}% - ${pixel}px))`;
//     }

//     function prevNewProduct() {
//         if (currentIndexNewProduct > 0) {
//             currentIndexNewProduct--;
//             updateCarouselNewProduct();
//             if(currentIndexNewProduct <= 0){
//                 prevNewProductBtn.style.display = "none"
//             }
//             nextNewProductBtn.style.display = "block"
//         }
//     }

//     function nextNewProduct() {
//         if (currentIndexNewProduct < totalNewProduct - itemsPerPageNewProduct) {
//             currentIndexNewProduct++;
//             updateCarouselNewProduct();
//             if(currentIndexNewProduct >= totalNewProduct - itemsPerPageNewProduct){
//                 nextNewProductBtn.style.display = "none"
//             }
//             prevNewProductBtn.style.display = "block"
//         }
//     }

//     prevNewProductBtn.addEventListener("click",()=>{
//         prevNewProduct()
//     })
//     nextNewProductBtn.addEventListener("click",()=>{
//         nextNewProduct()
//     })

//     //slide hot product
//     let currentIndexHotProduct = 0;
//     const itemsPerPageHotProduct = 4;
//     const totalHotProduct = document.querySelectorAll('.hot-product-list .product').length;
//     const nextHotProductBtn = document.querySelector(".next-hot-product")
//     const prevHotProductBtn = document.querySelector(".prev-hot-product")
//     console.log(totalHotProduct)
//     totalHotProduct > 4 ? nextHotProductBtn.style.display = "block" : nextHotProductBtn.style.display = "none"

//     function updateCarouselHotProduct() {
//         const hotProductList = document.querySelector('.hot-product-list')
//         const offset = -(currentIndexHotProduct * 25);
//         const pixel = currentIndexHotProduct * 14;
//         hotProductList.style.transform = `translateX(calc(${offset}% - ${pixel}px))`;
//     }

//     function prevHotProduct() {
//         if (currentIndexHotProduct > 0) {
//             currentIndexHotProduct--;
//             updateCarouselHotProduct();
//             if(currentIndexHotProduct <= 0){
//                 prevHotProductBtn.style.display = "none"
//             }
//             nextHotProductBtn.style.display = "block"
//         }
//     }

//     function nextHotProduct() {
//         if (currentIndexHotProduct < totalHotProduct - itemsPerPageHotProduct) {
//             currentIndexHotProduct++;
//             updateCarouselHotProduct();
//             if(currentIndexHotProduct >= totalHotProduct - itemsPerPageHotProduct){
//                 nextHotProductBtn.style.display = "none"
//             }
//             prevHotProductBtn.style.display = "block"
//         }
//     }

//     prevHotProductBtn.addEventListener("click",()=>{
//         prevHotProduct()
//     })
//     nextHotProductBtn.addEventListener("click",()=>{
//         nextHotProduct()
//     })

//     const btnAddAnimation = document.querySelectorAll(".btn")
//     btnAddAnimation.forEach((b)=>{
//         Utils.addAnimation(b)
//     })
// });
