import Utils from "../../js/admin/Utils.js";
import Api from "../../js/admin/Api.js";

const elementId = document.querySelector('.navigation')
const items = document.getElementsByClassName('manage__items')
const iconButtonList = document.querySelectorAll('.material-symbols-outlined')
const buttonList = document.querySelectorAll('.button')
const input = document.getElementById('input__category__img')
const iconUploaded = document.getElementById('success__upload')
const iconAddNewCategory = document.getElementById('icon__add__new__category')
const filterProduct = document.querySelector('.filter__product')

const buttonSaveCategory = document.getElementById('save__new__category')
const buttonCancelCategory = document.getElementById('cancel__new__category')
const buttonSaveColor = document.getElementById('save__new__color')
const buttonCancelColor = document.getElementById('cancel__new__color')

const addNewCategoryBackground = document.getElementById('new__category__background')
const addNewColorBackground = document.getElementById('new__color__background')
const iconCloseCategoryModal = document.querySelector('.icon__close__category__modal')
const iconCloseColorModal = document.querySelector('.icon__close__color__modal')
const buttonAddNewCategory = document.querySelector('.add__new__category')
const inputCategoryName = document.getElementById('input__category__name')
const inputCategoryImg = document.getElementById('input__category__img')
const inputColorName = document.getElementById('input__color__name')
const inputColorCode = document.getElementById('input__color__code')
const buttonAddNewColor = document.querySelector('.add__new__color__wrapper') 

const addNewCategoryWrapper = document.querySelector('.add__new__category__wrapper')
const addNewColorWrapper = document.querySelector('.add__new__color__outside')

const buttons = document.querySelectorAll('button')

const editSpecificationBackground = document.querySelector('.edit__specification__background')
const editSpecificationWrapper = document.querySelector('.edit__wrapper')
const cancelEditBtn = document.querySelector('#cancel__edit__btn')
const validateInputQuantity = document.getElementById('validate__input__quantity')
const selectedColor = document.querySelector('#select__color')
const specQuantity = document.querySelector('#edit__quantity')

var categoryId = null
var productId = null
var color_id = null
var updatedSpecification = {
    specifications_id : '',
    colorDTO:{
        color_id: ''
    },
    quantity: ''
}
var categoryInfor = {
    category_id : '',
    name : '',
    image : ''
}
var colorInfor = {
    color_id : '',
    name : '',
    hex : ''
}

var productList
var arrToHandle

Utils.getHeader()


const DEFAULT_COLOR = '#42445a';
const pickr = Pickr.create({
    el: '.color-picker',
    theme: 'classic',
    default: DEFAULT_COLOR,
    swatches: [
        '#ff0000',
        '#00ff00',
        '#0000ff',
        '#ffff00',
        '#ff00ff',
        '#00ffff'
    ],
    components: {
        preview: true,
        opacity: true,
        hue: true,
        interaction: {
            hex: true,  
            rgba: true, 
            hsla: true, 
            hsva: true, 
            cmyk: true, 
            input: true,
            clear: true,
            save: true 
        }
    }
});

pickr.on('init', instance => {
    console.log('Pickr đã được khởi tạo');
});

pickr.on('change', (color) => {
    inputColorCode.value = color.toHEXA().toString().replace('#', '')
});

pickr.on('save', (color) => {
    pickr.hide();
});

pickr.on('clear', instance => {
    console.log('Màu đã được xóa');
});


async function getCategoryList() {
    try {
        const data = await Api.getData('category/get-all')
        if (data) {
            renderAllCategory(data)
            renderCategory(data)
            Utils.categoryList = data
        }        
    } catch (error) {
        console.log("Error: ", error)
    }   
}

getCategoryList()

