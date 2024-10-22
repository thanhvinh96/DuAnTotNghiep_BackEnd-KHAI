import Product from '../models/productModel.tsx'; // Đảm bảo đường dẫn và tên file đúng
import { ProductService } from '../services/ProducService.tsx';

export class ProductController {
    // Hàm để lấy tất cả sản phẩm
    static async fetchProducts(): Promise<Product[]> {
        try {
            return await ProductService.getAllProducts(); // Gọi tới dịch vụ lấy tất cả sản phẩm
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error; // Ném lỗi ra ngoài để xử lý
        }
    }
    static async getProductCategory(): Promise<any>{
        try {
            return await ProductService.getProductCategory(); // Gọi tới dịch vụ lấy tất cả sản phẩm
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error; // Ném lỗi ra ngoài để xử lý
        }
    }

    // Hàm để tạo sản phẩm mới
    static async createProduct(newProduct: Product): Promise<Product> {
        try {
            return await ProductService.createProduct(newProduct); // Gọi tới dịch vụ để tạo sản phẩm mới
        } catch (error) {
            console.error('Error creating product:', error);
            throw error; // Ném lỗi ra ngoài để xử lý
        }
    }

    // Hàm để lấy thông tin sản phẩm theo ID
    static async getProductByID(id: string): Promise<Product> {
        try {
            return await ProductService.getProductByID(id); // Gọi tới dịch vụ để lấy sản phẩm
        } catch (error) {
            console.error('Error fetching product:', error);
            throw error; // Ném lỗi ra ngoài để xử lý
        }
    }

    // Hàm để cập nhật thông tin sản phẩm theo ID
    static async updateProductByID(id: string, updateProduct: Product): Promise<Product> {
        try {
            return await ProductService.updateProductByID(id, updateProduct); // Gọi tới dịch vụ để cập nhật sản phẩm
        } catch (error) {
            console.error('Error updating product:', error);
            throw error; // Ném lỗi ra ngoài để xử lý
        }
    }

    // Hàm để xóa sản phẩm theo ID
    static async deleteProductByID(id: string): Promise<void> {
        try {
            await ProductService.deleteProductByID(id); // Gọi tới dịch vụ để xóa sản phẩm
        } catch (error) {
            console.error('Error deleting product:', error);
            throw error; // Ném lỗi ra ngoài để xử lý
        }
    }
    static async updateProductStatus(id: string, newStatus: string): Promise<string> {
        try {
            await ProductService.updateProductStatus(id, newStatus); // Gọi tới dịch vụ để cập nhật status sản phẩm
            return 'Product status updated successfully'; // Trả về thông báo thành công
        } catch (error) {
            console.error('Error updating product status:', error);
            return 'Failed to update product status'; // Trả về thông báo thất bại
        }
    }
    
    
    static async getProductNew():Promise<Product>{
        try {
            return await ProductService.getProductNew(); // Gọi tới dịch vụ lấy tất cả sản phẩm
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error; // Ném lỗi ra ngoài để xử lý
        }
    }
}
