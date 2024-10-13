export interface Category {
    CategoryID: number;       // ID của danh mục
    CategoryName: string;     // Tên của danh mục
    Description: string;      // Mô tả danh mục
    ImageURL: string;         // Đường dẫn hình ảnh của danh mục
    status: string;           // Trạng thái của danh mục (active/inactive)
    location: string;         // Vị trí của danh mục (nếu có)
}
