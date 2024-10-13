import Category from '../model/categoryModel.tsx'; // Đảm bảo đường dẫn và tên file đúng

export class CategoryService {
    
    // Hàm lấy tất cả danh mục
    static async getAllCategories(): Promise<Category[]> {
        try {
            const response = await fetch('http://localhost:3000/api/getall-category', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch categories');
            }

            const data: Category[] = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error; // Ném lỗi ra ngoài để xử lý
        }
    }

    // Hàm tạo danh mục mới
    static async createCategory(newCategory: Category): Promise<Category> {
        try {
            const response = await fetch('http://localhost:3000/api/create-category', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newCategory),
            });
            
            if (!response.ok) {
                throw new Error('Failed to create category');
            }

            const data: Category = await response.json();
            return data;
        } catch (error) {
            console.error('Error creating category:', error);
            throw error; // Ném lỗi ra ngoài để xử lý
        }
    }

    // Hàm lấy danh mục theo ID
    static async getCategoryByID(id: string): Promise<Category> {
        try {
            const response = await fetch(`http://localhost:3000/api/get-category/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            if (!response.ok) {
                throw new Error(`Failed to fetch category with ID ${id}`);
            }

            const data: Category = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching category by ID:', error);
            throw error; // Ném lỗi ra ngoài để xử lý
        }
    }

    // Hàm cập nhật danh mục theo ID
    static async updateCategoryByID(id: string, updateCategory: Category): Promise<Category> {
        try {
            const response = await fetch(`http://localhost:3000/api/update-category/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateCategory),
            });
            
            if (!response.ok) {
                throw new Error(`Failed to update category with ID ${id}`);
            }

            const data: Category = await response.json();
            return data;
        } catch (error) {
            console.error('Error updating category:', error);
            throw error; // Ném lỗi ra ngoài để xử lý
        }
    }

    // Hàm xóa danh mục theo ID
    static async deleteCategoryByID(id: string): Promise<void> {
        try {
            const response = await fetch(`http://localhost:3000/api/delete-category/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            if (!response.ok) {
                throw new Error(`Failed to delete category with ID ${id}`);
            }

        } catch (error) {
            console.error('Error deleting category:', error);
            throw error; // Ném lỗi ra ngoài để xử lý
        }
    }
}
