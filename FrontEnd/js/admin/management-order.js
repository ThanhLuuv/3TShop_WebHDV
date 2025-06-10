import Utils from "../../js/admin/Utils.js";
import Api from "../../js/admin/Api.js";

const orderStatus = document.querySelectorAll('.order__status')
const buttons = document.querySelectorAll('button')
const iconButtons = document.querySelectorAll('.material-symbols-outlined')

// const inputShipment = document.getElementById('input__shipment')
// const editShipment = document.getElementById('edit__shipment')
// const saveShipment = document.getElementById('save__shipment')
// const cancelEditShipmentWrapper = document.querySelector('.cancel__edit__shipment__wrapper')

const filterButton = document.getElementById('filter__button')
const elementId = document.querySelector('.navigation')
const confirmOrderBackground = document.querySelector('.confirm__order__background')
const cancelOrderBackground = document.querySelector('.cancel__order__background')
const sortCombobox = document.getElementById('select__order__price')

const startDateInput = document.getElementById('input__start__date')
const endDateInput = document.getElementById('input__end__date') 

const orderDetailOutside = document.querySelector('.order__detail__outside')
const footerShowInfor = document.querySelector('.footer__show__information')
const placeholderImage = document.getElementById('placeholder__image')
const emptyOrderList = document.querySelector('.is__empty__order__list')
const orderListWrapper = document.querySelector('.order__list__wrapper')
const orderDetailWrapper = document.querySelector('.order__detail__wrapper')

Utils.getHeader()

var originalList = []
var orderList
var orderId
var orderStatusDTO
var isShowAll

orderStatus[0].classList.add('active')
orderStatus.forEach(item => {
    item.addEventListener('click', () => {
        resetContent()
        resetShowOrderDetail()
        orderStatus.forEach(i => i.classList.remove('active'))
        item.classList.toggle('active')
        console.log(item.getAttribute('id'), filterOrderByStatus(item.getAttribute('id')))
        if (item.getAttribute('id') === 'all__order') {
            getAllOrder()
            return
        }
        renderOrder(filterOrderByStatus(item.getAttribute('id')))
        console.log('orderList: ', orderList)
    })
})

function resetContent() {
    sortCombobox.value = 'none'
    startDateInput.value = ''
    endDateInput.value = ''
    orderSeaching.value = ''
}

function orderStatusBar() {
    orderStatus.forEach(i => i.classList.remove('active'))
    orderStatus[0].classList.add('active')
}

function filterOrderByStatus(condition) {
    const filterObj = {
        'approving__order' : 1,
        'delivering__order' : 2,
        'completed__order' : 3,
        'cancelled__order' : 4
    }
    return originalList.filter(item => item.orderStatusDTO.status === filterObj[condition])
}

getAllOrder()

function showLoading(option) {
    if (option) {
        document.querySelector('.loading__icon').style.display = 'flex'
        orderListWrapper.style.display = 'none'
        orderDetailWrapper.style.display = 'none'
        return
    }
    document.querySelector('.loading__icon').style.display = 'none'
    orderListWrapper.style.display = 'flex'
    orderDetailWrapper.style.display = 'flex'
} 

async function getAllOrder(option = null) {
    showLoading(true)
    try {
        const data = await Api.getData('order/get-all')
        showLoading(false)
        if (data) {
            if (option != null) {
                originalList = data.orderResponses
                renderOrder(data.orderResponses.filter(i => i.orderStatusDTO.status === option))
                return
            }
            originalList = data.orderResponses
            renderOrder(data.orderResponses)
        }
        
    } catch (error) {
        console.log("Error: ", error)
    }
}

const orderStatusArr = [
    {
        name: "Chờ xác nhận",
        background: "#FCDAC5",
        text: "#C2510A"
    },
    {
        name: "Đang vận chuyển",
        background: "#BFD5EE",
        text: "#295F98"
    },
    {
        name: "Hoàn thành",
        background: "#CAE0E2",
        text: "#487F84"
    },
    {
        name: "Đã hủy",
        background: "#FFD6D6",
        text: "#A30000"
    }
]



