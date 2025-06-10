import Utils from "../Utils.js";
import Api from "../Api.js";
import ViewTracker from './view-tracker.js';

document.addEventListener('DOMContentLoaded', () => {
    let viewTimes = JSON.parse(localStorage.getItem('viewTimes') || '{}');
    
    if (Object.keys(viewTimes).length === 0) {
        const productIds = document.querySelectorAll('.product');
        productIds.forEach(product => {
            const productId = product.getAttribute('data-product-id');
            if (!viewTimes[productId]) {
                viewTimes[productId] = { totalTime: 0, startTime: null };
            }
        });
        localStorage.setItem('viewTimes', JSON.stringify(viewTimes));
    }

    console.log('Dữ liệu lấy từ localStorage:', viewTimes);

    Object.keys(viewTimes).forEach(productId => {
        ViewTracker.stopTracking(productId);
    });

    ViewTracker.saveToStorage();
});

const slider = document.querySelector(".slider");
const carouselContainer = document.querySelector(".carousel-container");
const container = document.querySelector('.container');
const priceFilter = document.getElementById('price-filter');
const sizeFilter = document.getElementById('size-filter');
const sortSelect = document.getElementById('sort');
const loadingSpinner = document.getElementById('loading-spinner');
const productContainer = document.querySelector('.category-product-list');

let currentProducts = [];

container.insertAdjacentHTML("beforeend", Utils.getFooter());
Utils.getHeader();
Utils.renderSlide("slide/slide", slider);

const btnAddAnimation = document.querySelectorAll(".btn");
btnAddAnimation.forEach((b) => {
    Utils.addAnimation(b);
});

let categories = [];

function showLoading() {
    loadingSpinner.style.display = 'block';
    productContainer.classList.add('loading');
}

function hideLoading() {
    loadingSpinner.style.display = 'none';
    productContainer.classList.remove('loading');
}

const fetchCategories = async () => {
    showLoading();
    try {
        const response = await Api.getAllCategory();
        if (response.status === 200) {
            categories = response.categoryDTOList;
            Utils.fillCategory(carouselContainer, categories);
        }
    } catch (e) {
        Utils.getToast("error", "Máy chủ lỗi, vui lòng thử lại!");
    } finally {
        hideLoading();
    }
};

function filterByPrice(products, priceRange) {
    if (!priceRange) return products;
    
    return products.filter(product => {
        const price = parseFloat(product.price);
        switch (priceRange) {
            case 'under-150':
                return price < 150000;
            case '150-200':
                return price >= 150000 && price <= 200000;
            case '200-500':
                return price > 200000 && price <= 500000;
            case 'above-500':
                return price > 500000;
            default:
                return true;
        }
    });
}

function filterBySize(products, size) {
    if (!size) return products;
    return products.filter(product => 
        product.specifications?.some(spec => spec.size === size && spec.quantity > 0)
    );
}

function getAvailableSizes(products) {
    const sizesSet = new Set();
    products.forEach(product => {
        product.specifications?.forEach(spec => {
            if (spec.quantity > 0) {
                sizesSet.add(spec.size);
            }
        });
    });
    return Array.from(sizesSet);
}

function updateSizeFilter(products) {
    const availableSizes = getAvailableSizes(products);
    sizeFilter.innerHTML = `
        <option value="">Chọn kích thước</option>
        ${availableSizes.map(size => `<option value="${size}">Size ${size}</option>`).join('')}
    `;
}

function sortProducts(products, sortType) {
    const sortedProducts = [...products];
    switch (sortType) {
        case 'price-asc':
            return sortedProducts.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        case 'price-desc':
            return sortedProducts.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        case 'popular':
            return sortedProducts.sort((a, b) => b.sold - a.sold);
        default:
            return sortedProducts;
    }
}

function applyFiltersAndSort() {
    showLoading();
    return new Promise(resolve => {
        setTimeout(() => {
            let filteredProducts = currentProducts;
            filteredProducts = filterByPrice(filteredProducts, priceFilter.value);
            filteredProducts = filterBySize(filteredProducts, sizeFilter.value);
            filteredProducts = sortProducts(filteredProducts, sortSelect.value);
            renderProducts(filteredProducts).then(() => {
                hideLoading();
                resolve();
            });
        }, 0);
    });
}

