export default class Utils {

    static async includeNavigation(elementId) {
        fetch('/navigation')
            .then(response => response.text())
            .then(data => {
                elementId.innerHTML = data;
    
                const manageItems = document.querySelectorAll('.manage__items')
                manageItems.forEach(item => {
                    item.addEventListener('click', () => {
                        console.log("Click")
                        manageItems.forEach(i => i.classList.remove('active'))
                        item.classList.add('active')
                    })
    
                    item.addEventListener('mousedown', () => {
                        item.classList.add('clicked')
                    })
                    item.addEventListener('mouseup', () => {
                        item.classList.add('clicked')
                    })
                })
            })
            .catch(error => console.error('Lỗi khi tải file:', error));
    }

    static getHeader() {
        const html = `
            <div class="navigation__bar">
                <div id="logo__wrapper">
                    <img id="logo__shop" src="../../img/utils/LOGO_3TSHOP_ADMIN.png" alt="logo" />
                </div>
                <div id="function__bar">
                    <a href="/admin/dashboard" class="manage__items path__name">
                        <div class="wrapper__item">
                            <span class="material-symbols-outlined" style="font-size: 20px;">
                                chart_data
                            </span>
                            <h5>Thống kê</h5>
                        </div>
                    </a>

                    <a href="/admin/manage-product" class="manage__items path__name">
                        <div class="wrapper__item">
                            <span class="material-symbols-outlined" style="font-size: 20px;">
                                category
                            </span>
                            <h5>Sản phẩm</h5>
                        </div>
                    </a>

                    <a href="/admin/manage-order" class="manage__items path__name">
                        <div class="wrapper__item">
                            <span class="material-symbols-outlined" style="font-size: 20px;">
                                    inventory_2
                                </span>
                            <h5>Đơn hàng</h5>
                        </div>
                    </a>
                    
                </div>
                <a href="#" class="logout__wrapper">
                    <div class="wrapper__item">
                        <span class="material-symbols-outlined">
                            logout
                        </span>
                        <h5>Đăng xuất</h5>
                    </div>
                </a>
                <div class="confirm__order__background"></div>
            </div>
        `
        document.body.insertAdjacentHTML('afterbegin', html) 
        const currentPage = window.location.pathname
        const aTag = document.querySelectorAll('.path__name')
        aTag.forEach(item => {
            if (currentPage.includes(item.getAttribute('href'))) {
                item.classList.add('active');
            }
        })
    }

    static showToast(message, type) {
        const toastContainer = document.getElementById('toast-container');

        if (message) {
            const toastElement = document.createElement('div');
            toastElement.classList.add('toast-message');

            const toastIcon = document.createElement('span');
            toastIcon.style.color = '#ffffff'
            toastIcon.classList.add('material-symbols-outlined', 'toast__icon')
            toastIcon.textContent = type
        
            const toastText = document.createElement('p');
            toastText.textContent = message;
        
            const toastCloseButton = document.createElement('button');
            toastCloseButton.classList.add('toast-close');
            toastCloseButton.innerHTML = `
            <span class="material-symbols-outlined close__toast">
                close
            </span>`;
        
            toastCloseButton.addEventListener('click', () => {
            toastElement.style.animationName = 'fadeOut';
            setTimeout(() => {
                toastContainer.removeChild(toastElement);
                }, 200);
            });
        
            toastElement.appendChild(toastIcon);
            toastElement.appendChild(toastText);
            toastElement.appendChild(toastCloseButton);
            toastContainer.appendChild(toastElement);
        
            setTimeout(() => {
                toastElement.style.animationName = 'fadeOut';
                setTimeout(() => {
                    toastContainer.removeChild(toastElement);
                }, 300);
            }, 4000);
        }
    }

    static showModalConfirm(title, content, imagePath, modalName) {
        modalName.innerHTML = `
            <div class="confirm__order__wrapper confirm__order__animation">
                <div class="icon__close close__modal__confirm">
                    <span class="material-symbols-outlined">
                        close
                        </span>
                </div>
                <div class="body__modal">
                    <img src=${imagePath} alt="Confirm order" class="confirm__order">
                    <div class="title__wrapper">
                        <h2 id="title__confirm__modal">${title}</h2>
                    </div>
                    <h3 class="content" id="content__confirm__modal">${content}</h3>
                    <div class="button__wrapper">
                        <button type="button" id="hidden__confirm__order__btn">Hủy</button>
                        <button type="button" id="confirm__order__btn">Xác nhận</button>
                    </div>
                </div>
            </div>
            `
            const wrapper = document.querySelector('.confirm__order__wrapper')
            const confirmModalBtn = document.getElementById('confirm__order__btn')
            
            confirmModalBtn.addEventListener('click', () => {
                    return true
                }
            )
        // if (btn) {
            // btn.addEventListener('click', () => {
                modalName.style.display = 'flex'
                setTimeout(() => {
                    wrapper.classList.add('active')
                }, 10);
                return
            // })
        // } 
        // else {
        //     console.log("Modal was shown without button")
        //     modalName.style.display = 'flex'
        //     setTimeout(() => {
        //         wrapper.classList.add('active')
        //     }, 10);
        // }
    }  