function renderOrder(dataArr) {
    if (dataArr.length === 0) {
        emptyOrderList.style.display = 'flex'
        orderListWrapper.style.display = 'none'
        orderDetailWrapper.style.display = 'none'
        return
    }
    emptyOrderList.style.display = 'none'
    orderListWrapper.style.display = 'flex'
    orderDetailWrapper.style.display = 'flex'
    orderList = dataArr.slice()
    document.getElementById('number__of__order').textContent = dataArr.length
    const htmls = []
    dataArr.forEach(item => {
        htmls.push(`
            <tr class="each__order">
                <td class="id__col">${item.order_id}</td>
                <td>${item.userDTO.f_name}</td>
                <td>${Utils.formatDateTime(item.date)}</td>
                <td>${Utils.formatCurrency(item.total_price)}</td>
                <td>
                    <div class="order__status__wrapper">
                        <h3 class="order__status__col" style="background-color: ${orderStatusArr[item.orderStatusDTO.status - 1].background}; color: ${orderStatusArr[item.orderStatusDTO.status - 1].text}">${orderStatusArr[item.orderStatusDTO.status - 1].name}</h3>
                    </div>
                </td>
            </tr>
        `)
    })
    document.querySelector('.tbody__order__list').innerHTML = htmls.join('')
    getOrderDetail()
}

function getOrderDetail() {
    const eachOrder = document.querySelectorAll('.each__order')
    eachOrder.forEach(row => {
        row.addEventListener('click', () => {
            const idValue = row.querySelector('.id__col').textContent;
            orderId = idValue
            const orderDetail = orderList.filter(order => order.order_id === parseInt(idValue))
            showOrderDetail(orderDetail[0])
        })
    })
}

function renderStatus(orderStatusDTO) {
    const showByStatus = [
        `
            <button type="button" id="cancel__order">Hủy đơn hàng</button>
            <button type="button" id="confirm__order">Xác nhận đơn hàng</button>
        `,
        `
            <div class="datetime__about__order">
                <div class="datetime__title">
                    <h3>Thời gian xác nhận đơn hàng</h3>
                    <h3>Thời gian giao hàng dự kiến</h3>
                </div>
                <div class="datetime__detail">
                    <h3>${Utils.formatDateTime(orderStatusDTO.create_at)}</h3>
                    <h3>${Utils.predictDeliveryDate(orderStatusDTO.create_at)}</h3>
                </div>
            </div>
            <button type="button" id="complete__order">Hoàn thành đơn hàng</button>
        `,
        `
            <div class="datetime__about__order">
                <div class="datetime__title">
                    <h3>Thời gian xác nhận</h3>
                    <h3>Thời gian giao hàng dự kiến</h3>
                </div>
                <div class="datetime__detail">
                    <h3>${Utils.formatDateTime(orderStatusDTO.create_at)}</h3>
                    <h3>${Utils.predictDeliveryDate(orderStatusDTO.create_at)}</h3>
                </div>
            </div>
            <div class="complete__time__wrapper">
                <h3>Thời gian hoàn thành</h3>
                <h3 class="complete__time">${Utils.formatDateTime(orderStatusDTO.create_at)}</h3>
            </div>
        `,
        `
            <div class="ordered__cancel__wrapper">
                <div class="datetime__related">
                    <div class="time__wrapper">
                        <h3>Thời gian hủy đơn hàng</h3>
                        <h3 class="cancel__time">${Utils.formatDateTime(orderStatusDTO.create_at)}</h3>
                    </div>
                </div>
                <div class="cancel__reason__wrapper">
                    <h3>Lý do hủy đơn hàng</h3>
                    <h3 class="cancel__content">
                        ${orderStatusDTO.note}
                    </h3>
                </div>
            </div>
        `
    ]
    return showByStatus
}


