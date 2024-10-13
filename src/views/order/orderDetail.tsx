import React from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Heading,

  Text,
  Input,
  FormControl,
  FormLabel,
  useColorModeValue,
} from "@chakra-ui/react";

// Dữ liệu mẫu cho thông tin đơn hàng và người dùng
const orderDetailData = {
  OrderID: "001",
  BuyerName: "Nguyễn Văn A",
  UserID: "user_01",
  OrderDate: "2024-10-01",
  TotalAmount: "$100.00",
  Products: [
    {
      OrderItemID: "OI001",
      ProductID: "P001",
      Quantity: 2,
      Price: "$30.00",
    },
    {
      OrderItemID: "OI002",
      ProductID: "P002",
      Quantity: 1,
      Price: "$40.00",
    },
    {
      OrderItemID: "OI003",
      ProductID: "P003",
      Quantity: 1,
      Price: "$10.00",
    },
  ],
};

export default function OrderDetail() {
    
  const tableBg = useColorModeValue("white", "gray.800");

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }} px={{ base: "20px", md: "40px" }}>
      <Heading as="h2" size="lg" mb="20px">
        Chi Tiết Đơn Hàng
      </Heading>
      
      {/* Card hiển thị thông tin người dùng */}
      <Box
        w="100%"
        bg="gray.100"
        borderRadius="lg"
        boxShadow="md"
        p="20px"
        mb="20px"
      >
        <FormControl mb="10px">
          <FormLabel htmlFor="buyerName">Tên Người Mua</FormLabel>
          <Input id="buyerName" value={orderDetailData.BuyerName} readOnly />
        </FormControl>
        
        <FormControl mb="10px">
          <FormLabel htmlFor="userId">User ID</FormLabel>
          <Input id="userId" value={orderDetailData.UserID} readOnly />
        </FormControl>
        
        <FormControl mb="10px">
          <FormLabel htmlFor="orderId">Order ID</FormLabel>
          <Input id="orderId" value={orderDetailData.OrderID} readOnly />
        </FormControl>
        
        <FormControl mb="20px">
          <FormLabel htmlFor="orderDate">Order Date</FormLabel>
          <Input id="orderDate" value={orderDetailData.OrderDate} readOnly />
        </FormControl>
        
        <FormControl mb="20px">
          <FormLabel htmlFor="totalAmount">Tổng Giá Trị Đơn Hàng</FormLabel>
          <Input id="totalAmount" value={orderDetailData.TotalAmount} readOnly />
        </FormControl>
      </Box>

      {/* Bảng hiển thị sản phẩm trong đơn hàng */}
      <Box w="100%" bg={tableBg} borderRadius="lg" boxShadow="md" p="20px">
        <Table variant="simple">
          <Thead bg={tableBg} color="white">
            <Tr>
              <Th color={tableBg}>Order Item ID</Th>
              <Th color={tableBg}>Order ID</Th>
              <Th color={tableBg}>Product ID</Th>
              <Th color={tableBg}>Số Lượng</Th>
              <Th color={tableBg}>Giá</Th>
            </Tr>
          </Thead>
          <Tbody>
            {orderDetailData.Products.map((product) => (
              <Tr key={product.OrderItemID}>
                <Td>{product.OrderItemID}</Td>
                <Td>{orderDetailData.OrderID}</Td>
                <Td>{product.ProductID}</Td>
                <Td>{product.Quantity}</Td>
                <Td>{product.Price}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
}
