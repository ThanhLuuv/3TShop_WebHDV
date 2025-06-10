
import Api from "../Api.js";
import Utils from "../Utils.js";

const container = document.querySelector('.personal-infor-container')

container.insertAdjacentHTML("beforeend", Utils.getFooter())

Utils.getHeader()
// Utils.protectUser()
const inputsInforForm = document.querySelectorAll("#personal-infor-form input");
const editBtnInforForm = document.querySelector("#personal-infor-form .edit");
const cancelBtnInforForm = document.querySelector("#personal-infor-form .cancel-edit");
const submitBtnInforForm = document.querySelector("#personal-infor-form .save");
const name = document.querySelector('input[name="name"]');
const phone = document.querySelector('input[name="sdt"]');
const birthday = document.querySelector('input[name="birthday"]');
const genderMale = document.querySelector('input[name="gender"][value="male"]');
const genderFemale = document.querySelector('input[name="gender"][value="female"]');
const email = document.querySelector('input[name="email"]');
const editAddressContainer = document.querySelector("#modal-edit-address")

name.addEventListener("input",()=>{
    name.nextElementSibling.style.opacity = 0
})
phone.addEventListener("input",()=>{
    phone.nextElementSibling.style.opacity = 0
})
birthday.addEventListener("input",()=>{
    birthday.nextElementSibling.style.opacity = 0
})
genderFemale.addEventListener("click",()=>{
    document.querySelector('.gender-radio').nextElementSibling.style.opacity = 0;
})
genderMale.addEventListener("click",()=>{
    document.querySelector('.gender-radio').nextElementSibling.style.opacity = 0;
})
email.addEventListener("input",()=>{
    email.nextElementSibling.style.opacity = 0
})

function validateForm() {
    let isValid = true;

    if (!name.value.trim()) {
        name.nextElementSibling.style.opacity = 1; 
        isValid = false;
    }

    if (!phone.value.trim()) {
        phone.nextElementSibling.textContent = "Vui lòng nhập số điện thoại!";
        phone.nextElementSibling.style.opacity = 1;  
        isValid = false;
    } else {
        const phoneValue = phone.value.trim();
        if (phoneValue.length !== 10 || !phoneValue.startsWith("0")) {
            phone.nextElementSibling.textContent = "Số điện thoại không hợp lệ!";
            phone.nextElementSibling.style.opacity = 1;  
            isValid = false;
        }
    }    

    if (!birthday.value.trim()) {
        birthday.nextElementSibling.textContent = "Vui lòng nhập ngày sinh!"
        birthday.nextElementSibling.style.opacity = 1; 
        isValid = false;
    }
    const currentDate = new Date()
    const birthdayValue = new Date(birthday.value)
    if (birthdayValue >= currentDate) {
        birthday.nextElementSibling.textContent = "Ngày sinh không hợp lệ!"
        birthday.nextElementSibling.style.opacity = 1; 
        isValid = false;
    }

    if (!genderMale.checked && !genderFemale.checked) {
        document.querySelector('.gender-radio').nextElementSibling.style.opacity = 1;
        isValid = false;
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email.value.trim() || !emailRegex.test(email.value)) {
        email.nextElementSibling.style.opacity = 1;
        isValid = false;
    }

    if (!emailRegex.test(email.value)) {
        email.nextElementSibling.textContent = "Email không hợp lệ!"
        email.nextElementSibling.style.opacity = 1;
        isValid = false;
    }

    return isValid;
}

editBtnInforForm.addEventListener('click', (e) => {
    e.preventDefault();
    cancelBtnInforForm.style.display = "block";
    editBtnInforForm.style.display = "none";
    inputsInforForm.forEach((i) => {
        i.readOnly = false;
    });
    genderFemale.disabled = false
    genderMale.disabled = false
    submitBtnInforForm.disabled = false;
});

let initialValues = {};

