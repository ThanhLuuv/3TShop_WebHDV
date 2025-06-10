import Utils from "../../js/admin/Utils.js";
import Api from "../../js/admin/Api.js";

const chartByYear = document.getElementById('chart__by__year');
const chartByMonth = document.getElementById('chart__by__month')
const doughnutChart = document.getElementById('doughnut__chart__by__month')
const inputStatisticByDate = document.getElementById('input__statistic__by__date')
const viewStatisticByDate = document.getElementById('view__statistic__by__date')
const revenue = document.querySelector('.revenue')
const totalNewOrder = document.querySelector('.total__new__order')
const totalBoughtProduct = document.querySelector('.total__bought__product')
const ratioSuccessOrder = document.querySelector('.ratio__success__order')
const showComaprePercent = document.querySelectorAll('.show__compare__percent')
const viewStatisticByYear = document.getElementById('statistic__year')
const inputYear = document.getElementById('input__year')
const inputMonth = document.getElementById('input__month')
const viewStatisticByMonth = document.getElementById('statistic__month')
const elementId = document.querySelector('.navigation')
Utils.getHeader()

function resetInput() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    inputStatisticByDate.value = `${year}-${month}-${day}`
}
resetInput()

var dataListGlobal
var revenueYear

function showLoading(option) {
    if (option) {
        document.querySelector('.loading__icon').style.display = 'flex'
        return
    }
    document.querySelector('.loading__icon').style.display = 'none'
} 

async function getRevenueByDate() {
    showLoading(true)
    try {   
        const data = await Api.getData('analysis/get-revenue')
        showLoading(false)
        if (data) {
            dataListGlobal = data.dataAnalysis    
            dataListGlobal.sort((a, b) => parseDate(b.date) - parseDate(a.date));
            
            if (data.dataAnalysis.filter(item => item.date === Utils.formatDateTime(inputStatisticByDate.value.trim(), true)).length === 0) {
                return
            }
            showRevenueByDate(data.dataAnalysis.filter(item => item.date === Utils.formatDateTime(inputStatisticByDate.value.trim(), true)))
            renderPercent(data.dataAnalysis.sort((a, b) => parseDate(b.date) - parseDate(a.date)), inputStatisticByDate.value)
        }
        
    } catch (error) {
        console.log("Error: ", error)
    }
}
getRevenueByDate()

function parseDate(dateString) {
    const [day, month, year] = dateString.split('/').map(Number)
    return new Date(year, month - 1, day)
}

function reutrnHtml(index, percent) {
    const percentArr = [
        `
            <span class="material-symbols-outlined increase">
                arrow_warm_up
            </span>
            <h3 id="increase__result">${percent}%</h3>
            <h3>ngày trước</h3>
        `,
        `
            <span class="material-symbols-outlined compare">
                compare_arrows
            </span>
            <h3 id="equal__result" class="compare">bằng</h3>
            <h3>ngày trước</h3>
        `,
        `
            <span class="material-symbols-outlined decrease">
                arrow_cool_down
            </span>
            <h3 id="decrease__result" class="decrease">${percent}%</h3>
            <h3>ngày trước</h3>
        `
    ]
    return percentArr[index]
}

const revenuePercent = document.getElementById('revenue')
const orderPercent = document.getElementById("order")
const productPercent = document.getElementById("product")
const sucessOrderPercent = document.getElementById("success_order")

