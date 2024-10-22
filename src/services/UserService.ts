import {User} from '../model/userModel.tsx'; // Đảm bảo import đúng mô hình

const API_URL = 'http://localhost:3000/api/user/';

export const UserService = {
    getAllUsers: async (): Promise<User[]> => { // Đổi thành Promise<User[]> để trả về mảng người dùng
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Failed to fetch users'); // Ném lỗi nếu có
        }
        return response.json(); // Trả về dữ liệu JSON
    },
    createUser: async (newUser: User): Promise<User> => { // newUser chứa dữ liệu người dùng mới
        const response = await fetch(API_URL, {
            method: 'POST', // Phương thức POST để tạo người dùng mới
            headers: {
                'Content-Type': 'application/json', // Định dạng dữ liệu là JSON
            },
            body: JSON.stringify(newUser), // Chuyển đổi dữ liệu người dùng mới thành JSON
        });

        if (!response.ok) {
            throw new Error('Failed to create user');
        }

        return response.json(); // Trả về người dùng vừa tạo từ phản hồi của server
    },
    updateUserByID: async (id: string, updateUser: User): Promise<User> => {
        const response = await fetch(`${API_URL}update/${id}`, {
            method: 'POst', // Sử dụng phương thức PUT để cập nhật người dùng
            headers: {
                'Content-Type': 'application/json', // Định dạng dữ liệu là JSON
            },
            body: JSON.stringify(updateUser), // Chuyển đổi dữ liệu người dùng đã cập nhật thành JSON
        });
    
        if (!response.ok) {
            throw new Error('Failed to update user'); // Ném lỗi nếu có
        }
    
        return response.json(); // Trả về người dùng đã được cập nhật từ phản hồi của server
    },
    updateUsers: async ( updateUser: User): Promise<User> => {
        const response = await fetch(`${API_URL}updates`, {
            method: 'POst', // Sử dụng phương thức PUT để cập nhật người dùng
            headers: {
                'Content-Type': 'application/json', // Định dạng dữ liệu là JSON
            },
            body: JSON.stringify(updateUser), // Chuyển đổi dữ liệu người dùng đã cập nhật thành JSON
        });
    
        if (!response.ok) {
            throw new Error('Failed to update user'); // Ném lỗi nếu có
        }
    
        return response.json(); // Trả về người dùng đã được cập nhật từ phản hồi của server
    },
    
    getUserByID: async (id: string): Promise<User> => { // Đặt kiểu dữ liệu cho id
        const response = await fetch(`${API_URL}${id}`); // Chỉnh sửa URL
        if (!response.ok) {
            throw new Error('Failed to fetch user'); // Thay đổi thông báo lỗi
        }
        return response.json(); // Trả về dữ liệu JSON
    },
    updateStatus: async (id:string , updateStatusUser:String): Promise<User> => {
        const response = await fetch(`${API_URL}update-status/${id}`, {
            method: 'Post', // Sử dụng phương thức PUT để cập nhật người dùng
            headers: {
                'Content-Type': 'application/json', // Định dạng dữ liệu là JSON
            },
            body: JSON.stringify(updateStatusUser), // Chuyển đổi dữ liệu người dùng đã cập nhật thành JSON
        });
        if (!response.ok) {
            throw new Error('Failed to update user'); // Ném lỗi nếu có
        }
    
        return response.json(); // Trả về người dùng đã được cập nhật từ phản hồi của server
    }
};
