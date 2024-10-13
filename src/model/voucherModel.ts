export interface Voucher {
    VoucherID: string;
    Code: string;
    DiscountAmount: number;
    ExpiryDate: string;
    MinimumPurchaseAmount: number;
    quantityused: number;
    usableQuantity: number; // Change this to usableQuantity
    status: string;
    percent?: number;
}