function renderPercent(dataList, dateToCompare) {
    for (let i = 0; i < dataList.length; i++) {
        let j = i + 1
        if (dataList[i].date === Utils.formatDateTime(new Date(dateToCompare), true)) {
            if (i == dataList.length - 1) {
                console.log(i,j,dataList.length)
                revenuePercent.innerHTML = ``
                orderPercent.innerHTML = ``
                productPercent.innerHTML = ``
                sucessOrderPercent.innerHTML = ``
                Utils.showToast("Không tìm thấy dữ liệu ngày trước đó!", 'warning')
                return
            }
            console.log(dataList ,dataList[i], dataList[j])
            if(dataList[i].total_price > dataList[j].total_price) {
                revenuePercent.innerHTML = reutrnHtml(0, returnPercent(dataList[i].total_price, dataList[j].total_price))
            } else if (dataList[i].total_price < dataList[j].total_price) {
                revenuePercent.innerHTML = reutrnHtml(2, returnPercent(dataList[i].total_price, dataList[j].total_price))
            } else {
                revenuePercent.innerHTML = reutrnHtml(1, returnPercent(dataList[i].total_price, dataList[j].total_price))
            }
    
            if(dataList[i].order_count > dataList[j].order_count) {
                orderPercent.innerHTML = reutrnHtml(0, returnPercent(dataList[i].order_count, dataList[j].order_count))
            } else if (dataList[i].order_count < dataList[j].order_count) {
                orderPercent.innerHTML = reutrnHtml(2, returnPercent(dataList[i].order_count, dataList[j].order_count))
            } else {
                orderPercent.innerHTML = reutrnHtml(1, returnPercent(dataList[i].order_count, dataList[j].order_count))
            }
    
            if(dataList[i].total_quantity > dataList[j].total_quantity) {
                productPercent.innerHTML = reutrnHtml(0, returnPercent(dataList[i].total_quantity, dataList[j].total_quantity))
            } else if (dataList[i].total_quantity < dataList[j].total_quantity) {
                productPercent.innerHTML = reutrnHtml(2, returnPercent(dataList[i].total_quantity, dataList[j].total_quantity))
            } else {
                productPercent.innerHTML = reutrnHtml(1, returnPercent(dataList[i].total_quantity, dataList[j].total_quantity))
            }
    
            if(dataList[i].delivered_order_count > dataList[j].delivered_order_count) {
                sucessOrderPercent.innerHTML = reutrnHtml(0, returnPercent(dataList[i].delivered_order_count, dataList[j].delivered_order_count))
            } else if (dataList[i].delivered_order_count < dataList[j].delivered_order_count) {
                sucessOrderPercent.innerHTML = reutrnHtml(2, returnPercent(dataList[i].delivered_order_count, dataList[j].delivered_order_count))
            } else {
                sucessOrderPercent.innerHTML = reutrnHtml(1, returnPercent(dataList[i].delivered_order_count, dataList[j].delivered_order_count))
            }
        }
    }
}

function returnPercent(a, b) {
    return Number(((a * 100)/(a + b)).toFixed(2))
}

function showRevenueByDate(data) {
    console.log(data)
    if (data.length === 0) {
        Utils.showToast('Không tìm thấy dữ liệu doanh thu ngày này', 'warning')
        return
    }
    revenue.textContent = Utils.formatNumber(data[0].total_price)
    totalNewOrder.textContent = data[0].order_count
    totalBoughtProduct.textContent = data[0].total_quantity
    ratioSuccessOrder.textContent = data[0].delivered_order_count
}

viewStatisticByDate.addEventListener('click', () => {
    const inputDate = new Date(inputStatisticByDate.value)
    if (inputStatisticByDate.value.trim() === '') {
        Utils.showToast("Vui lòng nhập ngày để xem thống kê", 'error')
    } else if (inputDate > new Date()) {
        Utils.showToast("Ngày không hợp lệ!", 'error')
    } else {
        renderPercent(dataListGlobal, inputStatisticByDate.value)
        showRevenueByDate(dataListGlobal.filter(item => item.date === Utils.formatDateTime(inputStatisticByDate.value, true)))
    }
})

getRevenueDetail()

inputYear.value = parseInt(new Date().getFullYear())

async function getRevenueDetail() {
    showLoading(true)
    try {
        const data = await Api.getData('analysis/get-revenue-detail')
        showLoading(false)
        if (data && data.dataAnalysis.length != 0) {
            revenueYear = data.dataAnalysis
            renderRenvenue(data.dataAnalysis)
            prepareDataToShowChartMonth(data.dataAnalysis)
            console.log("Get: ", data.dataAnalysis)
        }
    } catch (error) {
        console.log("Error: ", error)
    }
}

function renderRenvenue(data) {
    const renvenueByYearArr = [0,0,0,0,0,0,0,0,0,0,0,0]
    let check = false
    data.forEach(item => {
        if (item.year === inputYear.value.trim()) {
            check = true
            const monthList = item.revenue_by_month
            monthList.forEach(i => {
                renvenueByYearArr[parseInt(i.month) - 1] = i.total_price
            })
            showToChartYear(renvenueByYearArr)
        } else {
            check = false
        }    
    });
    if (!check) {
        Utils.showToast('Không tìm thấy dữ liệu năm này', 'warning')
        showToChartYear(renvenueByYearArr)
        return
    }
}
 
inputMonth.value = getCurrentMonth()

viewStatisticByYear.addEventListener('click', () => {
    if (inputYear.value.trim() === '') {
        Utils.showToast("Vui lòng nhập năm để xem thống kê", 'error')
    } else if (inputYear.value.trim() > new Date().getFullYear().toString()) {
        Utils.showToast("Năm không hợp lệ!", 'error')
    } else {
        console.log(inputYear.value)
        renderRenvenue(revenueYear)
    }
})

const numberDateOfMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

