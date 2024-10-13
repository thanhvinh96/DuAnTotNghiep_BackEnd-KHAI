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
}