cancelBtnInforForm.addEventListener("click", (e) => {
    e.preventDefault();
    cancelBtnInforForm.style.display = "none";
    editBtnInforForm.style.display = "block";
    inputsInforForm.forEach((i) => {
        i.readOnly = true;
    });
    genderFemale.disabled = true
    genderMale.disabled = true

    name.value = initialValues.f_name + " " + initialValues.l_name; 
    phone.value = initialValues.phone;  
    birthday.value = initialValues.date_of_birth;
    email.value = initialValues.accountDTO.email;
    if(initialValues.gender){
        genderMale.checked = true
    }else{
        genderFemale.checked = true
    }
    submitBtnInforForm.disabled = true
});

async function editInformationUser(data) {
    try {
        console.log(data)
        const response = await Api.editInforUser(data)
        if(response.status === 200){
            Utils.getToast("success","Cập nhật thông tin thành công!")
            inputsInforForm.forEach((i) => {
                i.readOnly = true;
            });
            cancelBtnInforForm.style.display = "none";
            editBtnInforForm.style.display = "block";
            submitBtnInforForm.disabled = true
        }
    } catch (error) {
        console.log('Lỗi nè: ',error)
        if(error.status === 408){
            console.log(errorPhone)
            phone.nextElementSibling.style.opacity = 1
            phone.nextElementSibling.textContent = "Số điện thoại đã tồn tại!"
        }else{
            if(error.status === 409){
                email.nextElementSibling.style.opacity = 1
                email.nextElementSibling.textContent = "Email đã tồn tại!"
            }else{
                Utils.getToast("error","Máy chủ lỗi, vui lòng thử lại sau!")
            }
        }
    }
}

submitBtnInforForm.addEventListener("click", (e) => {
    e.preventDefault();
    if (validateForm()) {
        const fName = name.value.trim().split(" ")[0];
        const lName = name.value.trim().split(" ").slice(1).join(" ");
        const phoneValue = phone.value.trim();
        const birthdayValue = birthday.value;
        const genderValue = genderMale.checked ? true : (genderFemale.checked ? false : null);
        const emailValue = email.value.trim();

        const data = {
            f_name: fName,
            l_name: lName,
            gender: genderValue,
            phone: phoneValue,
            email: emailValue,
            date_of_birth: birthdayValue,
        };

        console.log("Dữ liệu gửi đi:", data);
        editInformationUser(data)
        genderFemale.disabled = true
        genderMale.disabled = true
    } 
});

const submitNewAddressBtn = document.querySelector("#modal-add-address .submit")
const submitEditAddressBtn = document.querySelector("#modal-edit-address .submit")
const fullName = document.querySelector("#modal-add-address .full-name")
const phoneNumber = document.querySelector("#modal-add-address .phone")
const province = document.querySelector("#modal-add-address .province")
const district = document.querySelector("#modal-add-address .district")
const ward = document.querySelector("#modal-add-address .ward")
const village = document.querySelector("#modal-add-address .village")
const detailed = document.querySelector("#modal-add-address .detailed")

const errorFullname = document.querySelector("#modal-add-address .error-fullname")
const errorPhone = document.querySelector("#modal-add-address .error-phone")
const errorProvince = document.querySelector("#modal-add-address .error-province")
const errorDictrict = document.querySelector("#modal-add-address .error-district")
const errorWard = document.querySelector("#modal-add-address .error-ward")
const errorVillage = document.querySelector("#modal-add-address .error-village")
const errorDetail = document.querySelector("#modal-add-address .error-detailed")

const fullNameEdit = document.querySelector("#modal-edit-address .full-name")
const phoneNumberEdit = document.querySelector("#modal-edit-address .phone")
const provinceEdit = document.querySelector("#modal-edit-address .province")
const districtEdit = document.querySelector("#modal-edit-address .district")
const wardEdit = document.querySelector("#modal-edit-address .ward")
const villageEdit = document.querySelector("#modal-edit-address .village")
const detailedEdit = document.querySelector("#modal-edit-address .detailed")