function prepareDataToShowChartMonth(inputArr) {
    let check
    const [year, month] = inputMonth.value.split('-')
    let monthArr = []
    let dateArr = []
    console.log(year, month, inputArr)
    inputArr.forEach(item => {
        if (item.year === year) {
            check = true
            monthArr = item.revenue_by_month
        } else {
            check = false
        }
    })
    monthArr.forEach(item => {
        if(item.month === month) {
            check = true
            dateArr = item.revenue_by_date
        } else {
            check = false
        }
    })
    let dateList = Array(numberDateOfMonth[month - 1]).fill(0)
    let renderDate = []
    let monthLength = numberDateOfMonth[month - 1]
    if (isLeapYear(parseInt(year)) && parseInt(month) == 2) {
        monthLength += 1
    }
    for (let i = 1; i <= monthLength; i++) {
        renderDate.push(i)
    }    
    if (monthArr.length === 0 || dateArr.length === 0) {
        Utils.showToast('Không tìm thấy dữ liệu doanh thu tháng này', 'warning')
        showToChartMonth(dateList, renderDate)
        return
    }

    for (let i = 0; i < dateArr.length; i++) {
        if (dateArr[i] != 0) {
            dateList[parseInt(dateArr[i].date) - 1] = dateArr[i].total_price
        }
    }

    console.log('month: ',monthArr,'Date: ', dateArr, 'List: ', dateList)
    showToChartMonth(dateList, renderDate)
}

viewStatisticByMonth.addEventListener('click', () => {
    const [year, month] = inputMonth.value.split('-');
    if (inputMonth.value.trim() === '') {
        Utils.showToast("Vui lòng nhập tháng để xem thống kê", 'error')
    } else if (month > (new Date().getMonth()+1).toString()) {
        Utils.showToast("Tháng không hợp lệ!", 'error')
        console.log(month, (new Date().getMonth()+1))
    } else {
        prepareDataToShowChartMonth(revenueYear)
    }
})

const inputMonthMarketShare = document.getElementById('input__month__market__share')
const viewPercentCategoryMonth = document.getElementById('percent__category__month')

let myChartByYear
function showToChartYear(dataArr) {
    if (myChartByYear) {
        myChartByYear.destroy()
    }   
    myChartByYear = new Chart(chartByYear, {
        type: 'line',
        data: {
          labels: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
          datasets: [{
            label: 'Số doanh thu',
            data: dataArr,
            borderWidth: 1,
            borderColor: '#ff6384',
            backgroundColor: 'rgba(255, 99, 132, 0.3)',
            tension: 0.2 
          }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Tháng',
                        color: '#393939',
                        font: {
                            size: 12
                        }
                    },
                    grid: {
                    display: false 
                    },
                    ticks: {
                        autoSkip: false, 
                        maxRotation: 0, 
                        minRotation: 0
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Doanh thu (triệu đồng)', 
                        color: '#393939',
                        font: {
                            size: 12
                        }
                    },
                    grid: {
                    display: false 
                    },
                    ticks: {
                        callback: function(value, index, ticks) {
                        // Xử lý các trường hợp đặc biệt
                        if (value === null || value === undefined) {
                            return '';
                        }
                        
                        // Kiểm tra và chuyển đổi giá trị số
                        const numValue = Number(value);
                        
                        if (numValue === 0) {
                            return '0';
                        }
                        
                        // Thu gọn giá trị lớn
                        return numValue >= 1000 
                            ? (numValue / 1000000)
                            : numValue.toString();
                        }
                    }
                }
            }
        }
    });
}

let myChartByMonth

function showToChartMonth(dataArr, monthArr) {
    if (myChartByMonth) {
        myChartByMonth.destroy()
    } 
    myChartByMonth = new Chart(chartByMonth, {
        type: 'line',
        data: {
            labels: monthArr,
            datasets: [{
            label: 'Số doanh thu',
            data: dataArr,
            borderWidth: 1,
            borderColor: '#FFA62F',
            backgroundColor: 'rgba(255, 211, 153, 0.3)',
            tension: 0.2 
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Ngày',
                        color: '#393939',
                        font: {
                            size: 12
                        }
                    },
                    grid: {
                    display: false 
                    },
                    ticks: {
                        autoSkip: false, 
                        maxRotation: 0,
                        minRotation: 0
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Doanh thu (triệu đồng)', 
                        color: '#393939',
                        font: {
                            size: 12
                        }
                    },
                    grid: {
                    display: false 
                    },
                    ticks: {
                        callback: function(value, index, ticks) {
                        // Xử lý các trường hợp đặc biệt
                        if (value === null || value === undefined) {
                            return '';
                        }
                        
                        // Kiểm tra và chuyển đổi giá trị số
                        const numValue = Number(value);
                        
                        if (numValue === 0) {
                            return '0';
                        }
                        
                        // Thu gọn giá trị lớn
                        return numValue >= 1000 
                            ? (numValue / 1000000)
                            : numValue.toString();
                        }
                    }
                }
            }
        }
    });
}