function showOrderDetail(data) {
    console.log(data)
    const detailDTO = data.orderDetailDTOS
    orderStatusDTO = data.orderStatusDTO
    renderStatus(data.orderStatusDTO)

    showPlaceholderImage(false)

    orderDetailOutside.innerHTML = `
        <div class="title__order__detail__wrapper">
                    <h3 id="order__id__title">MÃ ĐƠN HÀNG</h3>
                    <h3 id="order__id__content">${data.order_id}</h3>
                </div>
                <div class="order__detail__body">
                    <div class="order__information__wrapper">
                        <div class="customer__name__title">
                            <h3>Khách hàng</h3>
                        </div>
                        <div class="customer__name__content">
                            <h3>${data.name}</h3>
                        </div>
                        <div class="customer__phone__title">
                            <h3>Số điện thoại</h3>
                        </div>
                        <div class="customer__phone__content">
                            <h3>${data.phone}</h3>
                        </div>
                        <div class="customer__address__title">
                            <h3>Địa chỉ</h3>
                        </div>
                        <div class="customer__address__content">
                            <h3>${data.address_line_1 + " " + data.address_line_2}</h3>
                        </div>
                        <div class="customer__time__title">
                            <h3>Thời gian đặt hàng</h3>
                        </div>
                        <div class="customer__time__content">
                            <h3>${Utils.formatDateTime(data.date)}</h3>
                        </div>
                        <div class="customer__shipment__title">
                            <h3>Phí giao hàng</h3>
                        </div>
                        <div class="customer__shipment__content">
                            <h3>30.000đ</h3>
                        </div>
                        <div class="customer__note__title">
                            <h3>Ghi chú đơn hàng</h3>
                        </div>
                        <div class="customer__note__content">
                            <h3>${data.note}</h3>
                        </div>
                        <div class="customer__total__title">
                            <h3>Tổng giá trị đơn hàng</h3>
                        </div>
                        <div class="customer__total__content">
                            <h3>${Utils.formatCurrency(data.total_price)}</h3>
                        </div>
                    </div>
                </div>
                <table class="ordered__product__list">
                    <thead class="table__header__wrapper">
                            <tr>
                                <th class="table__header">STT</th>
                                <th class="table__header">Sản phẩm</th>
                                <th class="table__header">Số lượng</th>
                                <th class="table__header">Giá</th>
                                <th class="table__header">Thành tiền</th>
                            </tr>
                        </thead>
                        <tbody id="tbody__table">
                        </tbody>
                </table>
        `
    const tbodyTable = document.getElementById('tbody__table')
    let htmls = []
    detailDTO.forEach((item, index) => {
        htmls.push( `
            <tr class="table__row">
                <td>${index + 1}</td>
                <td>
                    <div class="product__information">
                        <img src="${Utils.renderImage(item.specificationsDTO.productDTO.image)}" class="product__image" alt="product">
                        <div class="product__specifications">
                            <h3 class ="product__name">${item.specificationsDTO.productDTO.name}</h3>
                            <h3 class ="product__color">Màu sắc ${item.specificationsDTO.colorDTO.name}</h3>
                            <h3 class ="product__size">Size ${item.specificationsDTO.sizeDTO.name}</h3>
                        </div>
                    </div>
                </td>
                <td>x${item.quantity}</td>
                <td>${Utils.formatCurrency(item.specificationsDTO.productDTO.price)}</td>
                <td>${Utils.formatCurrency((item.specificationsDTO.productDTO.price * item.quantity))}</td>
            </tr>
        `)
    }) 
    tbodyTable.innerHTML = htmls.join('')
    const footerShowInformation = document.querySelector('.footer__show__information')
    footerShowInformation.innerHTML = renderStatus(data.orderStatusDTO)[data.orderStatusDTO.status - 1]
    if (data.orderStatusDTO.status === 1) {
        showModalToApproveOrder()
        cancelOrder()
    } else if (data.orderStatusDTO.status === 2) {
        showModalToCompleteOrder()
    }
}


function resetShowOrderDetail() {
    orderDetailOutside.innerHTML = `
        <img src="../../img/utils/info-sign.png" alt="no information" id="placeholder__image">
    `
    orderDetailOutside.classList.add('empty')
    document.querySelector('.footer__show__information').innerHTML = ''
    document.querySelector('.footer__show__information').classList.add('empty')
}

function showModalToApproveOrder() {
    const clickToConfirmOrder = document.getElementById('confirm__order')
    clickToConfirmOrder.addEventListener('click', () => {
        Utils.showModalConfirm(
            'XÁC NHẬN ĐƠN HÀNG',
            `Bạn có chắc chắn muốn xác nhận <br> đơn hàng có mã ${orderId} không ?`,
            '../../img/utils/confirm__order.png',
            confirmOrderBackground
        )
        Utils.hiddenModalConfirm(confirmOrderBackground)
        const confirmOrderBtn = document.getElementById('confirm__order__btn')
        const status = {
            order_id : orderId,
            note : '',
            status : 2
        }
        confirmOrderBtn.addEventListener('click', () => {
            changeOrderStatus(status, 'Xác nhận đơn hàng thành công', confirmOrderBackground)
        })
    })
}

