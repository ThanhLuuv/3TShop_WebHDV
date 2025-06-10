import Utils from "../../js/admin/Utils.js";
const manageItems = document.querySelectorAll('.manage__items')
console.log(manageItems)

let currentPath = ''
manageItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault()
        if (window.location.pathname === (e.currentTarget.getAttribute('href'))) {
            return
        }
        manageItems.forEach(i => i.classList.remove('active'))
        e.currentTarget.classList.add('active')
        window.location.pathname = e.currentTarget.getAttribute('href')
    })

    item.addEventListener('mousedown', () => {
        item.classList.add('clicked')
    })
    item.addEventListener('mouseup', () => {
        item.classList.remove('clicked')
    })
})

const background = document.querySelector('.confirm__order__background')
document.querySelector('.logout__wrapper').addEventListener('click', (e) => {
    console.log("Click logout")
    e.preventDefault()
    Utils.showModalConfirm(
        'XÁC NHẬN ĐĂNG XUẤT',
        `Bạn có chắc chắn muốn <br> đăng xuất khỏi hệ thống ?`,
        '../../img/utils/quit_admin.png',
        background
    )
    Utils.hiddenModalConfirm(background)
    document.querySelector('#confirm__order__btn').addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = '/login'
        Utils.hiddenModalConfirm(background, true)
    })
})