    static showModalCancel(modalName) {
        modalName.innerHTML = `
            <div class="cancel__order__wrapper cancel__order__animation">
                <div class="icon__close close__modal__cancel">
                    <span class="material-symbols-outlined">
                        close
                        </span>
                </div>
                <div class="body__modal">
                    <img src="../../img/utils/confirm__order.png" alt="Confirm order" class="confirm__order">
                    <div class="title__wrapper">
                        <h2 id="title__cancel__modal">XÁC NHẬN HỦY ĐƠN</h2>
                    </div>
                    <div class="content__wrapper">
                        <label for="input__cancel__reason">Vui lòng cho biết lý do hủy đơn</label>
                        <textarea type="text" id="input__cancel__reason"></textarea>
                        <h3 id="validate__input__reason">Vui lòng nhập lý do hủy đơn</h3>
                    </div>
                    <div class="button__wrapper">
                        <button type="button" id="hidden__cancel__order__btn">Hủy</button>
                        <button type="button" id="cancel__order__btn">Xác nhận</button>
                    </div>
                </div>
            </div>
        `
        const wrapper = document.querySelector('.cancel__order__wrapper')
        // if (btn) {
            // btn.addEventListener('click', () => {
                modalName.style.display = 'flex'
                setTimeout(() => {
                    wrapper.classList.add('active')
                }, 10);
                return
        //     })
        // } else {
        //     console.log("Modal was shown without button")
        //     modalName.style.display = 'flex'
        //     setTimeout(() => {
        //         wrapper.classList.add('active')
        //     }, 10);
        // }
    }  

    static hiddenModalConfirm(background, option = null) {
        const modalName = document.querySelector('.confirm__order__background')
        const wrapper = document.querySelector('.confirm__order__wrapper')
        const btn = document.querySelector('#hidden__confirm__order__btn')
        const closeModalConfirm = document.querySelector('.close__modal__confirm')
        if (option) {
            wrapper.classList.add('disabled')
            setTimeout(() => {
                wrapper.classList.remove('active', 'disabled')
                background.style.display = 'none'
            }, 50);
        }
        // if (btn) {
            btn.addEventListener('click', (e) => {
                wrapper.classList.add('disabled')
                console.log(modalName, btn, wrapper)
                setTimeout(() => {
                    modalName.style.display = 'none'
                    wrapper.classList.remove('active', 'disabled')
                }, 100);
                return
            })

            closeModalConfirm.addEventListener('click', (e) => {
                wrapper.classList.add('disabled')
                console.log(modalName, btn, wrapper)
                setTimeout(() => {
                    modalName.style.display = 'none'
                    wrapper.classList.remove('active', 'disabled')
                }, 100);
                return
            })
        // } 
        modalName.addEventListener('click', (e) => {
            if(e.target === modalName) {
                wrapper.classList.add('disabled')
                setTimeout(() => {
                    wrapper.classList.remove('active', 'disabled')
                    modalName.style.display = 'none'
                }, 100);
            }
            return
        })

        
    }

    static hiddenModalCancel(modalName, option = null) {
        const wrapper = document.querySelector('.cancel__order__wrapper')
        const btn = document.querySelector('#hidden__cancel__order__btn')
        const closeModalCancel = document.querySelector('.close__modal__cancel')
        if (option) {
            wrapper.classList.add('disabled')
            setTimeout(() => {
                wrapper.classList.remove('active', 'disabled')
                modalName.style.display = 'none'
            }, 100);
            return
        }
        // if (btn) {
            btn.addEventListener('click', (e) => {
                wrapper.classList.add('disabled')
                console.log(modalName, btn, wrapper)
                setTimeout(() => {
                    modalName.style.display = 'none'
                    wrapper.classList.remove('active', 'disabled')
                }, 300);
                return
            })

            closeModalCancel.addEventListener('click', (e) => {
                wrapper.classList.add('disabled')
                console.log(modalName, btn, wrapper)
                setTimeout(() => {
                    modalName.style.display = 'none'
                    wrapper.classList.remove('active', 'disabled')
                }, 300);
                return
            })
        // } 
        modalName.addEventListener('click', (e) => {
            if(e.target === modalName) {
                wrapper.classList.add('disabled')
                setTimeout(() => {
                    wrapper.classList.remove('active', 'disabled')
                    modalName.style.display = 'none'
                }, 300);
            }
        })
        
    }

    static flexibleConfirmModalContent(title, content, handleFunc, modalName, btn) {
        Utils.showModalConfirm(modalName, btn)
        const showTitle = document.getElementById('title__confirm__modal')
        const showContent = document.getElementById('content__confirm__modal')
        const handle = document.getElementById('confirm__order__btn')
    
        showTitle.textContent = title
        showContent.innerHTML = content
        handle.addEventListener('click', handleFunc)
    }

    static formatDateTime(dateInput, option = null) {
        const converted = new Date(dateInput);
        let options
        if (option) {
            options = {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            };
        } else {
            options = {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            };
        }
        return converted.toLocaleString('vi-VN', options);
    }

    static formatDateTimeToFilter(dateInput, option) {
        const converted = new Date(dateInput);
        if(option) {
            converted.setHours(23,59,59,999)
        } else {
            converted.setHours(0,0,0,0)
        }
        const options = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        }
        return converted
    }

    static predictDeliveryDate(dateInput, option = null) {
        const converted = new Date(dateInput);
        if(option) {
            converted.setDate(converted.getDate() + 1)
            converted.setHours(0,0,0,0)
            return converted
        } else {
            converted.setDate(converted.getDate() + 5)
        }
        const options = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        };
        
        return converted.toLocaleString('vi-VN', options);
    }

    static formatCurrency(amount) {
        return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
    }

    static formatNumber(amount) {
        return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    static hasSpecialCharacters(text) {
        const specialChars = /[#$^_\\[\]{}\\<>~]/;
        return specialChars.test(text);
    }

    static renderImage(base64String) {
        const mimeType = "image/jpeg";
        return `
            data:${mimeType};base64,${base64String}
        `
    }

    static protectAdmin = () => {
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

            if (role !== "[ADMIN]") {
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

    static showLoading(option) {
        if (option) {
            document.querySelector('.loading__icon').style.display = 'flex'
            return
        }
        document.querySelector('.loading__icon').style.display = 'none'
    } 
}