const errorFullnameEdit = document.querySelector("#modal-edit-address .error-fullname")
const errorPhoneEdit = document.querySelector("#modal-edit-address .error-phone")
const errorProvinceEdit = document.querySelector("#modal-edit-address .error-province")
const errorDictrictEdit = document.querySelector("#modal-edit-address .error-district")
const errorWardEdit = document.querySelector("#modal-edit-address .error-ward")
const errorVillageEdit = document.querySelector("#modal-edit-address .error-village")
const errorDetailEdit = document.querySelector("#modal-edit-address .error-detailed")


submitNewAddressBtn.addEventListener("click", async ()=>{
    let isValid = true;
    if(fullName.value === ""){
        errorFullname.style.opacity = 1
        isValid = false
    }
    if(phoneNumber.value === ""){
        errorPhone.textContent = "Vui lòng nhập số điện thoại!"
        errorPhone.style.opacity = 1
        isValid = false
    }
    if (!phoneNumber.value.trim()) {
        errorPhone.textContent = "Vui lòng nhập số điện thoại!"
        errorPhone.style.opacity = 1
        isValid = false
    } else {
        const phoneValue = phoneNumber.value.trim();
        if (phoneValue.length !== 10 || !phoneValue.startsWith("0")) {
            errorPhone.textContent = "Vui lòng nhập số điện thoại!"
            errorPhone.style.opacity = 1
            isValid = false
        }
    }
    
    if(province.value === ""){
        errorProvince.style.opacity = 1
        isValid = false
    }
    if(district.value === ""){
        errorDictrict.style.opacity = 1
        isValid = false
    }
    if(ward.value === ""){
        errorWard.style.opacity = 1
        isValid = false
    }
    if(village.value === ""){
        errorVillage.style.opacity = 1
        isValid = false
    }
    if(detailed.value === ""){
        errorDetail.style.opacity = 1
        isValid = false
    }
    if(isValid){
        const newAddress = {
            name: fullName.value,
            phone: phoneNumber.value,
            address_line_1: province.value,
            address_line_2: detailed.value + ", " + village.value + ", " + ward.value + ", " + district.value,
        };
        try {
            const response = await Api.createNewDelevery(newAddress)
            console.log(response.status)
            if(response.status === 200){
                const model = document.querySelector("#modal-add-address")
                Utils.closeModal(model)
                Utils.getToast("success"," Tạo địa chỉ thành công!")
                setTimeout(function() {
                    location.reload(); 
                }, 1000); 
            }else{
                const model = document.querySelector("#modal-add-address")
                Utils.closeModal(model)
                Utils.getToast("error","Có lỗi vui lòng thử lại!")
            }
        } catch (error) {
            console.log(error)
            const model = document.querySelector("#modal-add-address")
            Utils.closeModal(model)
            Utils.getToast("error","Máy chủ lỗi, vui lòng thử lại!")
        }
    }
})

