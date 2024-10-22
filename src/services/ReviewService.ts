// import { Review } from '../model/reviewModel'; // Đảm bảo import đúng mô hình Review

import { Await } from "react-router-dom";

const API_URL = 'http://localhost:3000/api/review/';

export const ReviewService = {
    // Lấy tất cả các đánh giá
    getAllReviews: async (): Promise<any[]> => {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Failed to fetch reviews'); // Ném lỗi nếu có
        }
        return response.json(); // Trả về dữ liệu JSON
    },

    // Thêm đánh giá mới
    addReview: async (newReview: any): Promise<any> => {
        const response = await fetch(`${API_URL}add`, {
            method: 'POST', // Phương thức POST để tạo đánh giá mới
            headers: {
                'Content-Type': 'application/json', // Định dạng dữ liệu là JSON
            },
            body: JSON.stringify(newReview), // Chuyển đổi dữ liệu đánh giá mới thành JSON
        });

        if (!response.ok) {
            throw new Error('Failed to add review'); // Ném lỗi nếu có
        }

        return response.json(); // Trả về đánh giá vừa tạo từ phản hồi của server
    },

    // Xóa đánh giá theo ID
    deleteReview: async (id: string): Promise<void> => {
        const response = await fetch(`${API_URL}${id}`, {
            method: 'DELETE', // Phương thức DELETE để xóa đánh giá
        });

        if (!response.ok) {
            throw new Error('Failed to delete review'); // Ném lỗi nếu có
        }

        // Không cần trả về gì cả, chỉ cần xác nhận xóa thành công
    },
    getReviewByProduct: async (data: string): Promise<any> => {
        const response = await fetch(`${API_URL}byproduct`, { // Pass the product ID in the URL
          method: 'POST', // Use GET method to retrieve data
          headers: {
            'Content-Type': 'application/json', // Ensure response format is JSON
          },
          body: JSON.stringify({
            ProductID:data
          }), // Chuyển đổi dữ liệu đánh giá mới thành JSON

        });
      
        if (!response.ok) {
          throw new Error(`Error fetching reviews for product ${data}`);
        }
      
        return await response.json(); // Return the response as JSON
      },
      
    // Lấy đánh giá theo ID
    getReviewByID: async (id: string): Promise<any> => {
        const response = await fetch(`${API_URL}${id}`); // Chỉnh sửa URL
        if (!response.ok) {
            throw new Error('Failed to fetch review'); // Thay đổi thông báo lỗi
        }
        return response.json(); // Trả về dữ liệu JSON
    },
};
