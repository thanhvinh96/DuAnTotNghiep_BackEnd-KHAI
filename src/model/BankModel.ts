export interface BankAccount {
    id: number;                              // ID của tài khoản ngân hàng
    account_number: string;                  // Số tài khoản ngân hàng
    bank_name: string;                        // Tên ngân hàng
    account_holder: string;                   // Tên chủ tài khoản
    transaction_description: string;          // Mô tả giao dịch
    image_url: string;                        // Đường dẫn hình ảnh (logo ngân hàng)
    created_at: Date;                        // Thời gian tạo tài khoản
}