submitEditAddressBtn.addEventListener("click", async ()=>{
    let isValid = true;
    if(fullNameEdit.value === ""){
        errorFullnameEdit.style.opacity = 1
        isValid = false
    }
    if (!phoneNumberEdit.value.trim()) {
        phoneNumberEdit.nextElementSibling.textContent = "Vui lòng nhập số điện thoại!";
        phoneNumberEdit.nextElementSibling.style.opacity = 1;  
        isValid = false;
    } else {
        const phoneValue = phoneNumberEdit.value.trim();
        if (phoneValue.length !== 10 || !phoneValue.startsWith("0")) {
            phoneNumberEdit.nextElementSibling.textContent = "Số điện thoại không hợp lệ!";
            phoneNumberEdit.nextElementSibling.style.opacity = 1;  
            isValid = false;
        }
    }    
    if(provinceEdit.value === ""){
        errorProvinceEdit.style.opacity = 1
        isValid = false
    }
    if(districtEdit.value === ""){
        errorDictrictEdit.style.opacity = 1
        isValid = false
    }
    if(wardEdit.value === ""){
        errorWardEdit.style.opacity = 1
        isValid = false
    }
    if(villageEdit.value === ""){
        errorVillageEdit.style.opacity = 1
        isValid = false
    }
    if(detailedEdit.value === ""){
        errorDetailEdit.style.opacity = 1
        isValid = false
    }
    if(isValid){
        const addressId = editAddressContainer.dataset.id
        const newAddress = {
            de_infor_id: addressId,
            name: fullNameEdit.value,
            phone: phoneNumberEdit.value,
            address_line_1: provinceEdit.value,
            address_line_2: detailedEdit.value + ", " + villageEdit.value + ", " + wardEdit.value + ", " + districtEdit.value,
        };
        const model = document.querySelector("#modal-edit-address")
        try {
            const response = await Api.editDelevery(newAddress)
            if(response.status === 200){
                Utils.closeModal(model)
                Utils.getToast("success","Chỉnh sửa thông tin thành công!")
                setTimeout(function() {
                    location.reload(); 
                }, 2000); 
            }else{
                Utils.closeModal(model)
                Utils.getToast("error","Có lỗi vui lòng thử lại!")
            }
        } catch (error) {
            Utils.closeModal(model)
            Utils.getToast("error","Máy chủ lỗi, vui lòng thử lại!")
        }
    }
})

fullName.addEventListener("input",()=>{
    errorFullname.style.opacity = 0
})
phoneNumber.addEventListener("input",()=>{
    errorPhone.style.opacity = 0
})
province.addEventListener("input",()=>{
    errorProvince.style.opacity = 0
})
district.addEventListener("input",()=>{
    errorDictrict.style.opacity = 0
})
ward.addEventListener("input",()=>{
    errorWard.style.opacity = 0
})
village.addEventListener("input",()=>{
    errorVillage.style.opacity = 0
})
detailed.addEventListener("input",()=>{
    errorDetail.style.opacity = 0
})


const changePassModelContainer = document.querySelector("#modal-change-pass")
const openChangePassBtn = document.querySelector(".change-password")
const cancelChangePass = document.querySelector("#modal-change-pass .cancel")
const closeChangePass = document.querySelector("#modal-change-pass .close")

openChangePassBtn.addEventListener("click",(e)=>{
    e.preventDefault()
    console.log("open")
    Utils.openModal(changePassModelContainer)
})

cancelChangePass.addEventListener("click",()=>{
    Utils.closeModal(changePassModelContainer)
})

closeChangePass.addEventListener("click",()=>{
    Utils.closeModal(changePassModelContainer)
})

changePassModelContainer.addEventListener("click",(e)=>{
    if(e.target === changePassModelContainer){
        Utils.closeModal(changePassModelContainer)
    }
})

const currentPass = document.querySelector(".current-password")
const newPass = document.querySelector(".new-password")
const confirmPass = document.querySelector(".confirm-password")
const submitChangePass = document.querySelector("#modal-change-pass .submit")
const errorCurrentPass = document.querySelector(".error-current-pass")
const errorNewPass = document.querySelector(".error-new-pass")
const errorConfirmPass = document.querySelector(".error-confirm-pass")