priceFilter.addEventListener('change', applyFiltersAndSort);
sizeFilter.addEventListener('change', applyFiltersAndSort);
sortSelect.addEventListener('change', applyFiltersAndSort);

document.addEventListener("DOMContentLoaded", () => {
    fetchCategories();
    handleFetchProducts();
});

function handleFetchProducts() {
    const path = window.location.pathname;
    const searchParams = new URLSearchParams(window.location.search);

    if (path.startsWith("/category/")) {
        const categoryId = path.split("/category/")[1];
        if (categoryId) {
            fetchProductByCategory(categoryId);
        }
    } else if (path.startsWith("/product/search") && searchParams.has("name")) {
        const productName = searchParams.get("name");
        if (productName) {
            fetchProductByName(productName);
        }
    } else if (path.startsWith("/product/search-by-image")) {
        showLoading();
        document.getElementById('feedback').style.display = "block";
        const productsByImage = JSON.parse(localStorage.getItem('productsByImage') || '[]');
        const title = document.querySelector(".title-name");
        title.textContent = "Kết quả tìm kiếm";
        if (productsByImage.length > 0) {
            currentProducts = productsByImage;
            updateSizeFilter(productsByImage);
            renderProducts(productsByImage).then(() => hideLoading());
        } else {
            productContainer.innerHTML = '<p>Không có sản phẩm nào được tìm thấy.</p>';
            hideLoading();
        }
    }
}

async function fetchProductByCategory(id) {
    showLoading();
    try {
        const response = await Api.getProductByCategory(id);
        if (response.status === 200) {
            currentProducts = response.productSpecDTOList;
            const title = document.querySelector(".title-name");
            title.textContent = currentProducts[0].categoryName;
            updateSizeFilter(currentProducts);
            await renderProducts(currentProducts);
        } else if (response.status === 202) {
            productContainer.innerHTML = '<p>Không có sản phẩm nào được tìm thấy.</p>';
        }
    } catch (error) {
        Utils.getToast("error", "Máy chủ lỗi lấy sản phẩm theo danh mục");
    } finally {
        hideLoading();
    }
}

async function fetchProductByName(name) {
    showLoading();
    try {
        const response = await Api.getProductByName(name);
        if (response.status === 200) {
            currentProducts = response.productSpecDTOList; 
            updateSizeFilter(currentProducts);
            await renderProducts(currentProducts);
            const title = document.querySelector(".title-name");
            title.textContent = "Kết quả tìm kiếm";
        } else if (response.status === 202) {
            productContainer.innerHTML = '<p>Không có sản phẩm nào được tìm thấy.</p>';
        }
    } catch (error) {
        Utils.getToast("error", "Máy chủ lỗi tìm kiếm sản phẩm");
    } finally {
        hideLoading();
    }
}

function renderProducts(products) {
    return new Promise(resolve => {
        productContainer.innerHTML = '';
        
        if (products.length === 0) {
            productContainer.innerHTML = '<p>Không có sản phẩm nào được tìm thấy.</p>';
            resolve();
            return;
        }

        products.forEach(product => {
            const productElement = document.createElement('div');
            productElement.classList.add('product');
            productElement.setAttribute('data-product-id', product.product_id);

            productElement.innerHTML = `
                <img src="${product.image ? `data:image/jpeg;base64,${product.image}` : '../../img/product/product.png'}" alt="${product.name}">
                <div class="decription">
                    <p class="name">${product.name}</p>
                    <p class="price">${parseFloat(product.price).toLocaleString()} đ</p>
                    <p class="sold">Đã bán ${product.sold}</p>
                </div>
            `;

            productElement.addEventListener('click', () => {
                window.location.href = `/product-detail/${product.product_id}`;
            });

            productContainer.appendChild(productElement);
        });

        // Ensure DOM updates are complete
        requestAnimationFrame(() => resolve());
    });
}

