import User from '../model/userModel.tsx'; // Đảm bảo đường dẫn và tên file đúng
import { UserService } from '../services/UserService.ts';

export class UserController {
    // Hàm để lấy tất cả người dùng
    static async fetchUsers(): Promise<User[]> {
        try {
            return await UserService.getAllUsers(); // Gọi tới dịch vụ lấy tất cả người dùng
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error; // Ném lỗi ra ngoài để xử lý
        }
    }

    // Hàm để tạo người dùng mới
    static async createUser(newUser: User): Promise<User> {
        try {
            return await UserService.createUser(newUser); // Gọi tới dịch vụ để tạo người dùng mới
        } catch (error) {
            console.error('Error creating user:', error);
            throw error; // Ném lỗi ra ngoài để xử lý
        }
    }
    static async getUserByID(id: string): Promise<User> { // Sửa kiểu trả về thành Promise<User>
        try {
            return await UserService.getUserByID(id); // Gọi tới dịch vụ để lấy người dùng
        } catch (error) {
            console.error('Error fetching user:', error); // Sửa thông báo lỗi cho đúng ngữ cảnh
            throw error; // Ném lỗi ra ngoài để xử lý
        }
    }
    static async updateUserByID(id: string, updateUser: User): Promise<User> {
        try {
            return await UserService.updateUserByID(id, updateUser); // Gọi tới dịch vụ để cập nhật người dùng
        } catch (error) {
            console.error('Error updating user:', error); // Sửa thông báo lỗi cho đúng ngữ cảnh
            throw error; // Ném lỗi ra ngoài để xử lý
        }
    }    
    static async updateStatusByID(id:string,updateStatusUser:User): Promise<User>{
        try {
            return await UserService.updateStatus(id, updateStatusUser); // Gọi tới dịch vụ để cập nhật người dùng
        } catch (error) {
            console.error('Error updating user:', error); // Sửa thông báo lỗi cho đúng ngữ cảnh
            throw error; // Ném lỗi ra ngoài để xử lý
        }
    }
}
