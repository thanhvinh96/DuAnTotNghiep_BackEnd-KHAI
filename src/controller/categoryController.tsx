import {Category} from '../model/categoryModel.ts'; // Đảm bảo đường dẫn và tên file đúng
import { CategoryService } from '../services/CategoryService.tsx';

export class CategoryController {
    // Hàm để lấy tất cả danh mục
    static async fetchCategories(): Promise<Category[]> {
        try {
            return await CategoryService.getAllCategories(); // Gọi tới dịch vụ lấy tất cả danh mục
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error; // Ném lỗi ra ngoài để xử lý
        }
    }

    // Hàm để tạo danh mục mới
    static async createCategory(newCategory: Category): Promise<Category> {
        try {
            return await CategoryService.createCategory(newCategory); // Gọi tới dịch vụ để tạo danh mục mới
        } catch (error) {
            console.error('Error creating category:', error);
            throw error; // Ném lỗi ra ngoài để xử lý
        }
    }

    // Hàm để lấy thông tin danh mục theo ID
    static async getCategoryByID(id: string): Promise<Category> {
        try {
            return await CategoryService.getCategoryByID(id); // Gọi tới dịch vụ để lấy danh mục
        } catch (error) {
            console.error('Error fetching category:', error);
            throw error; // Ném lỗi ra ngoài để xử lý
        }
    }

    // Hàm để cập nhật thông tin danh mục theo ID
    static async updateCategoryByID(id: string, updateCategory: Category): Promise<Category> {
        try {
            return await CategoryService.updateCategoryByID(id, updateCategory); // Gọi tới dịch vụ để cập nhật danh mục
        } catch (error) {
            console.error('Error updating category:', error);
            throw error; // Ném lỗi ra ngoài để xử lý
        }
    }

    // Hàm để xóa danh mục theo ID
    static async deleteCategoryByID(id: string): Promise<void> {
        try {
            await CategoryService.deleteCategoryByID(id); // Gọi tới dịch vụ để xóa danh mục
        } catch (error) {
            console.error('Error deleting category:', error);
            throw error; // Ném lỗi ra ngoài để xử lý
        }
    }
}