async function addNewCategory(data) {
    showLoading(true)
    try {
        const response = await Api.postData('category/add-category', data)
        showLoading(false)
        if (response.status === 200) {
            addNewCategoryBackground.style.display = 'none'
            Utils.showToast(
                "Thêm danh mục mới thành công",
                'check_circle'
            )
            getCategoryList()
            
        } else {
            Utils.showToast(
                "Có lỗi xảy ra. Vui lòng thử lại!",
                'error'
            )
        }        
        
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}


function convertToBase64(inputFile) {
    const file = inputFile.files[0];
    if (!file) {
        throw new Error("No file selected");
    }

    const reader = new FileReader();
    return new Promise((resolve, reject) => {
        reader.onload = () => {
            const base64String = reader.result.split(',')[1]; // Lấy phần base64 sau ","
            resolve(base64String);
        };
        reader.onerror = () => {
            reject("Error reading file");
        };
        reader.readAsDataURL(file);
    });
}

function renderImage(base64String) {
    const mimeType = "image/png";
    return `
        data:${mimeType};base64,${base64String}
    `
}

function renderAllCategory(data) {
    const categoryArr = data.categoryDTOList
    console.log(categoryArr)
    const htmls = []
    categoryArr.forEach(item => {
        htmls.push( `
            <div class="each__category">
                <span class="category__id" hidden>${item.category_id}</span>
                <h5>${item.name}</h5>
            </div>
        `
        )
    })
    document.getElementById('list__category').innerHTML = htmls.join('')  
    categoryIsActive()
}


const content = document.getElementById('list__category')
const nextBtn = document.querySelector('.scroll__to__next')
const prevBtn = document.querySelector('.scroll__to__previous')
const contentWidth = content.clientWidth

nextBtn.addEventListener('click', () => {
    content.scrollLeft += contentWidth;
});

prevBtn.addEventListener('click', () => {
    content.scrollLeft -= contentWidth;
});

function renderCategory(data) {
    const categoryArr = data.categoryDTOList
    const htmls = []
    categoryArr.forEach((item, index) => {
        htmls.push( `
            <tr class="each__category__wrapepr">
                <td class="category__id" hidden>${item.category_id}</td>
                <td class="order__number">${index + 1}</td>
                <td>
                    <img src=${renderImage(item.image)} class="category__image" alt="Category Image">
                </td>
                <td class="category__name">${item.name}</td>
                <td class="category__created">${Utils.formatDateTime(item.create_at)}</td>
                <td>
                    <div class="edit__info edit__category">
                        <span style="font-size: 20px" class="material-symbols-outlined">
                            edit
                            </span>
                    </div>
                </td>
            </tr>
        `
        )
    })
    document.querySelector('#tbody__list__category__wrapper').innerHTML = htmls.join('')  
    editCategory()
}

const titleCategory = document.querySelector('.title__category__modal')
const categoryImage = document.getElementById('category__img')
function editCategory() {
    const editCategoryIcons = document.querySelectorAll('.edit__category')
    editCategoryIcons.forEach(item => {
        item.addEventListener('click', () => {
            const parent = item.closest('.each__category__wrapepr')
            categoryInfor = {
                category_id: parent.querySelector('.category__id').textContent,
                name : parent.querySelector('.category__name').textContent,
                image: parent.querySelector('img').getAttribute('src').split(',')[1]
            }
            console.log("Category original: ",categoryInfor)
            setupCategoryModal(
                'CHỈNH SỬA DANH MỤC',
                'edit'
            )
            inputCategoryName.value = categoryInfor.name
            categoryImage.src = renderImage(categoryInfor.image)
            
        })
    })
}

function setupCategoryModal(title, action) {
    titleCategory.textContent = title
    buttonSaveCategory.setAttribute('data-action', action.toLowerCase())
    if (action === 'edit') {
        categoryImage.hidden = false
    } else {
        categoryImage.hidden = true
    }
    showModal(addNewCategoryWrapper, addNewCategoryBackground)
}

async function updateCategory(data) {
    showLoading(true)
    try {
        const response = await Api.putData('category/update-category', data)
        showLoading(false )
        if (response.status === 200) {
            Utils.showToast(
                'Cập nhật thông tin danh mục thành công',
                'check_circle'
            )
            getCategoryList()
            closeModal(addNewCategoryWrapper, addNewCategoryBackground)
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

const productManageWrapper = document.getElementById('product__management__wrapper')
const detailWrapper = document.querySelector('.detail__wrapper')

function showLoading(option) {
    if (option) {
        document.querySelector('.loading__icon').style.display = 'flex'
        return
    }
    document.querySelector('.loading__icon').style.display = 'none'
} 

async function getAllProductByCategory(id) {
    showLoading(true)
    try {
        const data = await Api.getData('product/get-by-category/' + id.toString())
        showLoading(false)
        if (data) {
            productList = data.productDTOList
            arrToHandle = productList.slice()
            if (filterProduct.classList.contains('active')) {
                arrToHandle = productList.filter(item => item.status === 0)
                if (searchArr) {
                    arrToHandle = searchArr.slice()
                }
                console.log("arrray to filter: ", arrToHandle)
                renderProductList(arrToHandle)
            } else {
                renderProductList(data.productDTOList)
            }
            return data
        }
        console.log(data)
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function renderProductList(data, isSearch) {
    // const productArr = data.productDTOList
    if (data.length === 0) {
        document.querySelector('.table__wrapper').innerHTML = `
           <div class="is__empty__order__list">
                <img src="../../img/utils/out-of-stock.png" class="empty__order__list" style="height: 200px; width: auto"  alt="Out of stock">
            </div>                                       
        `
        return
    } else {
        document.querySelector('.table__wrapper').innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th></th>
                        <th></th>
                        <th>Giá</th>
                        <th>Lượt bán</th>
                        <th>Ngày tạo</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody id="list__prouduct__wrapper">
                </tbody>
            </table>
        `
        const htmls = []
        const isHide = ['none', 'flex']
        const isShow = ['flex', 'none']
        data.forEach((item, index) => {
            htmls.push( `
                <tr class="product__item each__row">
                    <td class="product__id" hidden>${item.product_id}</td>
                    <td class="order__number">${index + 1}</td>
                    <td>
                        <img src=${renderImage(item.image)} alt="Product Image" class="product__image">
                    </td>
                    <td class="item__name">${item.name}</td>
                    <td class="item__price">${Utils.formatCurrency(parseInt(item.price))}</td>
                    <td class="item__sold">${Utils.formatNumber(item.sold)}</td>
                    <td class="item__stock">${Utils.formatDateTime(item.create_at)}</td>
                    <td>
                        <div id="operation__wrapper">
                            <span class="material-symbols-outlined hide__product" style="display: ${isHide[item.status]}">
                                visibility_off
                                </span>
                            <span class="material-symbols-outlined show__product" style="display: ${isShow[item.status]}">
                                visibility
                                </span>
                        </div>
                    </td>
                </tr>
            `
            )
        })
        document.querySelector('#list__prouduct__wrapper').innerHTML = htmls.join('')  
        getProductId()
        hideProduct()
        showProduct()
    }
    
}

function renderSpecificationList(data, productId) {
    document.getElementById('title__list__product__spec').textContent = 'CHI TIẾT MÃ SẢN PHẨM ' + productId
    const specArr = data.specificationsDTOList
    const htmlsSizeM = []
    const htmlsSizeL = []
    const htmlsSizeXL = []
    const htmlsSizeXXL = []
    specArr.forEach(item => {
        if (item.sizeDTO.name === 'M') {
            htmlsSizeM.push(returnHtml(item.specifications_id, item.colorDTO.color_id, item.colorDTO.hex, item.colorDTO.name, item.quantity, item.status))
        } else if (item.sizeDTO.name === 'L') {
                htmlsSizeL.push(returnHtml(item.specifications_id, item.colorDTO.color_id, item.colorDTO.hex, item.colorDTO.name, item.quantity, item.status))
        } else if (item.sizeDTO.name === 'XL') {
            htmlsSizeXL.push(returnHtml(item.specifications_id, item.colorDTO.color_id, item.colorDTO.hex, item.colorDTO.name, item.quantity, item.status))
        } else if (item.sizeDTO.name === '2XL') {
            htmlsSizeXXL.push(returnHtml(item.specifications_id, item.colorDTO.color_id, item.colorDTO.hex, item.colorDTO.name, item.quantity, item.status))
        }
    })
    document.getElementById('size__m').innerHTML = htmlsSizeM.join('')
    document.getElementById('size__l').innerHTML = htmlsSizeL.join('')
    document.getElementById('size__xl').innerHTML = htmlsSizeXL.join('')
    document.getElementById('size__xxl').innerHTML = htmlsSizeXXL.join('')
    hideProductDetail()
    showProductDetail()
    editSpecificationFunc()
}

function returnHtml(id, colorId, hex, name, quantity, isHidden) {
    const hide = ['none', 'flex']
    const show = ['flex', 'none']
    return `
        <tr class="size__detail">
            <td><span class="product__detail__id" hidden>${id}</span></td>
            <td>
                <div class="color__infor">
                    <h3 class="color__id" hidden>${colorId}</h3>
                    <div class="color__preview" style="background-color: #${hex}"></div>
                    <div class="color__name__product">${name}</div>
                </div>
            </td>
            <td class="stock">${Utils.formatNumber(quantity)}</td>
            <td>
                <div class="edit__info toggle__product">
                    <span class="material-symbols-outlined edit__specification">
                        edit
                    </span>
                    <span class="material-symbols-outlined hide__product__detail" style="display: ${hide[isHidden]}">
                        visibility_off
                    </span>
                    <span class="material-symbols-outlined show__product__detail" style="display: ${show[isHidden]}">
                        visibility
                    </span>
                </div>
            </td>
        </tr>
    `
}
 

function getProductId() {
    const productItems = document.querySelectorAll('.product__item')
    productItems.forEach(item => {
        item.addEventListener('click', () => {
            productId = item.querySelector('.product__id').textContent
            console.log(productId)
            getProductSpecifications(productId)
        })
    })
}

async function getProductSpecifications(product_id) {
    showLoading(true)
    try {
        const data = await Api.getData('specifications/get-by-product/' + product_id.toString());
        showLoading(false)
        if (data) {
            console.log(data)
            renderSpecificationList(data, productId)
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

async function addNewColor(data) {
    showLoading(true)
    try {
        const response = await Api.postData('color/add-new-color', data)
        showLoading(false)
        if (response.status === 200) {
            addNewColorBackground.style.display = 'none'
            Utils.showToast(
                "Thêm màu thành công",
                'check_circle'
            )
            getAllColors()
            
        } else {
            Utils.showToast(
                "Có lỗi xảy ra. Vui lòng thử lại!",
                'error'
            )
        }        
        
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

async function getAllColors() {
    try {
        const data = await Api.getData('color/get-all-colors');
        if (data) {
            renderColorList(data)
            return data
        } else {
            Utils.showToast(
                'Lỗi lấy danh sách màu sắc',
                'error'
            )
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

getAllColors()

function renderColorList(data) {
    const colorArr = data.colorDTOList
    console.log(colorArr)
    const htmls = []
    colorArr.forEach((item, index) => {
        htmls.push( `
            <tr class="each__color__wrapepr">
                <td class="color__id" hidden>${item.color_id}</td>
                <td class="order__number">${index + 1}</td>
                <td>
                    <div class="color__preview__wrapper" style="background-color: #${item.hex};"></div>
                </td>
                <td class="color__name">${item.name}</td>
                <td class="color__code">${item.hex}</td>
                <td class="color__created">${Utils.formatDateTime(item.createAt)}</td>
                <td>
                    <div class="edit__info edit__color">
                        <span style="font-size: 20px" class="material-symbols-outlined">
                            edit
                            </span>
                    </div>
                </td>
            </tr>
        `
        )
    })
    document.querySelector('#tbody__list__color__wrapper').innerHTML = htmls.join('')
    editColor()
}

function editColor() {
    const editColorIcons = document.querySelectorAll('.edit__color')
    editColorIcons.forEach(item => {
        item.addEventListener('click', () => {
            const parent = item.closest('.each__color__wrapepr')
            colorInfor = {
                color_id: parent.querySelector('.color__id').textContent,
                name : parent.querySelector('.color__name').textContent,
                hex: parent.querySelector('.color__code').textContent
            }
            console.log("Category original: ",categoryInfor)
            setupColorModal(
                'CHỈNH SỬA MÀU SẮC',
                'edit'
            )
            inputColorName.value = colorInfor.name.toString()
            inputColorCode.value = colorInfor.hex.toString()
            pickr.setColor('#' + colorInfor.hex.toString())
        })
    })
}

const titleColor = document.querySelector('.title__color')
// const colorPreview = document.querySelector('#color__code__preview')
// const colorPreviewIcon = document.querySelector('#color__preview__icon')
function setupColorModal(title, action) {
    titleColor.textContent = title
    buttonSaveColor.setAttribute('data-action', action.toLowerCase())
    showModal(addNewColorWrapper, addNewColorBackground)
}

async function updateColor(data) {
    showLoading(true)
    try {
        const response = await Api.putData('color/update-color', data)
        showLoading(false)
        if (response.status === 200) {
            Utils.showToast(
                'Cập nhật thông tin màu sắc thành công',
                'check_circle'
            )
            getAllColors()
            closeModal(addNewColorWrapper, addNewColorBackground)
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

async function changeProductStatus (id, status) {
    const product = {
        product_id : id,
        status : status
    }
    const content = ['Ẩn sản phẩm thành công', 'Hiển thị sản phẩm thành công']
    try {
        const response = await Api.putData('product/change-status', product)
        if (response.status === 200) {
            Utils.showToast(
                content[status],
                'check_circle'
            )
            getAllProductByCategory(categoryId)
            resetShowSpec()
            Utils.hiddenModalConfirm(modal, true)
        } else {
            Utils.showToast(
                'Có lỗi xảy ra. Vui lòng thử lại!',
                'error'
            )
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
    console.log("Hide product")
}

async function changeSpecificationStatus (id, status) {
    const specification = {
        specifications_id : id,
        status : status
    }
    const content = ['Ẩn chi tiết sản phẩm thành công','Hiển thị chi tiết sản phẩm thành công']
    console.log(specification)
    try {
        const response = await Api.putData('specifications/change-status', specification)
        if (response.status === 200) {
            Utils.showToast(
                content[status],
                'check_circle'
            )
            getProductSpecifications(productId)
            Utils.hiddenModalConfirm(modal, true)
            return true
        } else {
            console.log(response.status)
            Utils.showToast(
                'Có lỗi xảy ra. Vui lòng thử lại!',
                'error'
            )
            return false
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    } finally {
        // getProductSpecifications(id)
    }
}

function listeningConfirm(id, status, icon) {
    const confirmModalBtn = document.getElementById('confirm__order__btn')
    confirmModalBtn.addEventListener('click', () => {
        changeSpecificationStatus(id, status)
    })
}


editSpecificationBackground.addEventListener('click', (e) => {
    if (e.target === editSpecificationBackground) {
        closeModal(editSpecificationWrapper, editSpecificationBackground)
    }
})

cancelEditBtn.addEventListener('click', () => {
    closeModal(editSpecificationWrapper, editSpecificationBackground)
})



function editSpecificationFunc() {
    const editSpecification = document.querySelectorAll('.edit__specification')
    editSpecification.forEach(item => {
        item.addEventListener('click', () => {
            showModal(editSpecificationWrapper, editSpecificationBackground)
            validateInputQuantity.style.opacity = 0
            const parent = item.closest('.size__detail')
            updatedSpecification.specifications_id = parent.querySelector('.product__detail__id').textContent
            updatedSpecification.colorDTO.color_id = parent.querySelector('.color__id').textContent,
            updatedSpecification.quantity = removeLetters(parent.querySelector('.stock').textContent)

            editSpecificationModal(updatedSpecification)
        })
    })
}

function removeLetters(str) {
    return str.replace(/[^0-9]/g, '');
}

async function editSpecificationModal(data) {
    const specId = document.querySelector('#spec__id')
    specId.textContent = "MÃ "+ data.specifications_id
    specQuantity.value = data.quantity
    const fetchColorList = await getAllColors()
    const htmls = []
    fetchColorList.colorDTOList.forEach(item => {
        if (item.color_id === parseInt(data.colorDTO.color_id)) {
            console.log("Equal")
            htmls.push(`
                <option value=${item.color_id} selected>${item.name}</option>
            `)
        } else {
            htmls.push(`
                <option value=${item.color_id}>${item.name}</option>
            `)
        }
    })

    selectedColor.innerHTML = htmls.join('')
}

const confirmEditBtn = document.getElementById('confirm__edit__btn')
    confirmEditBtn.addEventListener('click', () => {
        if (specQuantity.value.trim() === '') {
            validateInputQuantity.textContent = 'Vui lòng nhập tồn kho'
            validateInputQuantity.style.opacity = 1
        } else if (parseInt(specQuantity.value.trim()) < 0) {
            validateInputQuantity.textContent = 'Giá trị tồn kho không hợp lệ'
            validateInputQuantity.style.opacity = 1
        } else {
            validateInputQuantity.style.opacity = 0
            updatedSpecification.colorDTO.color_id = selectedColor.value
            updatedSpecification.quantity = specQuantity.value
            fetchToUpdateSpecification(updatedSpecification)
        }
})

async function fetchToUpdateSpecification(spec) {
    try {
        const response = await Api.putData('specifications/update', spec)
        
        if(response.status === 200) {
            Utils.showToast(
                "Cập nhật chi tiết sản phẩm thành công",
                'check_circle'
            )
            closeModal(editSpecificationWrapper, editSpecificationBackground)
            getProductSpecifications(productId)
        }

    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

const modal = document.querySelector('.confirm__order__background')

function hideProduct() {
    const toggleProducts = document.querySelectorAll('.hide__product')
    toggleProducts.forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation()
            const parent = item.closest('.product__item')
            const productId = parent.querySelector('.product__id').textContent
            const productName = parent.querySelector('.item__name').textContent
            Utils.showModalConfirm(
                'XÁC NHẬN THAY ĐỔI',
                `Bạn có chắc chắn muốn ẩn <br> sản phẩm ${productName} không?`,
                '../../img/utils/hide.png',
                modal
            ) 
            const confirmModalBtn = document.getElementById('confirm__order__btn')
            confirmModalBtn.addEventListener('click', () => {
                changeProductStatus(productId, 0)
            })
            Utils.hiddenModalConfirm(modal)
        })
    })

}

function showProduct() {
    const toggleProducts = document.querySelectorAll('.show__product')
    toggleProducts.forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation()
            const parent = item.closest('.product__item')
            const productId = parent.querySelector('.product__id').textContent
            const productName = parent.querySelector('.item__name').textContent
            Utils.showModalConfirm(
                'XÁC NHẬN THAY ĐỔI',
                `Bạn có chắc chắn muốn hiển thị <br> sản phẩm ${productName} không?`,
                '../../img/utils/hide.png',
                modal
            ) 
            const confirmModalBtn = document.getElementById('confirm__order__btn')
            confirmModalBtn.addEventListener('click', () => {
                changeProductStatus(productId, 1)
            })
            Utils.hiddenModalConfirm(modal)
        })
    })

}

function hideProductDetail() {
    const toggleProuductDetails = document.querySelectorAll('.hide__product__detail')
    toggleProuductDetails.forEach(item => {
        item.addEventListener('click', () => {
            const parent = item.closest('.size__detail')
            const productDetailId = parent.querySelector('.product__detail__id').textContent
            Utils.showModalConfirm(
                "XÁC NHẬN THAY ĐỔI",
                `Bạn có chắc chắn muốn ẩn <br> chi tiết sản phẩm với mã ${productDetailId} không ?`,
                "../../img/utils/hide.png",
                modal
            )
            listeningConfirm(productDetailId, 0, item)
            Utils.hiddenModalConfirm(modal)
        })
    })
}

function showProductDetail() {
    const toggleProuductDetails = document.querySelectorAll('.show__product__detail')
    toggleProuductDetails.forEach(item => {
        item.addEventListener('click', () => {
            const parent = item.closest('.size__detail')
            const productId = parent.querySelector('.product__detail__id').textContent
            Utils.showModalConfirm(
                "XÁC NHẬN THAY ĐỔI",
                `Bạn có chắc chắn muốn hiển thị <br> chi tiết sản phẩm với mã ${productId} không ?`,
                "../../img/utils/hide.png",
                modal
            )
            listeningConfirm(productId, 1, item)
            Utils.hiddenModalConfirm(modal)
        })
    })
}

function resetShowSpec() {
    document.getElementById('size__m').innerHTML = ''
    document.getElementById('size__l').innerHTML = ''
    document.getElementById('size__xl').innerHTML = ''
    document.getElementById('size__xxl').innerHTML = ''
}


function categoryIsActive() {
    const categories = document.querySelectorAll('.each__category')
    categories[0].classList.add('active');
    categoryId = categories[0].querySelector('span').textContent
    getAllProductByCategory(categoryId)
    categories.forEach(item => {
        item.addEventListener('click', () => {
            categories.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            categoryId = item.querySelector('span').textContent
            getAllProductByCategory(categoryId)
        })
    })
}

const sortCombobox = document.getElementById('sort__combobox')
sortCombobox.addEventListener('change', () => {
    getValueToSort()
})

function getValueToSort() {
    const sortValue = sortCombobox.value
    const sortResult =  sortData(sortValue)
    console.log("Result: ",sortResult)
    renderProductList(sortResult)
}

function sortData(condition) {
    let copiedArr = arrToHandle
    // if (filterProduct.classList.contains('active') || ) {
    //     copiedArr = arrToHandle
    // }
    console.log(copiedArr)
    if (condition === 'newest') {
        copiedArr.sort((a, b) => new Date(b.create_at) - new Date(a.create_at));
        return copiedArr
    }
    if (condition === 'oldest') {
        copiedArr.sort((a, b) => new Date(a.create_at) - new Date(b.create_at));
        return copiedArr
    }
    if (condition === 'price_asc') {
        copiedArr.sort((a, b) => a.price - b.price);
        return copiedArr
    }
    if (condition === 'price_desc') {
        copiedArr.sort((a, b) => b.price - a.price);
        return copiedArr
    }
}

filterProduct.addEventListener('click', (e) => {
    filterProduct.classList.toggle('active')
    if (filterProduct.classList.contains('active')) {
        arrToHandle = productList.filter(item => item.status === 0)
        renderProductList(arrToHandle)
    } else if (searchArr) {
        renderProductList(searchArr)
        arrToHandle = searchArr.slice()
    } else {
        renderProductList(productList)
    }
})

const inputToSearch = document.getElementById('input__search')
const clickToSearch = document.getElementById('search__icon')
var searchArr

clickToSearch.addEventListener('click', () => {
    if (inputToSearch.value.trim() === '') {
        Utils.showToast(
            'Vui lòng nhập nội dung tìm kiếm',
            'warning'
        )
        return false
    }
    searchArr = productList.filter(item => item.name.includes(inputToSearch.value.trim()))
    arrToHandle = searchArr.slice()
    renderProductList(arrToHandle)
    inputToSearch.value = ''
})

inputToSearch.addEventListener('keydown', (e)=> {
    if (e.key == 'Enter') {
        if (inputToSearch.value.trim() === '') {
            Utils.showToast(
                'Vui lòng nhập nội dung tìm kiếm',
                'warning'
            )
            return false
        }
        searchArr = productList.filter(item => item.name.includes(inputToSearch.value.trim()))
        arrToHandle = searchArr.slice()
        renderProductList(arrToHandle)
        inputToSearch.value = ''
    }
})


buttons.forEach(item => {
    item.addEventListener('mousedown', () => {
        item.classList.toggle('active')
    })

    item.addEventListener('mouseup', () => {
        item.classList.toggle('active')
    })
})

iconButtonList.forEach(i => {
    i.addEventListener('mousedown', () => {
        i.classList.toggle('active')
    })
    i.addEventListener('mouseup', () => {
        i.classList.toggle('active')
    })
})

buttonList.forEach(i => {
    i.addEventListener('mousedown', () => {
        i.classList.toggle('active')
    })
    i.addEventListener('mouseup', () => {
        i.classList.toggle('active')
    })
})

input.addEventListener('change', () => {
    categoryImage.hidden = true
    if (input.files.length > 0) {
        const reader = new FileReader();
        reader.onload = function(e) {
            categoryImage.hidden = false
            categoryImage.src = e.target.result
        }        
        reader.readAsDataURL(input.files[0]);
        categoryImageValidate.style.opacity = 0
        // iconAddNewCategory.style.display = 'none'
        // iconUploaded.style.display = 'inline'
    }
})

addNewCategoryBackground.addEventListener('click', (e) => {
    if (e.target === addNewCategoryBackground) {
        closeModal(addNewCategoryWrapper, addNewCategoryBackground)
        clearCategoryContent()
    }
})

addNewColorBackground.addEventListener('click', (e) => {
    if (e.target === addNewColorBackground) {
        closeModal(addNewColorWrapper, addNewColorBackground)
        clearColorContent()
    }
})

iconCloseCategoryModal.addEventListener('click', () => {
    closeModal(addNewCategoryWrapper, addNewCategoryBackground)
    clearCategoryContent()
})

iconCloseColorModal.addEventListener('click', () => {
    closeModal(addNewColorWrapper, addNewColorBackground)
    clearColorContent()
})

buttonCancelCategory.addEventListener('click', () => {
    closeModal(addNewCategoryWrapper, addNewCategoryBackground)
    clearCategoryContent()
})

buttonCancelColor.addEventListener('click', () => {
    closeModal(addNewColorWrapper, addNewColorBackground)
    clearColorContent()
})



function closeModal(wrapperName, background) {
    wrapperName.classList.add('disabled')
    setTimeout(() => {
        wrapperName.classList.remove('active', 'disabled')
        background.style.display = 'none'
    }, 100);
}

function showModal(wrapperName, background = null) {
    if (background) {
        background.style.display = 'flex'
    }
    setTimeout(() => {
        wrapperName.classList.add('active')
    }, 50);
}

buttonAddNewCategory.addEventListener('click', () => {
    clearCategoryContent()
    clearCategoryValidate()
    setupCategoryModal('THÊM DANH MỤC MỚI', 'ADD')
    showModal(addNewCategoryWrapper, addNewCategoryBackground)
})

buttonAddNewColor.addEventListener('click', () => {
    clearColorContent()
    clearColorValidate()
    setupColorModal('THÊM MÀU SẮC MỚI', 'ADD')
    showModal(addNewColorWrapper, addNewColorBackground)
})

function clearCategoryContent(option) {
    inputCategoryName.value = ''
    inputCategoryImg.value = ''
    iconAddNewCategory.style.display = 'inline'
    iconUploaded.style.display = 'none' 
}

function clearCategoryValidate() {
    categoryImageValidate.style.opacity = 0
    categoryNameValidate.style.opacity = 0
    categoryImage.src = '#'
    categoryImage.hidden = true
}

function clearColorContent() {
    inputColorName.value = ''
    inputColorCode.value = ''
    // colorPreview.style.backgroundColor = 'Transparent'
    // colorPreviewIcon.hidden = false
}

function clearColorValidate() {
    colorNameValidate.style.opacity = 0
    colorCodeValidate.style.opacity = 0
}


// inputColorCode.addEventListener('input',() => {
//     let value = inputColorCode.value.replaceAll("#","")
//     // const colorPreview = document.getElementById('color__code__preview')
//     const iconPreviewColor = document.getElementById('color__preview__icon')
//     if(value.length >= 6) {
//         iconPreviewColor.hidden = true
//         colorPreview.style.backgroundColor = "#" + value
//     } else {
//         iconPreviewColor.hidden = false
//         colorPreview.style.backgroundColor = "Transparent"
//     }
// })

const categoryNameValidate = document.getElementById('category__name__validate')
const categoryImageValidate = document.getElementById('category__img__validate')

const colorNameValidate = document.getElementById('color__name__validate')
const colorCodeValidate = document.getElementById('color__code__validate')

buttonSaveCategory.addEventListener('click', async () => {
    let check = true
    const buttonAction = buttonSaveCategory.dataset.action
    if (inputCategoryName.value.trim() === '') {
        categoryNameValidate.textContent = 'Vui lòng nhập tên danh mục'
        categoryNameValidate.style.opacity = 1
        check = false
    } else if (Utils.hasSpecialCharacters(inputCategoryName.value.trim())) {
        categoryNameValidate.textContent = 'Không cho phép kí tự đặc biệt'
        categoryNameValidate.style.opacity = 1
        check = false
    } else {
        categoryNameValidate.style.opacity = 0
    }
    if (check) {

        if (buttonAction === 'add') {
            if (inputCategoryImg.value === '') {
                categoryImageValidate.style.opacity = 1
                return
            } else {
                categoryImageValidate.style.opacity = 0
            }
            clearCategoryValidate()
            let image = null
            try {
                image = await convertToBase64(inputCategoryImg);
            } catch (error) {
                console.error(error);
            }
            let category = {
                name : inputCategoryName.value.trim(),
                image : image
            }
            addNewCategory(category)
            console.log(category)
        } else if (buttonAction === 'edit') {
            categoryInfor.name = inputCategoryName.value.trim()
            if (check && inputCategoryImg.value != '') {
                // clearCategoryValidate()
                let image = null
                try {
                    image = await convertToBase64(inputCategoryImg);
                } catch (error) {
                    console.error(error);
                }
                if (image) {
                    categoryInfor.image = image
                }
            }
            updateCategory(categoryInfor)
            console.log("category edit: ", categoryInfor)
        }
    }
})

buttonSaveColor.addEventListener('click', () => {
    let check = true
    let buttonAction = buttonSaveColor.dataset.action
    if (inputColorName.value.trim() === '') {
        colorNameValidate.textContent = 'Vui lòng nhập tên màu sắc'
        colorNameValidate.style.opacity = 1
        check = false
    } else if (Utils.hasSpecialCharacters(inputColorName.value.trim())) {
        colorNameValidate.textContent = 'Không cho phép kí tự đặc biệt'
        colorNameValidate.style.opacity = 1
        check = false
    } else {
        colorNameValidate.style.opacity = 0
    }
    if (inputColorCode.value.trim() === '') {
        colorCodeValidate.textContent = 'Vui lòng nhập mã màu sắc'
        colorCodeValidate.style.opacity = 1
        check = false
    } else if (inputColorCode.value.startsWith('#')) {
        if (Utils.hasSpecialCharacters(inputColorCode.value.slice(1))) {
            colorCodeValidate.textContent = 'Mã màu sắc không hợp lệ'
            colorCodeValidate.style.opacity = 1
            check = false
        }
    } else if (Utils.hasSpecialCharacters(inputColorCode.value)) {
        colorCodeValidate.textContent = 'Mã màu sắc không hợp lệ'
        colorCodeValidate.style.opacity = 1
        check = false
    } else {
        colorCodeValidate.style.opacity = 0
    }
    if (check) {
        clearColorValidate()
        const color = {
            name : inputColorName.value.trim(),
            hex : inputColorCode.value.trim()
        }
        if (buttonAction === 'add') {
            addNewColor(color)
            console.log(inputColorName.value.trim(), inputColorCode.value.trim())
        } else if (buttonAction === 'edit'){
            colorInfor.name = inputColorName.value.trim()
            colorInfor.hex = inputColorCode.value.trim()
            updateColor(colorInfor)
            console.log(colorInfor)
            console.log(inputColorName.value.trim(), inputColorCode.value.trim())
        }
    }
})

const addNewProductBtn = document.getElementById('add__new__product__wrapper')
addNewProductBtn.addEventListener('click', () => {
    window.location.href = '/admin/add-new-product'
})




