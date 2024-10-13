export interface Product {
    ProductID: number;           // ID của sản phẩm
    ProductName: string;         // Tên sản phẩm
    Description: string;         // Mô tả sản phẩm
    Price: number;               // Giá sản phẩm
    StockQuantity: number;       // Số lượng tồn kho
    CategoryID: number;          // ID của danh mục
    CategoryName: string;        // Tên danh mục
    status: string;              // Trạng thái sản phẩm (active/inactive)
    Priority: number;            // Độ ưu tiên của sản phẩm
    Creationtime: string;        // Thời gian tạo sản phẩm
    ShortDescription: string;    // Mô tả ngắn gọn về sản phẩm
    OtherImages: string[];       // Danh sách tên các hình ảnh khác của sản phẩm
}
export interface ProductImage {
    ImageID: number;             // ID của hình ảnh
    OtherImages: string[];       // Danh sách các hình ảnh liên quan đến sản phẩm
    ProductID: number;           // ID của sản phẩm mà hình ảnh này thuộc về
}
