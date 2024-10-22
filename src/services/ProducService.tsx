import { promise } from 'selenium-webdriver';
import Product from '../model/ProductModel.tsx'; // Đảm bảo import đúng mô hình

const API_URL = 'http://localhost:3000/api/products/';

export const ProductService = {
    getAllProducts: async (): Promise<Product[]> => {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Failed to fetch products'); // Ném lỗi nếu có
        }
        return response.json(); // Trả về dữ liệu JSON
    },

    createProduct: async (newProduct: Product): Promise<Product> => {
        const response = await fetch(API_URL, {
            method: 'POST', // Phương thức POST để tạo sản phẩm mới
            headers: {
                'Content-Type': 'application/json', // Định dạng dữ liệu là JSON
            },
            body: JSON.stringify(newProduct), // Chuyển đổi dữ liệu sản phẩm mới thành JSON
        });

        if (!response.ok) {
            throw new Error('Failed to create product');
        }

        return response.json(); // Trả về sản phẩm vừa tạo từ phản hồi của server
    },
     getProductCategory: async (): Promise<any[]> => {
        const response = await fetch(`${API_URL}get-category`); // Thay đổi URL theo API của bạn
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json(); // Giả sử API trả về dữ liệu dưới dạng JSON
    },
    updateProductStatus: async (id: string, newStatus: string): Promise<any> => {
        const response = await fetch(`${API_URL}update-status`, {
            method: 'POST', // Use PUT to update the user's status
            headers: {
                'Content-Type': 'application/json', // Ensure the content type is JSON
            },
            body: JSON.stringify({
                productId: id, // Include the user's ID
                newStatus: newStatus, // Include the new status
            }),
        });
    
        if (!response.ok) {
            throw new Error('Failed to update user status'); // Handle any errors
        }
    
        return response.json(); // Return the updated response from the server
    },
      
    updateProductByID: async (id: string, updateProduct: Product): Promise<Product> => {
        const response = await fetch(`${API_URL}${id}`, {
            method: 'PUT', // Sử dụng phương thức PUT để cập nhật sản phẩm
            headers: {
                'Content-Type': 'application/json', // Định dạng dữ liệu là JSON
            },
            body: JSON.stringify(updateProduct), // Chuyển đổi dữ liệu sản phẩm đã cập nhật thành JSON
        });

        if (!response.ok) {
            throw new Error('Failed to update product'); // Ném lỗi nếu có
        }

        return response.json(); // Trả về sản phẩm đã được cập nhật từ phản hồi của server
    },

    getProductByID: async (id: string): Promise<Product> => {
        const response = await fetch(`${API_URL}${id}`); // Chỉnh sửa URL
        if (!response.ok) {
            throw new Error('Failed to fetch product'); // Thay đổi thông báo lỗi
        }
        return response.json(); // Trả về dữ liệu JSON
    },
    getProductNew : async ():Promise<Product>=>{
        const response = await fetch(`${API_URL}new`);
        if (!response.ok) {
            throw new Error('Failed to fetch products'); // Ném lỗi nếu có
        }
        return response.json(); // Trả về dữ liệu JSON
    },
    deleteProductByID: async (id: string): Promise<Product> => {
        const response = await fetch(`${API_URL}delete`, {
            method: 'POST', // Sử dụng phương thức DELETE để xóa sản phẩm
            headers: {
                'Content-Type': 'application/json', // Định dạng dữ liệu là JSON
            },
            body: JSON.stringify({
                productId:id
            }), // Chuyển đổi dữ liệu sản phẩm đã cập nhật thành JSON
        });

        if (!response.ok) {
            throw new Error('Failed to delete product'); // Ném lỗi nếu có
        }

        return response.json(); // Trả về sản phẩm đã được xóa từ phản hồi của server
    }
};