async function handleFeedback(feedbackType) {
    console.log("feedback");
    const mostViewedProduct = ViewTracker.getMostViewedProduct();
    console.log("Most Viewed Product:", mostViewedProduct);

    const productToEvaluate = mostViewedProduct
        ? currentProducts.find(product => String(product.product_id) === mostViewedProduct.productId)
        : currentProducts[0];

    console.log("Product to Evaluate:", productToEvaluate);
    console.log("Current Products:", currentProducts);

    const imageId = JSON.parse(localStorage.getItem('imageID'));

    if (!imageId) {
        Utils.getToast("error", "Không tìm thấy thông tin hình ảnh, vui lòng thử lại!");
        return;
    }

    if (!productToEvaluate) {
        Utils.getToast('warning', 'Không có sản phẩm nào để đánh giá.');
        return;
    }

    const data = {
        imageId: imageId,
        productId: productToEvaluate.product_id,
        feedback: feedbackType
    };

    showLoading();
    try {
        const response = await Api.feedback(data);
        if (response.status === 200) {
            Utils.getToast("success", "Gửi phản hồi thành công!");
        } else {
            Utils.getToast("error", "Gửi phản hồi thất bại, vui lòng thử lại!");
        }
    } catch (error) {
        Utils.getToast("error", "Có lỗi xảy ra, vui lòng thử lại!");
        console.error(error);
    } finally {
        hideLoading();
    }
}

document.getElementById('feedback-ok').addEventListener('click', () => handleFeedback(true));
document.getElementById('feedback-bad').addEventListener('click', () => handleFeedback(false));
// import Utils from "../Utils.js";
// import Api from "../Api.js";
// import ViewTracker from './view-tracker.js';

// // document.addEventListener('DOMContentLoaded', () => {
// //     const viewTimes = JSON.parse(localStorage.getItem('viewTimes') || '{}');
    
// //     console.log('Dữ liệu lấy từ localStorage:', viewTimes);
    
// //     Object.keys(viewTimes).forEach(productId => {
// //         ViewTracker.stopTracking(productId);
// //     });

// //     ViewTracker.saveToStorage();
// // });


// document.addEventListener('DOMContentLoaded', () => {
//     // Lấy dữ liệu từ localStorage (hoặc khởi tạo nếu chưa có)
//     let viewTimes = JSON.parse(localStorage.getItem('viewTimes') || '{}');
    
//     // Nếu chưa có sản phẩm nào trong viewTimes, tạo danh sách tất cả các sản phẩm
//     if (Object.keys(viewTimes).length === 0) {
//         const productIds = document.querySelectorAll('.product'); // Lấy tất cả các sản phẩm từ DOM
//         productIds.forEach(product => {
//             const productId = product.getAttribute('data-product-id');
//             if (!viewTimes[productId]) {
//                 viewTimes[productId] = { totalTime: 0, startTime: null };
//             }
//         });
//         // Lưu lại vào localStorage
//         localStorage.setItem('viewTimes', JSON.stringify(viewTimes));
//     }

//     console.log('Dữ liệu lấy từ localStorage:', viewTimes);

//     // Khởi tạo việc theo dõi cho tất cả các sản phẩm đã được lưu trữ
//     Object.keys(viewTimes).forEach(productId => {
//         ViewTracker.stopTracking(productId);
//     });

//     ViewTracker.saveToStorage();
// });



// const slider = document.querySelector(".slider");
// const carouselContainer = document.querySelector(".carousel-container");
// const container = document.querySelector('.container');
// const priceFilter = document.getElementById('price-filter');
// const sizeFilter = document.getElementById('size-filter');
// const sortSelect = document.getElementById('sort');

// let currentProducts = [];

// container.insertAdjacentHTML("beforeend", Utils.getFooter());

// Utils.getHeader();
// Utils.renderSlide("slide/slide", slider);

// const btnAddAnimation = document.querySelectorAll(".btn");
// btnAddAnimation.forEach((b) => {
//     Utils.addAnimation(b);
// });

// let categories = [];

// const fetchCategories = async () => {
//     try {
//         const response = await Api.getAllCategory();
//         if (response.status === 200) {
//             categories = response.categoryDTOList;
//             Utils.fillCategory(carouselContainer, categories);
//         }
//     } catch (e) {
//         Utils.getToast("error", "Máy chủ lỗi, vui lòng thử lại!");
//     }
// };

// function filterByPrice(products, priceRange) {
//     if (!priceRange) return products;
    