async function changeOrderStatus(data, title, background) {
    try {
        const response = await Api.postData('order/change-status', data)
        if (response.status === 200) {
            Utils.showToast(
                title,
                'check_circle'
            )
            if (data.status === 4) {
                Utils.hiddenModalCancel(cancelOrderBackground, true)
            } else {
                Utils.hiddenModalConfirm(background, true)
            }
            if (orderStatus[0].classList.contains('active')) {
                getAllOrder()
            } else {
                let statusNumber
                if (data.status === 4) {statusNumber = data.status - 3}
                else {statusNumber = data.status - 1}
                getAllOrder(statusNumber)
            }
            resetShowOrderDetail()
        } else {
            Utils.showToast(
                "Có lỗi xảy ra. Vui lòng thử lại!",
                'error'
            )
        }
        
    } catch (error) {
        console.log("Error ", error)
    }
}

function cancelOrder() {
    const clickToCancelOrder = document.getElementById('cancel__order')
    clickToCancelOrder.addEventListener('click', () => {
        Utils.showModalCancel(
            cancelOrderBackground
        )
        Utils.hiddenModalCancel(cancelOrderBackground)
        const validateInputReason = document.getElementById('validate__input__reason')
        const inputCancelReason = document.getElementById('input__cancel__reason')
        const cancelOrderBtn = document.getElementById('cancel__order__btn')
        cancelOrderBtn.addEventListener('click', () => {
            if (inputCancelReason.value.trim() === '') {
                validateInputReason.textContent = "Vui lòng nhập lý do hủy đơn"
                validateInputReason.style.opacity = 1
            } else if (Utils.hasSpecialCharacters(inputCancelReason.value.trim())) {
                validateInputReason.textContent = "Không cho phép ký tự đặc biệt"
                validateInputReason.style.opacity = 1
            } else {     
                const status = {
                    order_id : orderId,
                    note : inputCancelReason.value.trim(),
                    status : 4
                }
                validateInputReason.style.opacity = 0
                inputCancelReason.value = ''
                changeOrderStatus(status, 'Hủy đơn hàng thành công', cancelOrderBackground)
            }
        })
    })
}

function showModalToCompleteOrder() {
    const completeOrder = document.getElementById('complete__order')
    completeOrder.addEventListener('click', () => {
        Utils.showModalConfirm(
            'XÁC NHẬN HOÀN THÀNH ĐƠN HÀNG',
            `Bạn có chắc chắn xác nhận đã hoàn thành <br> đơn hàng có mã ${orderId} không ?`,
            '../../img/utils/confirm__order.png',
            confirmOrderBackground
        )
        Utils.hiddenModalConfirm(confirmOrderBackground)
        const confirmOrderBtn = document.getElementById('confirm__order__btn')
        const status = {
            order_id : orderId,
            note : '',
            status : 3
        }
        confirmOrderBtn.addEventListener('click', () => {
            changeOrderStatus(status, 'Đơn hàng đã hoàn thành', confirmOrderBackground)
        })
    })
}

sortCombobox.addEventListener('change', () => {
    console.log(sortCombobox.value)
    const selectedValue = sortCombobox.value
    renderOrder(sortedData(selectedValue))
    
})

function sortedData(condition) {
    if (condition === 'newest') {
        orderList.sort((a, b) => new Date(b.date) - new Date(a.date))
        return orderList
    }
    if (condition === 'oldest') {
        orderList.sort((a, b) => new Date(a.date) - new Date(b.date))
        return orderList
    }
    if (condition === 'price_esc') {
        orderList.sort((a, b) => a.total_price - b.total_price)
        return orderList
    }

    if (condition === 'price_desc') {
        orderList.sort((a, b) => b.total_price - a.total_price)
        return orderList
    }
}

filterButton.addEventListener('click', () => {
    if (startDateInput.value.trim() === '') {
        Utils.showToast('Vui lòng chọn ngày bắt đầu lọc!', 'warning')
    } else if (endDateInput.value.trim() === '') {
        Utils.showToast('Vui lòng chọn ngày kết thúc lọc!', 'warning')
    } else if (startDateInput.value.trim() > endDateInput.value.trim()) {
        Utils.showToast('Ngày bắt đầu phải nhỏ hơn ngày kết thúc!', 'warning')
    } else if (Utils.formatDateTimeToFilter(endDateInput.value.trim(), true) > Utils.predictDeliveryDate(new Date().toString(), false)) {
        console.log(Utils.formatDateTimeToFilter(endDateInput.value.trim(), true), Utils.predictDeliveryDate(new Date().toString(), true))
        Utils.showToast('Ngày kết thúc không lớn hơn ngày hiện tại!', 'warning')
    }
    else {
        // let startDate = new Date(startDateInput.value)
        // let endDate = new Date(endDateInput.value)
        let startDate = Utils.formatDateTimeToFilter(startDateInput.value, false)
        let endDate = Utils.formatDateTimeToFilter(endDateInput.value, true)
        console.log(startDate, endDate)
        renderOrder(filterByDate(startDate, endDate))
    }
})

