import Utils from "./Utils.js";

export default class Api{    
    
    static BASE_URL = "http://localhost:8080"

    static getHeader(){
        const token = localStorage.getItem("token")
        return{
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    }

    // static async get(endpoint) {
    //     try {
    //         const response = await fetch(`${Api.BASE_URL}${endpoint}`, {
    //             method: 'GET',
    //             headers: Api.getHeader(),
    //         });
            
    //         if (!response.ok) {
    //             throw new Error(`HTTP error! status: ${response.status}`);
    //         }

    //         return await response.json(); 
    //     } catch (error) {
    //         console.error('Fetch GET error:', error);
    //     }
    // }

    static async get(endpoint) {
        Utils.protectUser()
        try {
            const response = await fetch(`${Api.BASE_URL}${endpoint}`, {
                method: 'GET',
                headers: Api.getHeader(),
            });
    
            // Nếu response không OK, tạo lỗi kèm status
            if (!response.ok) {
                const error = new Error(`HTTP error! status: ${response.status}`);
                error.status = response.status;
                throw error;
            }
    
            return await response.json();
        } catch (error) {
            console.error('Fetch GET error:', error);
            throw error; // Ném lỗi lại để xử lý ở nơi gọi hàm
        }
    }
    

    static async getNoAuth(endpoint) {
        try {
            const response = await fetch(`${Api.BASE_URL}${endpoint}`, {
                method: 'GET',
            });
            
            if (!response.ok) {
                const error = new Error(`HTTP error! status: ${response.status}`);
                error.status = response.status;
                throw error;
            }

            return await response.json(); 
        } catch (error) {
            console.error('Fetch GET error:', error);
            throw error; // Ném lỗi lại để xử lý ở nơi gọi hàm
        }
    }
    
    static async post(endpoint, data) {
        Utils.protectUser()
        try {
            const response = await fetch(`${Api.BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: Api.getHeader(),
                body: JSON.stringify(data),
            });
            
            if (!response.ok) {
                const error = new Error(`HTTP error! status: ${response.status}`);
                error.status = response.status;
                throw error;
            }

            return await response.json();
        } catch (error) {
            console.error('Fetch POST error:', error);
            throw error; // Ném lỗi lại để xử lý ở nơi gọi hàm
        }
    }

    static async postNoAuth(endpoint, data) {
        try {
            const response = await fetch(`${Api.BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Đặt Content-Type là application/json
                },
                body: JSON.stringify(data), // Chuyển đổi dữ liệu sang chuỗi JSON
            });
            
            if (!response.ok) {
                const error = new Error(`HTTP error! status: ${response.status}`);
                error.status = response.status;
                throw error;
            }
    
            return await response.json();
        } catch (error) {
            console.error('Fetch POST error:', error);
            throw error; // Ném lỗi lại để xử lý ở nơi gọi hàm
        }
    }    

    static getSpecByProduct =  async (productId)=>{
        const response = await this.getNoAuth(`/specifications/get-by-product/${productId}`)
        return response
    }

    static getProductByImage =  async (data)=>{
        const response = await this.postNoAuth(`/product/upload`,data)
        return response
    }

    static feedback =  async (data)=>{
        const response = await this.postNoAuth(`/product/feedback`,data)
        return response
    }

    static getDeleveryByUser =  async ()=>{
        const response = await this.get(`/delevery-information/get-by-user`)
        return response
    }

    static editDelevery =  async (data)=>{
        console.log(data)
        const response = await this.post(`/delevery-information/edit`,data)
        return response
    }

    static changePassword =  async (data)=>{
        console.log(data)
        const response = await this.post(`/user/change-password`,data)
        return response
    }

    static setDefaultAddress =  async (id)=>{
        const response = await this.get(`/delevery-information/set-default/${id}`)
        return response
    }

    static deleteAddress =  async (id)=>{
        const response = await this.get(`/delevery-information/delete/${id}`)
        return response
    }

    static createNewDelevery =  async (data)=>{
        console.log(data)
        const response = await this.post(`/delevery-information/add`,data)
        return response
    }

    static createNewOrder = async (data) => {
        console.log(data)
        const response = await this.post(`/order/add`,data)
        return response
    }

    static changeStatusOrder = async (data) => {
        const response = await this.post(`/order/change-status`,data)
        return response
    }

    static getOrderByUserAndStatus = async (status) => {
        const response = await this.get(`/order/get-by-user/${status}`)
        return response
    }

    static getInforUser = async () => {
        const response = await this.get(`/user/get-user-information`)
        return response
    }

    static editInforUser = async (data) => {
        const response = await this.post(`/user/edit-user-information`, data)
        return response
    }

    static addCartItem = async (data) => {
        const response = await this.post(`/cart-items/add`, data)
        return response
    }

    static deleteItemInCart = async (id) => {
        const response = await this.get(`/cart-items/delete/${id}`)
        return response
    }

    static getCartByAccout = async () => {
        const response = await this.get(`/cart-items/get-by-account`)
        return response
    }

    static getAllProduct = async () => {
        const response = await this.getNoAuth("/product/get-all")
        return response
    }

    static getAvailableProduct = async () => {
        const response = await this.getNoAuth("/product/get-available-product")
        return response
    }

    static getProductById = async (id) => {
        const response = await this.getNoAuth(`/product/get-by-id/${id}`)
        console.log(response)
        return response
    }

    static getProductByCategory = async (id) => {
        const response = await this.getNoAuth(`/product/get-by-category-id/${id}`)
        console.log(response)
        return response
    }

    static getProductByName = async (name) => {
        const response = await this.getNoAuth(`/product/get-by-name/${name}`)
        return response
    }

    static getNewProduct = async () => {
        const response = await this.getNoAuth("/product/get-new-products")
        console.log(response)
        return response
    }

    static getHotProduct = async () => {
        const response = await this.getNoAuth("/product/get-hot-products")
        console.log(response)
        return response
    }

    static getAllCategory = async () => {
        const response = await this.getNoAuth("/category/get-all")
        console.log(response)
        return response
    }

    static getAllTeeProduct = async () => {
        const response = await this.get("/tee-product")
        return response
    }
    static getAllJeanProduct = async () => {
        const response = await this.get("/jean-product")
        return response
    }
    static getAllHoodieProduct = async () => {
        const response = await this.get("/hoodie-product")
        return response
    }
    static getAllTShirtProduct = async () => {
        const response = await this.get("/t-shirt-product")
        return response
    }
    static getAllPaintProduct = async ()=>{
        const response = await this.get("/paint-product")
        return response
    }
    static getAllShortProduct = async ()=>{
        const response = await this.get("/short-product")
        return response
    }
}