//     return products.filter(product => {
//         const price = parseFloat(product.price);
//         switch (priceRange) {
//             case 'under-150':
//                 return price < 150000;
//             case '150-200':
//                 return price >= 150000 && price <= 200000;
//             case '200-500':
//                 return price > 200000 && price <= 500000;
//             case 'above-500':
//                 return price > 500000;
//             default:
//                 return true;
//         }
//     });
// }

// function filterBySize(products, size) {
//     if (!size) return products;
//     return products.filter(product => 
//         product.specifications?.some(spec => spec.size === size && spec.quantity > 0)
//     );
// }

// function getAvailableSizes(products) {
//     const sizesSet = new Set();
//     products.forEach(product => {
//         product.specifications?.forEach(spec => {
//             if (spec.quantity > 0) {
//                 sizesSet.add(spec.size);
//             }
//         });
//     });
//     return Array.from(sizesSet);
// }

// function updateSizeFilter(products) {
//     const availableSizes = getAvailableSizes(products);
//     sizeFilter.innerHTML = `
//         <option value="">Chọn kích thước</option>
//         ${availableSizes.map(size => `<option value="${size}">Size ${size}</option>`).join('')}
//     `;
// }

// function sortProducts(products, sortType) {
//     const sortedProducts = [...products];
//     switch (sortType) {
//         case 'price-asc':
//             return sortedProducts.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
//         case 'price-desc':
//             return sortedProducts.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
//         case 'popular':
//             return sortedProducts.sort((a, b) => b.sold - a.sold);
//         default:
//             return sortedProducts;
//     }
// }

// function applyFiltersAndSort() {
//     let filteredProducts = currentProducts;
    
//     filteredProducts = filterByPrice(filteredProducts, priceFilter.value);
    
//     filteredProducts = filterBySize(filteredProducts, sizeFilter.value);
    
//     filteredProducts = sortProducts(filteredProducts, sortSelect.value);
    
//     renderProducts(filteredProducts);
// }

// priceFilter.addEventListener('change', applyFiltersAndSort);
// sizeFilter.addEventListener('change', applyFiltersAndSort);
// sortSelect.addEventListener('change', applyFiltersAndSort);

// priceFilter.innerHTML = `
//     <option value="">Chọn giá</option>
//     <option value="under-150">Dưới 150.000đ</option>
//     <option value="150-200">Từ 150.000đ đến 200.000đ</option>
//     <option value="200-500">Từ 200.000đ đến 500.000đ</option>
//     <option value="above-500">Trên 500.000đ</option>
// `;

// sortSelect.innerHTML = `
//     <option value="popular">Nổi bật</option>
//     <option value="price-asc">Giá thấp tới cao</option>
//     <option value="price-desc">Giá cao tới thấp</option>
// `;

// document.addEventListener("DOMContentLoaded", () => {
//     fetchCategories();
//     handleFetchProducts();
// });

// function handleFetchProducts() {
//     const path = window.location.pathname;
//     const searchParams = new URLSearchParams(window.location.search);

//     if (path.startsWith("/category/")) {
//         const categoryId = path.split("/category/")[1];
//         if (categoryId) {
//             fetchProductByCategory(categoryId);
//         }
//     }
//     else if (path.startsWith("/product/search") && searchParams.has("name")) {
//         const productName = searchParams.get("name");
//         if (productName) {
//             fetchProductByName(productName);
//         }
//     } else if (path.startsWith("/product/search-by-image")) {
//         document.getElementById('feedback').style.display = "block"
//         const productContainer = document.querySelector(".category-product-list");
//         const productsByImage = JSON.parse(localStorage.getItem('productsByImage') || '[]');
//         const title = document.querySelector(".title-name");
//         title.textContent = "Kết quả tìm kiếm";
//         if (productsByImage.length > 0) {
//             currentProducts = productsByImage; // Đảm bảo cập nhật currentProducts
//             updateSizeFilter(productsByImage);
//             renderProducts(productsByImage);
//         } else {
//             productContainer.innerHTML = '<p>Không có sản phẩm nào được tìm thấy.</p>';
//         }
//     }
// }