function filterByDate(startDate, endDate) {
    return orderList.filter(item => new Date(item.date) >= new Date(startDate) && new Date(item.date) <= new Date(endDate))
    
}

const clickToSearch = document.querySelector('.search__icon')
const orderSeaching = document.getElementById('order__searching')
orderSeaching.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') { 
        if(containsNumber(orderSeaching.value.trim())) {
            renderOrder(searchOrder(orderSeaching.value.trim(), 'order_id'))
        } else {
            renderOrder(searchOrder(orderSeaching.value.trim(), 'name'))
        }
        resetContent()
        orderStatusBar()
    }
})
clickToSearch.addEventListener('click', () => {
    console.log(orderSeaching.value)
    orderStatus[0].classList.add('active')
    if(containsNumber(orderSeaching.value.trim())) {
        renderOrder(searchOrder(orderSeaching.value.trim(), 'order_id'))
    } else {
        renderOrder(searchOrder(orderSeaching.value.trim(), 'name'))
    }
    resetContent()
    orderStatusBar()
})

function searchOrder(condition, type) {
    let result = originalList.slice()
    if(type === 'order_id') {
        return result.filter(item => item.order_id.toString().includes(condition))
    }
    if (type === 'name') {
        return result.filter(item => item.name.includes(condition))
    }
}
function containsNumber(inputValue) {
    const regex = /\d/
    return regex.test(inputValue);
}

// ----------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------

buttons.forEach(i => {
    i.addEventListener('mousedown', () => {
        i.style.scale = 0.95
    })
    i.addEventListener('mouseup', () => {
        i.style.scale = 1
    })
})

iconButtons.forEach(i => {
    i.addEventListener('mousedown', () => {
        i.classList.add('active')
    })
    i.addEventListener('mouseup', () => {
        i.classList.remove('active')
    })
})

// editShipment.addEventListener('click', () => {
//     console.log('Edit')
//     toggleEditShipment(false)
//     toggleSaveShipment(true)
// })

// saveShipment.addEventListener('click', () => {
//     if (parseFloat(inputShipment.value) < 0) {
//         showToast('Mức phí giao hàng không hợp lệ!');
//         return
//     } else if (inputShipment.value.trim() === '') {
//         showToast('Vui lòng nhập phí giao hàng!');
//         return
//     }
//     toggleEditShipment(true)
//     toggleSaveShipment(false)
// })

// cancelEditShipmentWrapper.addEventListener('click', () => {
//     setTimeout(() => {
//         cancelEditShipmentWrapper.classList.remove('active')
//         cancelEditShipmentWrapper.style.display = 'none'
//         toggleSaveShipment(false)
//         toggleEditShipment(true)
//     }, 100);
// })


// function toggleEditShipment(option) {
//     if (option) {
//         editShipment.style.display = 'flex'
//         inputShipment.disabled = true
//         // inputShipment.value = ''  
//         return  
//     } 
//     editShipment.style.display = 'none'
//     inputShipment.disabled = false
//     setTimeout(() => {
//         cancelEditShipmentWrapper.classList.add('active')
//     }, 200);
// }

// function toggleSaveShipment(option) {
//     if (option) {
//         saveShipment.style.display = 'flex'
//         cancelEditShipmentWrapper.style.display = 'flex'
//         setTimeout(() => {
//             cancelEditShipmentWrapper.classList.add('active')
//         }, 200);
//         inputShipment.disabled = false
//         return  
//     } 
//     saveShipment.style.display = 'none'
//     inputShipment.disabled = true
//     inputShipment.value = ''
// }


function showPlaceholderImage(option) {
    if (option) {
        placeholderImage.hidden = false
        orderDetailOutside.classList.add('empty')
        footerShowInfor.classList.add('empty')
        return
    }
    placeholderImage.hidden = true
    orderDetailOutside.classList.remove('empty')
    footerShowInfor.classList.remove('empty')
}

showPlaceholderImage(true)











