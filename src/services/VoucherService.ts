import { Voucher } from '../model/voucherModel'; // Đảm bảo import đúng mô hình Voucher

const API_URL = 'http://localhost:3000/api/vouchers/'; // Địa chỉ API cho voucher

export const VoucherService = {
    // Lấy tất cả các voucher
    getAllVouchers: async (): Promise<Voucher[]> => {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Failed to fetch vouchers'); // Ném lỗi nếu có
        }
        return response.json(); // Trả về dữ liệu JSON
    },

    // Tạo voucher mới
    createVoucher: async (newVoucher: Voucher): Promise<Voucher> => {
        const response = await fetch(API_URL, {
            method: 'POST', // Phương thức POST để tạo voucher mới
            headers: {
                'Content-Type': 'application/json', // Định dạng dữ liệu là JSON
            },
            body: JSON.stringify(newVoucher), // Chuyển đổi dữ liệu voucher mới thành JSON
        });

        if (!response.ok) {
            throw new Error('Failed to create voucher');
        }

        return response.json(); // Trả về voucher vừa tạo từ phản hồi của server
    },

    // Cập nhật voucher theo ID
    updateVoucherByID: async (id: string, updateVoucher: Voucher): Promise<Voucher> => {
        const response = await fetch(`${API_URL}update/${id}`, {
            method: 'POST', // Sử dụng phương thức PUT để cập nhật voucher
            headers: {
                'Content-Type': 'application/json', // Định dạng dữ liệu là JSON
            },
            body: JSON.stringify(updateVoucher), // Chuyển đổi dữ liệu voucher đã cập nhật thành JSON
        });

        if (!response.ok) {
            throw new Error('Failed to update voucher'); // Ném lỗi nếu có
        }

        return response.json(); // Trả về voucher đã được cập nhật từ phản hồi của server
    },
    getVoucherByCode:async (code:String):Promise<any>=>{
        const response = await fetch(`${API_URL}getvoucher`, {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code: code }), // Sending the voucher code as JSON
        });
    
        if (!response.ok) {
            throw new Error('Failed to retrieve voucher');
        }
    
        return response.json(); // Return the voucher data from the response
    },
    // Lấy voucher theo ID
    getVoucherByID: async (id: string): Promise<Voucher> => {
        const response = await fetch(`${API_URL}${id}`); // Chỉnh sửa URL
        if (!response.ok) {
            throw new Error('Failed to fetch voucher'); // Thay đổi thông báo lỗi
        }
        return response.json(); // Trả về dữ liệu JSON
    },
    deleteVoucherByID: async (id: string): Promise<void> => {
        const response = await fetch(`${API_URL}delete/${id}`, {
            method: 'get', // Sử dụng phương thức DELETE để xóa voucher
        });

        if (!response.ok) {
            throw new Error('Failed to delete voucher'); // Ném lỗi nếu việc xóa thất bại
        }
        return response.json(); // Trả về dữ liệu JSON

    },
    // Cập nhật trạng thái của voucher
    updatestatus: async (id: string, updatestatus: { status: string }): Promise<Voucher> => {
        const response = await fetch(`${API_URL}update-status/${id}`, {
            method: 'PUT', // Sử dụng phương thức PUT để cập nhật trạng thái
            headers: {
                'Content-Type': 'application/json', // Định dạng dữ liệu là JSON
            },
            body: JSON.stringify(updatestatus), // Chuyển đổi dữ liệu trạng thái thành JSON
        });

        if (!response.ok) {
            throw new Error('Failed to update voucher status'); // Ném lỗi nếu có
        }

        return response.json(); // Trả về voucher đã được cập nhật trạng thái từ phản hồi của server
    }
};
