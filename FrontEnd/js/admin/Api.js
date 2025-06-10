import Utils from "./Utils.js";

export default class Api {

    static BASE_URL = 'http://localhost:8080/'

    static authenticate = "Bearer " + window.localStorage.getItem('token')

    static async getData(URL) {
        Utils.protectAdmin()
        Utils.showLoading(true)
        try {
            const response = await fetch(Api.BASE_URL + URL, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": this.authenticate
                }
            })
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            Utils.showLoading(false)            
            return data
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    static async postData(URL, data) {
        Utils.protectAdmin()
        Utils.showLoading(true)
        try {
            const response = await fetch(Api.BASE_URL + URL, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": this.authenticate
                },
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            } 
            Utils.showLoading(false)
            return await response.json()      
            
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    static async putData(URL, data) {
        Utils.protectAdmin()
        Utils.showLoading(true)
        try {
            const response = await fetch(Api.BASE_URL + URL, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": this.authenticate
                },
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            } 
            Utils.showLoading(false)
            return await response.json()      
            
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    static async getCategoryList() {
        const data = await Api.getData('category/get-all')
        if (data) {
            return data
        } else {
            Utils.showToast(
                'Lỗi lấy danh sách danh mục',
                'error'
            )
        }
    }

    static async getAllColors() {
        try {
            const data = await Api.getData('color/get-all-colors');
            if (data) {
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
    

}