var listCategory = [1,2,3,4,5]

async function getMarketShare(time) {
    Utils.showLoading(true)
    try {
        const data = await Api.postData('analysis/get-category-sold-quantity', time)
        Utils.showLoading(false)
        if(data && data.dataAnalysis.length != 0) {
            if (data.dataAnalysis.length === 0) {
                return
            }
            getData(data.dataAnalysis)
        }
    } catch (error) {
        console.log('Error: ', error)
    }
}

inputMonthMarketShare.value = getCurrentMonth()
prepareDataToShowDoughnutChart()
function prepareDataToShowDoughnutChart() {
    const [year, month] = inputMonthMarketShare.value.split('-');
    const time = {
        month : month,
        year : year
    }
    getMarketShare(time)
}

viewPercentCategoryMonth.addEventListener('click', () => {
    const [year, month] = inputMonthMarketShare.value.split('-');
    if (inputMonthMarketShare.value.trim() === '') {
        Utils.showToast("Vui lòng nhập tháng để xem thống kê", 'error')
    } else if (month > (new Date().getMonth()+1).toString()) {
        Utils.showToast("Tháng không hợp lệ!", 'error')
        console.log(month, (new Date().getMonth()+1))
    } else {
        categoryList.length = 0
        marketShare.length = 0
        prepareDataToShowDoughnutChart()
        viewPercentCategoryMonth.disabled = true
        setTimeout(() => {
            viewPercentCategoryMonth.disabled = false
            console.log("Disabled")
        }, 500);
    }
})

let categoryList = []
let marketShare = []

function getData(data) {
    if(data.length === 0) {
        categoryList.length = 0
        marketShare.length = 0
        inputMonthMarketShare.value = getCurrentMonth()
        prepareDataToShowDoughnutChart()
        createDoughoutChart(categoryList, marketShare)
        Utils.showToast("Không tìm thấy dữ liệu!", 'warning')
        return
    }
    data.forEach(item => {
        categoryList.push(item.category_name)
        marketShare.push(item.total_sold)
    })
    createDoughoutChart(categoryList, marketShare)
}

function getCurrentMonth() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    return `${year}-${month}`
}

let MyDoughnutChart
function createDoughoutChart(category, data) {
    if (MyDoughnutChart) {
        MyDoughnutChart.destroy()
    } 
    MyDoughnutChart = new Chart(doughnutChart, {
        type: 'doughnut',
        data: {
            labels: category,
            datasets: [{
                label: "Thị phần bán ra",
                data: data,
                backgroundColor: generateUniquePastelColors(category.length),
                tension: 0.0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, 
        }
    });
}


function generateUniquePastelColors(count) {
    const colors = [];
    const usedColors = new Set();

    while (colors.length < count) {
        const r = Math.floor(Math.random() * 128 + 127);
        const g = Math.floor(Math.random() * 128 + 127);
        const b = Math.floor(Math.random() * 128 + 127);

        const color = `rgb(${r}, ${g}, ${b})`;
    
        if (!usedColors.has(color)) {
            colors.push(color);
            usedColors.add(color);
        }
    }

    return colors;
}

async function getProductBestSeller() {
    Utils.showLoading(true)
    try {
        const data = await Api.getData('product/get-hot-products')
        Utils.showLoading(false)
        if(data && data.productDTOList.length != 0) {
            renderProductBestSeller(data.productDTOList)
        }
    } catch (error) {
        console.log('Error: ', error)
    }
}

getProductBestSeller()

function renderProductBestSeller(data) {
    const topProductOutside = document.querySelector('.top__product__detail__outside')
    let htmls = []
    data.forEach((item, index) => {
        htmls.push(`
            <div class="top__product__detail__wrapper">
                <div class="order__number__wrapper">
                    <h2 class="order__number">${index + 1 < 10 ? '0' + (index + 1) : (index + 1)}</h2>
                </div>
                <div class="content__wrapper">
                    <img src=${Utils.renderImage(item.image)} class="product__image" alt="Product Image">
                    <h3 class="product__name">${item.name}</h3>
                    <h3>${Utils.formatNumber(item.sold)} lượt bán</h3>                                
                </div>
            </div>
        `)
    })
    topProductOutside.innerHTML = htmls.join('')
}


