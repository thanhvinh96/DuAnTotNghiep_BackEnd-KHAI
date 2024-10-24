import React, { useState, useEffect } from 'react';
import {
  Box, Table, Thead, Tbody, Tr, Th, Td, Button, Image, Heading, SimpleGrid,
  useColorModeValue, FormControl, FormLabel, Input, VStack
} from "@chakra-ui/react";
import { BankAccount } from '../../model/BankModel.ts';
import { BankAccountController } from '../../controller/bankController.ts';
import Swal from 'sweetalert2';

export default function BankManagement() {
  const tableBg = useColorModeValue("white", "gray.800");

  const [bankData, setBankData] = useState<BankAccount[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [newBankAccount, setNewBankAccount] = useState<BankAccount>({
    id: Date.now(),
    account_number: '',
    account_holder: '',
    transaction_description: '',
    image_url: 'https://via.placeholder.com/50',
    bank_name: '',
    created_at: new Date(),
  });

  useEffect(() => {
    showdatabank();
  }, []);

  const showdatabank = async () => {
    try {
      const data = await BankAccountController.fetchBankAccounts();
      setBankData(data);
    } catch (error) {
      console.error('Error fetching bank accounts:', error);
    }
  };

  const handleAddBankAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      newBankAccount.account_number &&
      newBankAccount.account_holder &&
      newBankAccount.transaction_description &&
      newBankAccount.bank_name
    ) {
      try {
        let response;
        if (isEditing && editId) {
          response = await BankAccountController.updateBankAccountByID(editId, newBankAccount);
        } else {
          response = await BankAccountController.createBankAccount(newBankAccount);
        }

        if (response) {
          Swal.fire({
            title: 'Success!',
            text: isEditing ? 'Cập Nhật Tài Khoản Thành Công' : 'Thêm Tài Khoản Thành Công',
            icon: 'success',
            confirmButtonText: 'OK'
          });
          showdatabank();
          resetForm();
        }
      } catch (error) {
        console.error('Error saving bank account:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Có Lỗi Khi Lưu Tài Khoản',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    } else {
      alert("Vui lòng điền đầy đủ thông tin.");
    }
  };

  const handleEditBankAccount = (bank: BankAccount) => {
    setNewBankAccount(bank);
    setEditId(bank.id.toString());
    setIsEditing(true);
  };

  const handleDeleteBankAccount = async (id: string) => {
    try {
      const result = await Swal.fire({
        title: 'Bạn có chắc chắn?',
        text: "Bạn sẽ không thể khôi phục hành động này!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy',
      });

      if (result.isConfirmed) {
        await BankAccountController.deleteBankAccountByID(id);
        Swal.fire('Đã Xóa!', 'Tài Khoản Đã Bị Xóa.', 'success');
        showdatabank();
      }
    } catch (error) {
      console.error('Error deleting bank account:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Không Thể Xóa Tài Khoản',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  const resetForm = () => {
    setNewBankAccount({
      id: Date.now(),
      account_number: '',
      account_holder: '',
      transaction_description: '',
      image_url: 'https://via.placeholder.com/50',
      bank_name: '',
      created_at: new Date(),
    });
    setIsEditing(false);
    setEditId(null);
  };

  return (
    <Box w="100%" bg="white" borderRadius="lg" marginTop={100} boxShadow="md" p="20px">
      <VStack as="form" onSubmit={handleAddBankAccount} spacing={4} mb={10}>
        <FormControl>
          <FormLabel>Số Tài Khoản</FormLabel>
          <Input
            value={newBankAccount.account_number}
            onChange={(e) => setNewBankAccount({ ...newBankAccount, account_number: e.target.value })}
            placeholder="Nhập số tài khoản ngân hàng"
          />
        </FormControl>
        <FormControl>
          <FormLabel>Chủ tài khoản</FormLabel>
          <Input
            value={newBankAccount.account_holder}
            onChange={(e) => setNewBankAccount({ ...newBankAccount, account_holder: e.target.value })}
            placeholder="Nhập tên chủ tài khoản"
          />
        </FormControl>
        <FormControl>
          <FormLabel>Nội dung nạp tiền</FormLabel>
          <Input
            value={newBankAccount.transaction_description}
            onChange={(e) => setNewBankAccount({ ...newBankAccount, transaction_description: e.target.value })}
            placeholder="Nhập nội dung nạp tiền"
          />
        </FormControl>
        <FormControl>
          <FormLabel>Tên ngân hàng</FormLabel>
          <Input
            value={newBankAccount.bank_name}
            onChange={(e) => setNewBankAccount({ ...newBankAccount, bank_name: e.target.value })}
            placeholder="Nhập tên ngân hàng"
          />
        </FormControl>
        <Button colorScheme="teal" type="submit" w="full"           borderRadius="md"
        >
          {isEditing ? 'Cập Nhật Tài Khoản' : 'Thêm Tài Khoản'}
        </Button>
      </VStack>

      <SimpleGrid columns={1} gap="20px" mb="20px">
        <Box w="100%" bg={tableBg} borderRadius="lg" boxShadow="md" p="20px">
          <Table >
            <Thead>
              <Tr>
                <Th>Số Tài Khoản</Th>
                <Th>Chủ Tài Khoản</Th>
                <Th>Nội Dung Nạp Tiền</Th>
                <Th>Logo Ngân Hàng</Th>
                <Th>Tên Ngân Hàng</Th>
                <Th>Hành Động</Th>
              </Tr>
            </Thead>
            <Tbody>
              {bankData.map((bank) => (
                <Tr key={bank.id}>
                  <Td>{bank.account_number}</Td>
                  <Td>{bank.account_holder}</Td>
                  <Td>{bank.transaction_description}</Td>
                  <Td><Image src={bank.image_url} alt={bank.bank_name} boxSize="50px" /></Td>
                  <Td>{bank.bank_name}</Td>
                  <Td>
                    <Button colorScheme="blue" borderRadius="md"
                      onClick={() => handleEditBankAccount(bank)}>Sửa</Button>
                    <Button colorScheme="red" borderRadius="md"
                      ml={2} onClick={() => handleDeleteBankAccount(bank.id.toString())}>Xóa</Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </SimpleGrid>
    </Box>
  );
}
