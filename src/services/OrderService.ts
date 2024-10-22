import { promise } from 'selenium-webdriver';
import { Order } from '../model/orderModel'; // Đảm bảo rằng bạn có model này

export class OrderService {
    // Lấy tất cả đơn hàng
    static async getAllOrders(): Promise<Order[]> {
        try {
            const response = await fetch('http://localhost:3000/api/order', {
                method: 'GET', // GET request để lấy tất cả đơn hàng
            });
            if (!response.ok) {
                throw new Error('Error fetching all orders');
            }
            return await response.json(); // Chuyển dữ liệu từ JSON về dạng object
        } catch (error) {
            console.error('Error fetching all orders:', error);
            throw new Error('Error fetching all orders');
        }
    }

    // Lấy đơn hàng theo ID
    static async getOrderByID(orderId: number): Promise<Order | null> {
        try {
            const response = await fetch(`http://localhost:3000/api/order/${orderId}`, {
                method: 'GET', // GET request để lấy đơn hàng theo ID
            });
            if (!response.ok) {
                throw new Error(`Error fetching order with ID ${orderId}`);
            }
            return await response.json(); // Chuyển dữ liệu từ JSON về dạng object
        } catch (error) {
            console.error(`Error fetching order with ID ${orderId}:`, error);
            throw new Error('Error fetching order by ID');
        }
    }
        static async searchorder(formData: string): Promise<any> {
            try {
                const response = await fetch('http://localhost:3000/api/order/search', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
    
                // Kiểm tra xem phản hồi có thành công không
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
    
                const result = await response.json();
                return result; // Trả về kết quả tìm kiếm
            } catch (error) {
                console.error('Error searching orders:', error);
                throw error; // Ném lại lỗi để xử lý bên ngoài
            }
        }
    
    // láy đơn hàng theo id 
    static async getOrdersByUserId(userid: string): Promise<any> {
        try {
            const response = await fetch('http://localhost:3000/api/order/byuser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userid),
            });
            
            // Kiểm tra nếu response không hợp lệ
            if (!response.ok) {
                throw new Error('Error getting order: ' + response.statusText);
            }
    
            const data = await response.json(); // Chuyển dữ liệu từ JSON về dạng object
            console.log(data); // In ra dữ liệu nhận được từ server
            return data; // Trả về dữ liệu
        } catch (error) {
            console.error('Error getting order:', error);
            throw new Error('Error getting order');
        }
    }
    
    // Tạo đơn hàng mới
    static async createOrder(newOrder: Order): Promise<Order> {
        try {
            const response = await fetch('http://localhost:3000/api/order/creater', {
                method: 'POST', // POST request để tạo đơn hàng mới
                headers: {
                    'Content-Type': 'application/json', // Đảm bảo gửi dữ liệu dạng JSON
                },
                body: JSON.stringify(newOrder), // Chuyển đối tượng Order thành JSON
            });
            
            if (!response.ok) {
                throw new Error('Error creating order');
            }
            return await response.json(); // Chuyển dữ liệu từ JSON về dạng object
        } catch (error) {
            console.error('Error creating order:', error);
            throw new Error('Error creating order');
        }
    }
    static async showorderdetail(id: string): Promise<any> {
        try {
            const response = await fetch(`http://localhost:3000/api/orderdetail/get?id=${id}`, {
                method: 'GET', // Phương thức GET
                headers: {
                    'Content-Type': 'application/json', // Định dạng dữ liệu
                },
            });

            // Kiểm tra xem phản hồi có thành công không
            if (!response.ok) {
                throw new Error(`Error fetching order details: ${response.statusText}`);
            }

            // Chuyển đổi phản hồi thành JSON
            const data = await response.json();
            return data; // Trả về dữ liệu
        } catch (error) {
            console.error('Error:', error);
            throw error; // Ném lỗi để xử lý ở nơi khác nếu cần
        }
    }
        static async getFullOrder(): Promise<any> {
          try {
            const response = await fetch('http://localhost:3000/api/order');
            // Kiểm tra nếu phản hồi là thành công (status 200 - 299)
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
      
            const data = await response.json(); // Chuyển đổi phản hồi thành JSON
            return data; // Trả về dữ liệu sau khi lấy được từ API
          } catch (error) {
            console.error("Error fetching full order:", error);
            throw error; // Ném lỗi nếu có lỗi xảy ra
          }
        }
        static async updateStatus(datapost:any): Promise<any> {
            try {
                // Tạo payload cho yêu cầu cập nhật trạng thái
               
        
                // Gửi yêu cầu PUT đến API cập nhật trạng thái đơn hàng
                const response = await fetch('http://localhost:3000/api/order/update', {
                    method: 'Post', // Sử dụng phương thức PUT để cập nhật
                    headers: {
                        'Content-Type': 'application/json', // Đặt header cho nội dung JSON
                    },
                    body: JSON.stringify(datapost), // Chuyển đổi payload thành chuỗi JSON
                });
        
                // Kiểm tra nếu phản hồi là thành công (status 200 - 299)
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
        
                const data = await response.json(); // Chuyển đổi phản hồi thành JSON
                return data; // Trả về dữ liệu sau khi cập nhật
            } catch (error) {
                console.error("Error updating order status:", error);
                throw error; // Ném lỗi nếu có lỗi xảy ra
            }
        }
        
        static async getFullOrdersByOrderId(orderId: number): Promise<any> {
            try {
                // Tạo URL với orderId đã cho
                const url = `http://localhost:3000/api/orderdetail/get?id=${orderId}`;
                const response = await fetch(url);
                
                // Kiểm tra nếu phản hồi là thành công (status 200 - 299)
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json(); // Chuyển đổi phản hồi thành JSON
                return data; // Trả về dữ liệu sau khi lấy được từ API
            } catch (error) {
                console.error("Error fetching full order:", error);
                throw error; // Ném lỗi nếu có lỗi xảy ra
            }
        }
        
      
}
