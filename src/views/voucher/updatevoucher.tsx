import React, { useState, useEffect } from "react";
import { VoucherService } from '../../services/VoucherService.ts';
import { Voucher } from '../../model/voucherModel.ts';
import Swal from 'sweetalert2'; // Nhập SweetAlert2

import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Select,
  VStack,
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import { useLocation } from "react-router-dom";

export default function VoucherForm() {
  const location = useLocation(); 
  const query = new URLSearchParams(location.search);
  const id = query.get('id') || ""; // Lấy id từ query params

  const [voucher, setVoucher] = useState<Voucher>({
    VoucherID: "",
    Code: "",
    DiscountAmount: "",
    ExpiryDate: "",
    MinimumPurchaseAmount: "",
    quantityused: "",
    usablequantity: "", // Chỉnh sửa ở đây
    status: "",
    percent: "",
});
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalMessage, setModalMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchVoucher = async () => {
        try {
          const response: any = await VoucherService.getVoucherByID(id);
          console.log(response);
          setVoucher(response); // Cập nhật state voucher với dữ liệu lấy được
        } catch (error) {
          console.error('Error fetching voucher:', error);
        }
      };
      fetchVoucher();
    }
  }, [id]); // Gọi effect này khi id thay đổi

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setVoucher((prevVoucher) => ({
      ...prevVoucher,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(voucher);
    try {
      const  resposive = await VoucherService.updateVoucherByID(id, voucher); 
      console.log(resposive);
      setModalMessage("Voucher updated successfully!");
      setIsSuccess(true);
      onOpen();
    } catch (error) {
      console.error('Error updating voucher:', error);
      setModalMessage("Error updating voucher. Please try again.");
      setIsSuccess(false);
      onOpen();
    }
  };
  
  

  return (
    <Box pt={{ base: "20px", md: "80px", xl: "80px" }}>
      <Box
        bg="white"
        p={6}
        borderRadius="lg"
        boxShadow="md"
      >
        <Text fontSize="2xl" fontWeight="700" mb="20px">
          Cập Nhật Voucher
        </Text>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4} align="stretch">
            <FormControl id="Code">
              <FormLabel>Mã Voucher</FormLabel>
              <Input
                type="text"
                name="Code"
                value={voucher.Code}
                onChange={handleChange}
                placeholder="Nhập mã voucher"
              />
            </FormControl>

            <FormControl id="DiscountAmount">
              <FormLabel>Số tiền giảm giá</FormLabel>
              <Input
                type="number"
                name="DiscountAmount"
                value={voucher.DiscountAmount}
                onChange={handleChange}
                placeholder="Nhập số tiền giảm giá"
              />
            </FormControl>

            <FormControl id="ExpiryDate">
              <FormLabel>Thời Gian Hết Hạn</FormLabel>
              <Input
                type="date"
                name="ExpiryDate"
                value={voucher.ExpiryDate.split('T')[0]} // Chỉ lấy phần ngày từ ISO string để hiển thị trong input
                onChange={handleChange}
              />
              <Text mt={2}>{`Ngày hết hạn: ${formatDate(voucher.ExpiryDate)}`}</Text> {/* Hiển thị ngày đã định dạng */}
            </FormControl>

            <FormControl id="MinimumPurchaseAmount">
              <FormLabel>Số tiền mua tối thiểu</FormLabel>
              <Input
                type="number"
                name="MinimumPurchaseAmount"
                value={voucher.MinimumPurchaseAmount}
                onChange={handleChange}
                placeholder="Nhập số tiền mua tối thiểu"
              />
            </FormControl>

            {/* <FormControl id="quantityused">
              <FormLabel>Số Lượng Đã Sử Dụng</FormLabel>
              <Input
                type="number"
                name="quantityused"
                value={voucher.quantityused}
                onChange={handleChange}
                placeholder="Nhập số lượng đã sử dụng"
              />
            </FormControl> */}

            <FormControl id="usablequantity">
              <FormLabel>Số Lượng Có Thể Sử Dụng</FormLabel>
              <Input
                type="number"
                name="usablequantity"
                value={voucher.usablequantity}
                onChange={handleChange}
                placeholder="Nhập số lượng có thể sử dụng"
              />
            </FormControl>

            <FormControl id="status">
              <FormLabel>Trạng Thái</FormLabel>
              <Select name="status" value={voucher.status} onChange={handleChange}>
                <option value="Active">Mở</option>
                <option value="Inactive">Đóng</option>
              </Select>
            </FormControl>

            <FormControl id="percent">
              <FormLabel>Phần Trăm Giảm Giá</FormLabel>
              <Input
                type="number"
                name="percent"
                value={voucher.percent}
                onChange={handleChange}
                placeholder="Nhập phần trăm giảm giá"
              />
            </FormControl>

            <Button type="submit" colorScheme="blue"          borderRadius="md"
 width="full">
              Cập Nhật
            </Button>
          </VStack>
        </form>
      </Box>

      {/* Modal for success/error message */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{isSuccess ? "Success" : "Error"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>{modalMessage}</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
