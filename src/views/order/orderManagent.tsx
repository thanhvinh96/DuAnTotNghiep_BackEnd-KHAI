import React, { useState } from 'react';
import {
  Box,
  Button,
  Input,
  SimpleGrid,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Link,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link as RouterLink } from 'react-router-dom'; // Nhập Link từ React Router nếu bạn sử dụng

// Dữ liệu mẫu cho bảng
const orderData = [
  {
    OrderID: "001",
    CodeOrder: "CO001",
    UserID: "user_01",
    BuyerName: "Nguyễn Văn A",
    OrderDate: "2024-10-01",
    TotalAmount: "$100.00",
    Status: "Completed",
    PaymentStatus: "Paid",
    VoucherID: "VOU123",
    TotalDiscount: "$10.00",
  },
  {
    OrderID: "002",
    CodeOrder: "CO002",
    UserID: "user_02",
    BuyerName: "Trần Thị B",
    OrderDate: "2024-10-02",
    TotalAmount: "$200.00",
    Status: "Pending",
    PaymentStatus: "Unpaid",
    VoucherID: "VOU456",
    TotalDiscount: "$5.00",
  },
  // Thêm nhiều dữ liệu hơn nếu cần
];

export default function OrderManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const tableBg = useColorModeValue("white", "gray.800");

  // Hàm lọc đơn hàng theo từ khóa tìm kiếm
  const filteredOrders = orderData.filter(order => {
    return (
      order.OrderID.includes(searchTerm) ||
      order.CodeOrder.includes(searchTerm) || // Tìm kiếm theo CodeOrder
      order.UserID.includes(searchTerm) ||
      order.BuyerName.toLowerCase().includes(searchTerm.toLowerCase()) || // Tìm kiếm theo tên người mua
      order.OrderDate.includes(searchTerm) ||
      order.TotalAmount.includes(searchTerm) ||
      order.Status.includes(searchTerm) ||
      order.PaymentStatus.includes(searchTerm) ||
      order.VoucherID.includes(searchTerm) ||
      order.TotalDiscount.includes(searchTerm)
    );
  });
  const headerColor = useColorModeValue("white", "gray.800"); // Màu cho tiêu đề

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }} px={{ base: "20px", md: "40px" }}>
      {/* Input tìm kiếm */}
      <SimpleGrid columns={1} gap='20px'>
        <Box w="100%" bg={tableBg} borderRadius="lg" boxShadow="md" p="20px">
          <Input
            placeholder="Tìm kiếm đơn hàng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            mb="20px"
          />
          <Box overflowX="auto"> {/* Thêm Box với overflowX để cuộn ngang */}
            <Table variant="simple">
              <Thead>
                <Tr>
                <Th color={headerColor}>Order ID</Th>
                  <Th color={headerColor}>Code Order</Th> {/* Cột mới cho CodeOrder */}
                  <Th color={headerColor}>User ID</Th>
                  <Th color={headerColor}>Tên Người Mua</Th> {/* Cột mới cho tên người mua */}
                  <Th color={headerColor}>Order Date</Th>
                  <Th color={headerColor}>Total Amount</Th>
                  <Th color={headerColor}>Status</Th>
                  <Th color={headerColor}>Payment Status</Th>
                  <Th color={headerColor}>Voucher ID</Th>
                  <Th color={headerColor}>Total Discount</Th>
                  <Th color={headerColor}>Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredOrders.map((order) => (
                  <Tr key={order.OrderID}>
                    <Td>{order.OrderID}</Td>
                    <Td>{order.CodeOrder}</Td> {/* Hiển thị CodeOrder */}
                    <Td>{order.UserID}</Td>
                    <Td>{order.BuyerName}</Td> {/* Hiển thị tên người mua */}
                    <Td>{order.OrderDate}</Td>
                    <Td>{order.TotalAmount}</Td>
                    <Td>{order.Status}</Td>
                    <Td>{order.PaymentStatus}</Td>
                    <Td>{order.VoucherID}</Td>
                    <Td>{order.TotalDiscount}</Td>
                    <Td>
                    <Link 
                        as={RouterLink} // Sử dụng RouterLink để điều hướng
                        to={`/admin/order-detail?id=${order.OrderID}`} // Đường dẫn tới trang chi tiết
                        color="blue.500" 
                        fontWeight="bold"
                      >
                        Xem chi tiết
                      </Link>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </Box>
      </SimpleGrid>
    </Box>
  );
}