submitChangePass.addEventListener("click", async () => {
    let isValid = true;

    // Kiểm tra mật khẩu hiện tại
    if (currentPass.value === "") {
        errorCurrentPass.textContent = "Vui lòng nhập trường này!";
        errorCurrentPass.style.opacity = 1;
        isValid = false;
    } else {
        errorCurrentPass.style.opacity = 0;
    }

    // Kiểm tra mật khẩu mới
    if (newPass.value === "") {
        errorNewPass.textContent = "Vui lòng nhập trường này!";
        errorNewPass.style.opacity = 1;
        isValid = false;
    } else if (newPass.value.length < 8) {
        errorNewPass.textContent = "Mật khẩu phải từ 8 kí tự!";
        errorNewPass.style.opacity = 1;
        isValid = false;
    } else {
        errorNewPass.style.opacity = 0;
    }

    // Kiểm tra xác nhận mật khẩu
    if (confirmPass.value === "") {
        errorConfirmPass.textContent = "Vui lòng nhập trường này!";
        errorConfirmPass.style.opacity = 1;
        isValid = false;
    } else if (newPass.value !== confirmPass.value) {
        errorConfirmPass.textContent = "Xác nhận mật khẩu không đúng!";
        errorConfirmPass.style.opacity = 1;
        isValid = false;
    } else {
        errorConfirmPass.style.opacity = 0;
    }

    // Gửi yêu cầu đổi mật khẩu nếu hợp lệ
    if (isValid) {
        const data = {
            currentPassword: currentPass.value,
            newPassword: newPass.value
        };

        try {
            const response = await Api.changePassword(data);
            if (response.status === 200) {
                Utils.closeModal(changePassModelContainer)
                Utils.getToast("success","Đổi mật khẩu thành công!")
            } else if (response.status === 202) {
                errorCurrentPass.textContent = "Mật khẩu cũ không đúng!";
                errorCurrentPass.style.opacity = 1;
            }
        } catch (error) {
            console.error("Lỗi:", error);
            Utils.closeModal(changePassModelContainer)
            Utils.getToast("error","Máy chủ lỗi, vui lòng thử lại!")
        }
    }
});


currentPass.addEventListener("input",()=>{
    errorCurrentPass.style.opacity = 0
})
newPass.addEventListener("input",()=>{
    errorNewPass.style.opacity = 0
})
confirmPass.addEventListener("input",()=>{
    errorConfirmPass.style.opacity = 0
})


const fillData = (data)=>{
    initialValues = data
    name.value = data.f_name + " " + data.l_name
    phone.value = data.phone
    birthday.value = data.date_of_birth
    email.value = data.accountDTO.email
    if(data.gender){
        genderMale.checked = true
    }else{
        genderFemale.checked = true
    }
}

function handleEdit(addressContainer) {
    const addressId = addressContainer?.dataset.id;
    editAddressContainer.setAttribute("data-id",addressId)
    const originalName = addressContainer.querySelector('.default-name, .address-content p:first-child').textContent;
    const originalPhone = addressContainer.querySelector('.default-phone-number, .address-content p:nth-child(2)').textContent;
    const originalAddressDetail = addressContainer.querySelector('.address-detail').textContent;
    const addressParts = originalAddressDetail.split(",")
    const detail_address = addressParts[0] || '';  
    const village = addressParts[1] || '';        
    const ward = addressParts[2] || '';           
    const district = addressParts[3] || '';      
    const province = addressParts[4] || '';      

    console.log({ detail_address,village, ward, district, province });

    Utils.openModal(editAddressContainer);

    editAddressContainer.querySelector('.full-name').value = originalName;
    editAddressContainer.querySelector('.phone').value = (originalPhone);
    editAddressContainer.querySelector('.province').value = province;
    editAddressContainer.querySelector('.district').value = district;
    editAddressContainer.querySelector('.ward').value = ward;
    editAddressContainer.querySelector('.village').value = village;
    editAddressContainer.querySelector('.detailed').value = detail_address;
    editAddressContainer.querySelector('.phone').addEventListener('input', function(event) {
        let value = event.target.value;
        value = value.replace(/[^0-9]/g, '');
        event.target.value = value;
    });
}

const confirmModal = document.getElementById('confirm');
const closeButton = confirmModal.querySelector('.close');
const cancelButton = confirmModal.querySelector('.cancel');
const submitButton = confirmModal.querySelector('.submit');

let addressIdToDelete = null;

function showConfirmModal(id) {
    addressIdToDelete = id;
    Utils.openModal(confirmModal)
}

function hideConfirmModal() {
    Utils.closeModal(confirmModal)
    addressIdToDelete = null;
}

confirmModal.addEventListener("click",(e)=>{
    hideConfirmModal()
})

async function handleDelete(id) {
    showConfirmModal(id);
}

closeButton.addEventListener('click', hideConfirmModal);
cancelButton.addEventListener('click', hideConfirmModal);

