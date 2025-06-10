// const ViewTracker = {
//     viewTimes: {},

//     loadFromStorage() {
//         // Kiểm tra và lấy dữ liệu đã lưu từ localStorage
//         const storedData = localStorage.getItem('viewTimes');
//         if (storedData) {
//             this.viewTimes = JSON.parse(storedData);
//         } else {
//             // Nếu chưa có dữ liệu, khởi tạo viewTimes rỗng
//             this.viewTimes = {};
//         }
//     },

//     saveToStorage() {
//         // Lưu dữ liệu vào localStorage
//         localStorage.setItem('viewTimes', JSON.stringify(this.viewTimes));
//     },

//     startTracking(productId) {
//         // Nếu chưa có thông tin sản phẩm trong viewTimes, tạo mới
//         if (!this.viewTimes[productId]) {
//             this.viewTimes[productId] = { totalTime: 0, startTime: Date.now() };
//         } else {
//             // Nếu đã có thông tin sản phẩm, chỉ cần cập nhật thời gian bắt đầu
//             const elapsedTime = Date.now() - this.viewTimes[productId].startTime; 
//             this.viewTimes[productId].startTime = Date.now();
//             this.viewTimes[productId].totalTime += elapsedTime; // Cộng dồn thời gian đã xem
//         }
//         this.saveToStorage();
//     },

//     stopTracking(productId) {
//         // Dừng theo dõi sản phẩm và tính thời gian đã xem
//         if (this.viewTimes[productId] && this.viewTimes[productId].startTime) {
//             const endTime = Date.now();
//             const viewedTime = endTime - this.viewTimes[productId].startTime;
//             this.viewTimes[productId].totalTime += viewedTime;
//             this.viewTimes[productId].startTime = null;
//             this.saveToStorage();
//         }
//     },

//     getMostViewedProduct() {
//         let maxTime = 0;
//         let mostViewedProductId = null;

//         // Duyệt qua tất cả các sản phẩm để tìm sản phẩm có thời gian xem lâu nhất
//         for (const [productId, { totalTime }] of Object.entries(this.viewTimes)) {
//             if (totalTime > maxTime) {
//                 maxTime = totalTime;
//                 mostViewedProductId = productId;
//             }
//         }

//         return mostViewedProductId;
//     }
// };

// export default ViewTracker;

const ViewTracker = {
    viewTimes: JSON.parse(localStorage.getItem('viewTimes') || '{}'),

    saveToStorage() {
        localStorage.setItem('viewTimes', JSON.stringify(this.viewTimes));
    },

    startTracking(productId) {
        if (!this.viewTimes[productId]) {
            this.viewTimes[productId] = { totalTime: 0, startTime: Date.now() };
        } else {
            this.viewTimes[productId].startTime = Date.now();
        }
        this.saveToStorage();
    },

    stopTracking(productId) {
        if (this.viewTimes[productId] && this.viewTimes[productId].startTime) {
            const endTime = Date.now();
            const viewedTime = endTime - this.viewTimes[productId].startTime;
            this.viewTimes[productId].totalTime += viewedTime;
            this.viewTimes[productId].startTime = null;
            this.saveToStorage();
        }
    },

    getMostViewedProduct() {
        let maxTime = 0;
        let mostViewedProduct = null;
    
        for (const [productId, { totalTime }] of Object.entries(this.viewTimes)) {
            if (totalTime > maxTime) {
                maxTime = totalTime;
                // Lưu lại toàn bộ thông tin sản phẩm có thời gian xem lâu nhất
                mostViewedProduct = { productId, totalTime };
            }
        }
    
        return mostViewedProduct;
    }    
};

export default ViewTracker;

// const ViewTracker = {
//     viewTimes: JSON.parse(localStorage.getItem('viewTimes') || '{}'),

//     saveToStorage() {
//         localStorage.setItem('viewTimes', JSON.stringify(this.viewTimes));
//     },

//     startTracking(productId) {
//         if (!this.viewTimes[productId]) {
//             this.viewTimes[productId] = { totalTime: 0, startTime: Date.now() };
//         } else {
//             this.viewTimes[productId].startTime = Date.now();
//         }
//         this.saveToStorage();
//     },

//     stopTracking(productId) {
//         if (this.viewTimes[productId] && this.viewTimes[productId].startTime) {
//             const endTime = Date.now();
//             const viewedTime = endTime - this.viewTimes[productId].startTime;
//             this.viewTimes[productId].totalTime += viewedTime;
//             this.viewTimes[productId].startTime = null;
//             this.saveToStorage();
//         }
//     },

//     getMostViewedProduct() {
//         let maxTime = 0;
//         let mostViewedProductId = null;

//         for (const [productId, { totalTime }] of Object.entries(this.viewTimes)) {
//             if (totalTime > maxTime) {
//                 maxTime = totalTime;
//                 mostViewedProductId = productId;
//             }
//         }

//         return mostViewedProductId;
//     }
// };