// async function fetchProductByCategory(id) {
//     try {
//         const response = await Api.getProductByCategory(id);
//         if (response.status === 200) {
//             currentProducts = response.productSpecDTOList;
//             const title = document.querySelector(".title-name");
//             title.textContent = currentProducts[0].categoryName;
//             updateSizeFilter(currentProducts);
//             renderProducts(currentProducts);
//         } else {
//             if (response.status === 202) {
//                 const productContainer = document.querySelector(".category-product-list");
//                 productContainer.innerHTML = '<p>Không có sản phẩm nào được tìm thấy.</p>';
//             }
//         }
//     } catch (error) {
//         Utils.getToast("error", "Máy chủ lỗi lấy sản phẩm theo danh mục");
//     }
// }

// async function fetchProductByName(name) {
//     try {
//         const response = await Api.getProductByName(name);
//         if (response.status === 200) {
//             currentProducts = response.productSpecDTOList; 
//             updateSizeFilter(currentProducts);
//             renderProducts(currentProducts);
//             const title = document.querySelector(".title-name");
//             title.textContent = "Kết quả tìm kiếm";
//         } else {
//             if (response.status === 202) {
//                 const productContainer = document.querySelector(".category-product-list");
//                 productContainer.innerHTML = '<p>Không có sản phẩm nào được tìm thấy.</p>';
//             }
//         }
//     } catch (error) {
//         Utils.getToast("error", "Máy chủ lỗi tìm kiếm sản phẩm");
//     }
// }

// function renderProducts(products) {
//     const productContainer = document.querySelector(".category-product-list");
//     productContainer.innerHTML = '';
    
//     if (products.length === 0) {
//         productContainer.innerHTML = '<p>Không có sản phẩm nào được tìm thấy.</p>';
//         return;
//     }

//     products.forEach(product => {
//         const productElement = document.createElement('div');
//         productElement.classList.add('product');
//         productElement.setAttribute('data-product-id', product.product_id);

//         productElement.innerHTML = `
//             <img src="${product.image ? `data:image/jpeg;base64,${product.image}` : '../../img/product/product.png'}" alt="${product.name}">
//             <div class="decription">
//                 <p class="name">${product.name}</p>
//                 <p class="price">${parseFloat(product.price).toLocaleString()} đ</p>
//                 <p class="sold">Đã bán ${product.sold}</p>
//             </div>
//         `;

//         productElement.addEventListener('click', () => {
//             window.location.href = `/product-detail/${product.product_id}`;
//         });

//         // productElement.addEventListener('mouseenter', () => ViewTracker.startTracking(product.product_id));
//         // productElement.addEventListener('mouseleave', () => ViewTracker.stopTracking(product.product_id));
//         productContainer.appendChild(productElement);
//     });
// }
// // Hàm xử lý gửi phản hồi
// async function handleFeedback(feedbackType) {
//     console.log("feedback");
//     const mostViewedProduct = ViewTracker.getMostViewedProduct();
//     console.log("Most Viewed Product:", mostViewedProduct);

//     const productToEvaluate = mostViewedProduct
//         ? currentProducts.find(product => String(product.product_id) === mostViewedProduct.productId)
//         : currentProducts[0]; // Lấy sản phẩm đầu tiên nếu không có sản phẩm được xem

//     console.log("Product to Evaluate:", productToEvaluate);
//     console.log("Current Products:", currentProducts);

//     const imageId = JSON.parse(localStorage.getItem('imageID'));

//     if (!imageId) {
//         Utils.getToast("error", "Không tìm thấy thông tin hình ảnh, vui lòng thử lại!");
//         return;
//     }

//     if (!productToEvaluate) {
//         Utils.getToast('warning', 'Không có sản phẩm nào để đánh giá.');
//         return;
//     }

//     const data = {
//         imageId: imageId,
//         productId: productToEvaluate.product_id,
//         feedback: feedbackType
//     };

//     try {
//         const response = await Api.feedback(data);
//         if (response.status === 200) {
//             Utils.getToast("success", "Gửi phản hồi thành công!");
//         } else {
//             Utils.getToast("error", "Gửi phản hồi thất bại, vui lòng thử lại!");
//         }
//     } catch (error) {
//         Utils.getToast("error", "Có lỗi xảy ra, vui lòng thử lại!");
//         console.error(error);
//     }
// }

// document.getElementById('feedback-ok').addEventListener('click', () => handleFeedback(true));
// document.getElementById('feedback-bad').addEventListener('click', () => handleFeedback(false));
