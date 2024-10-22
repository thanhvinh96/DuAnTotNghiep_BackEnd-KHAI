import { BankAccount } from './../model/BankModel.ts'; // Removed duplicate and .ts extension
import { Request, Response } from 'express';
import { BankService } from '../services/BankServices.ts'; // Removed .ts extension

export class BankAccountController {
    private static bankService = new BankService(); // Create an instance of BankService

    // Fetch all bank accounts
    static async fetchBankAccounts(): Promise<BankAccount[]> {
        try {
            const accounts = await BankAccountController.bankService.getBankAccounts();
            return accounts;
        } catch (error) {
            console.error('Error fetching bank accounts:', error);
            throw new Error('Internal Server Error');
        }
    }

    // Create a new bank account
    static async createBankAccount(newAccount: BankAccount): Promise<BankAccount> {
        try {
            const account = await BankAccountController.bankService.addBankAccount(newAccount);
            return account;
        } catch (error) {
            console.error('Error creating bank account:', error);
            throw new Error('Error creating bank account');
        }
    }

    // Get bank account by ID
    static async getBankAccountByID(id: string): Promise<BankAccount | null> {
        try {
            const account = await BankAccountController.bankService.getBankAccountByID(id);
            return account;
        } catch (error) {
            console.error('Error fetching bank account:', error);
            throw new Error('Error fetching bank account by ID');
        }
    }

    // Delete bank account by ID
    static async deleteBankAccountByID(id: string): Promise<void> {
        try {
            await BankAccountController.bankService.deleteBankAccount(id);
        } catch (error) {
            console.error('Error deleting bank account:', error);
            throw new Error('Error deleting bank account');
        }
    }

    // Update bank account by ID
    static async updateBankAccountByID(id: string, updatedAccount: BankAccount): Promise<BankAccount | null> {
        try {
            const account = await BankAccountController.bankService.updateBankAccount(id, updatedAccount);
            return account;
        } catch (error) {
            console.error('Error updating bank account:', error);
            throw new Error('Error updating bank account');
        }
    }
}