submitButton.addEventListener('click', async () => {
    if (addressIdToDelete) {
        try {
            const response = await Api.deleteAddress(addressIdToDelete);
            if (response.status === 200) {
                Utils.getToast("success", "Xóa địa chỉ thành công!");
                setTimeout(() => {
                    location.reload();
                }, 1000);
            } else {
                Utils.getToast("error", "Có lỗi, vui lòng thử lại!");
            }
        } catch (error) {
            Utils.getToast("error", "Máy chủ lỗi, vui lòng thử lại!");
        }
        hideConfirmModal();
    }
});

async function setDefaultAddress(id) {
    try {
        const response = await Api.setDefaultAddress(id)
        console.log(response.status)
        if(response.status === 200){
            Utils.getToast("success","Đặt mặc định thành công!")
            setTimeout(function() {
                location.reload(); 
            }, 1000); 
        }else{
            Utils.getToast("error","Có lỗi vui lòng thử lại!")
        }
    } catch (error) {
        Utils.getToast("error","Máy chủ lỗi, vui lòng thử lại!")
    }
}

async function loadAddress() {
    try {
        const response = await Api.getDeleveryByUser();
        if(response.status === 200){
            console.log(response.delevery_InformationDTOList)
            const addresses = response.delevery_InformationDTOList;
            const defaultAddressContainer = document.querySelector('.default-address .address-container');
            const otherAddressesContainer = document.querySelector('.other-address');
    
            defaultAddressContainer.innerHTML = '';
            otherAddressesContainer.innerHTML = `
                    <label class="address-type">Địa chỉ khác</label>
            `;
    
            addresses.forEach((address) => {    
                if (address._default) {
                    defaultAddressContainer.setAttribute("data-id",`${address.de_infor_id}`)
                    defaultAddressContainer.innerHTML = `
                    <div class="address-content">
                        <div>
                            <p class="default-name">${address.name}</p>
                            <p class="default-phone-number">${address.phone}</p>
                        </div>
                        <p class="address-detail">${address.address_line_2}, ${address.address_line_1}</p>
                    </div>
                    <div class="action-address">
                        <div class="default-status">
                            <span class="material-symbols-outlined edit">edit</span>
                        </div>
                        <button disabled>
                            Mặc định
                        </button>
                    </div>`;
                } else {
                    const addressHTML = `
                        <div class="address-container" data-id = "${address.de_infor_id}">
                            <div class="address-content">
                                <div>
                                    <p class="default-name">${address.name}</p>
                                    <p class="default-phone-number">${address.phone}</p>
                                </div>
                                <p class="address-detail">${address.address_line_2}, ${address.address_line_1}</p>
                            </div>
                            <div class="action-address">
                                <div class="default-status">
                                    <span class="material-symbols-outlined close">close</span> 
                                    <span class="material-symbols-outlined edit">edit</span>
                                </div>
                                <button id = "set-default">
                                    Đặt mặc định
                                </button>
                            </div>
                        </div>
                    `;
                    otherAddressesContainer.innerHTML += addressHTML;
                }
                document.querySelectorAll('.address-infor .close').forEach((closeButton) => {
                    closeButton.addEventListener('click', (e) => {
                        const addressContainer = e.target.closest('.address-container');
                        const addressId = addressContainer?.dataset.id;
                        if (addressId) {
                            handleDelete(addressId);
                        }
                    });
                });
                
                console.log(document.querySelectorAll('.address-container #set-default'))

                document.querySelectorAll('.address-container #set-default').forEach((closeButton) => {
                    closeButton.addEventListener('click', (e) => {
                        const addressContainer = e.target.closest('.address-container');
                        const addressId = addressContainer?.dataset.id;
                        if (addressId) {
                            setDefaultAddress(addressId)
                        }
                        closeButton.disabled = true
                    });
                });

                document.querySelectorAll('.address-infor .edit').forEach((closeButton) => {
                    closeButton.addEventListener('click', (e) => {
                        const addressContainer = e.target.closest('.address-container');
                        const addressId = addressContainer?.dataset.id;
                        if (addressId) {
                            handleEdit(addressContainer);
                        }
                    });
                });
            });
            if(addresses.length <= 1){
                otherAddressesContainer.innerHTML += '<p style = "text-align:center; witdh: 100%; ">Trống</p>';
            }
        }else{
            if(response.status === 202){
                const defaultAddressContainer = document.querySelector('.default-address');
                const otherAddressesContainer = document.querySelector('.other-address');
        
                defaultAddressContainer.innerHTML = `
                    <label class="address-type">Địa chỉ mặc định</label>
                    <p style = "text-align:center; witdh: 100%; ">Trống</p>
                    <button class="new-address-btn">Thêm địa chỉ giao hàng mới</button>`;
                otherAddressesContainer.innerHTML += '<p style = "text-align:center; witdh: 100%; ">Trống</p>';
            }
        }

        const newAddressContainer = document.querySelector("#modal-add-address")
        const closeNewAddressBtn = document.querySelector("#modal-add-address .close")
        const cancelNewAddressBtn = document.querySelector("#modal-add-address .cancel")
        const openNewAddFormBtn = document.querySelector(".new-address-btn")
    
        const closeEditAddressBtn = document.querySelector("#modal-edit-address .close")
        const cancelEditAddressBtn = document.querySelector("#modal-edit-address .cancel")

        closeNewAddressBtn.addEventListener("click",()=>{
            Utils.closeModal(newAddressContainer)
        })
        cancelNewAddressBtn.addEventListener("click",(e)=>{
            e.preventDefault()
            Utils.closeModal(newAddressContainer)
        })
        closeEditAddressBtn.addEventListener("click",()=>{
            Utils.closeModal(editAddressContainer)
        })
        cancelEditAddressBtn.addEventListener("click",(e)=>{
            e.preventDefault()
            Utils.closeModal(editAddressContainer)
        })
        openNewAddFormBtn.addEventListener("click",()=>{
            Utils.openModal(newAddressContainer)
        })
        newAddressContainer.addEventListener("click",(e)=>{
            if(e.target === newAddressContainer){
                Utils.closeModal(newAddressContainer)
            }
        })
        editAddressContainer.addEventListener("click",(e)=>{
            if(e.target === editAddressContainer){
                Utils.closeModal(editAddressContainer)
            }
        })

        
    } catch (error) {
        if(error.status === 400){
            Utils.getToast("warning", "Vui lòng nhập thông tin cá nhân!")
            const defaultAddressContainer = document.querySelector('.default-address');
            const otherAddressesContainer = document.querySelector('.other-address');

            defaultAddressContainer.innerHTML = `
                <label class="address-type">Địa chỉ mặc định</label>
                <p style = "text-align:center; witdh: 100%; ">Trống</p>
                <button disabled class="new-address-btn">Thêm địa chỉ giao hàng mới</button>`;
            otherAddressesContainer.innerHTML += '<p style = "text-align:center; witdh: 100%; ">Trống</p>';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadAddress();
    let data = {}
    const fetchData = async ()=>{
        try {
            const response = await Api.getInforUser()
            if(response.status === 200){
                console.log(response)
                data = response.userDTO
                fillData(data)
            }else{
                if(response.status === 202){
                    email.value = response.accountDTO.email
                    console.log(response)
                    document.querySelector(".username").textContent = response.accountDTO.username
                    // document.querySelector(".create-at").textContent = response.accountDTO.createAt
                    document.querySelector(".create-at").textContent = 
                    new Date(response.accountDTO.createAt).toLocaleString("vi-VN");                
                }
            }
        } catch (error) {
            console.log(error)
            if(error.status === 400){
                Utils.getToast("warning","Thông tin cá nhân trống!")
            }else{
                Utils.getToast("error","Máy chủ lỗi, vui lòng thử lại!")
            }
        }
    }
    fetchData()
});