export interface Order {
    OrderID: number;              // ID của đơn hàng
    UserID: number;               // ID của người dùng đã tạo đơn hàng
    OrderDate: string;            // Ngày tạo đơn hàng
    TotalAmount: number;          // Tổng số tiền của đơn hàng
    Status: string;               // Trạng thái của đơn hàng (pending, completed, canceled)
    PaymentStatus: string;        // Trạng thái thanh toán (paid, unpaid)
    VoucherID: number | null;     // ID của voucher áp dụng (nếu có)
    TotalDiscount: number;        // Tổng giảm giá của đơn hàng
    CodeOrder: string;            // Mã đơn hàng
    TimeBuy: string;              // Thời gian đặt hàng
    Address: string;              // Địa chỉ giao hàng
}

export interface OrderItem {
    OrderItemID: number;          // ID của mục đơn hàng
    OrderID: number;              // ID của đơn hàng mà mục này thuộc về
    ProductID: number;            // ID của sản phẩm trong mục đơn hàng
    Quantity: number;             // Số lượng sản phẩm trong mục đơn hàng
    Price: number;                // Giá của sản phẩm khi bán
    Discount: number;             // Giảm giá áp dụng cho sản phẩm
    TotalAmount: number;          // Tổng tiền của sản phẩm trong mục đơn hàng (Quantity * Price - Discount)
}
