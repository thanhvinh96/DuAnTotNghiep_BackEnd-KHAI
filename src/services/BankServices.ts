import { BankAccount } from '../model/BankModel'; // Đảm bảo đường dẫn và tên file đúng

export class BankService {
    private apiUrl: string = 'http://localhost:3000/api/bank'; // URL của API

    // Thêm tài khoản ngân hàng
    async addBankAccount(account: BankAccount): Promise<BankAccount> {
        try {
            const response = await fetch(`${this.apiUrl}/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(account), // Chuyển đổi tài khoản thành JSON
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            return await response.json(); // Trả về dữ liệu JSON nếu thành công
        } catch (error) {
            console.error('Failed to add bank account:', error);
            throw error; // Ném lỗi để xử lý sau
        }
    }

    // Lấy danh sách tài khoản ngân hàng
    async getBankAccounts(): Promise<BankAccount[]> {
        try {
            const response = await fetch(this.apiUrl);

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            return await response.json(); // Trả về danh sách tài khoản ngân hàng
        } catch (error) {
            console.error('Failed to fetch bank accounts:', error);
            throw error; // Ném lỗi để xử lý sau
        }
    }

    // Lấy tài khoản ngân hàng theo ID
    async getBankAccountByID(id: string): Promise<BankAccount> {
        try {
            const response = await fetch(`${this.apiUrl}/${id}`); // URL để lấy theo ID

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            return await response.json(); // Trả về tài khoản ngân hàng
        } catch (error) {
            console.error('Failed to fetch bank account by ID:', error);
            throw error; // Ném lỗi để xử lý sau
        }
    }

    // Cập nhật tài khoản ngân hàng theo ID
    async updateBankAccount(id: string, account: BankAccount): Promise<BankAccount> {
        try {
            const response = await fetch(`${this.apiUrl}/update/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(account), // Chuyển đổi tài khoản thành JSON
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            return await response.json(); // Trả về dữ liệu JSON nếu thành công
        } catch (error) {
            console.error('Failed to update bank account:', error);
            throw error; // Ném lỗi để xử lý sau
        }
    }
    // Xóa tài khoản ngân hàng theo ID
    async deleteBankAccount(id: string): Promise<void> {
        try {
            const response = await fetch(`${this.apiUrl}/delete/${id}`, {
                method: 'POST',
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            // Không cần trả về gì nếu xóa thành công
        } catch (error) {
            console.error('Failed to delete bank account:', error);
            throw error; // Ném lỗi để xử lý sau
        }
    }
}
