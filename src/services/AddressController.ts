import { Address } from '../model/AddressModel'; // Đảm bảo đường dẫn và tên file đúng

export class AddressController {
    
    // Hàm lấy tất cả danh mục
    static async getAlladdressById(UserID: number): Promise<Address[]> { // Đổi thành kiểu trả về đúng
        try {
            const response = await fetch('http://localhost:3000/api/address/byuser', {
                method: 'POST',  // POST phải viết hoa
                body: JSON.stringify({ "UserID": UserID }),  // Cần chuyển body thành chuỗi JSON
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch categories');
            }

            const data: Address[] = await response.json();  // Đảm bảo kiểu trả về là đúng
            return data;
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error; // Ném lỗi ra ngoài để xử lý
        }
    }
}
