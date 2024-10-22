import React, { useEffect, useState } from 'react';
import {
  Box,
  Input,
  SimpleGrid,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Link,
  Button ,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link as RouterLink } from 'react-router-dom'; // Nhập Link từ React Router nếu bạn sử dụng
import { OrderService } from '../../services/OrderService.ts';

export default function OrderManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [orderData, setOrderData] = useState<any[]>([]);
  const tableBg = useColorModeValue("white", "gray.800");

  const showdata = async () => {
    try {
      const res: any = await OrderService.getFullOrder(); // Đảm bảo sử dụng await
      setOrderData(res);
      console.log(res);
    } catch (error) {
      console.error("Error fetching order data:", error);
    }
  };

  useEffect(() => {
    showdata();
  }, []);

  // Hàm lọc đơn hàng theo từ khóa tìm kiếm
 // Hàm lọc đơn hàng theo từ khóa tìm kiếm
const filteredOrders = orderData.filter(order => {
  return (
    (typeof order.codeorder === 'string' && order.codeorder.toLowerCase().includes(searchTerm.toLowerCase())) || // Tìm kiếm theo codeorder
    (typeof order.UserID === 'string' && order.UserID.toLowerCase().includes(searchTerm.toLowerCase())) || // Tìm kiếm theo UserID
    (typeof order.Address === 'string' && order.Address.toLowerCase().includes(searchTerm.toLowerCase())) || // Tìm kiếm theo địa chỉ
    (typeof order.OrderDate === 'string' && order.OrderDate.toLowerCase().includes(searchTerm.toLowerCase())) || // Tìm kiếm theo Order Date
    (typeof order.TotalAmount === 'number' && order.TotalAmount.toString().includes(searchTerm)) || // Tìm kiếm theo Total Amount
    (typeof order.TotalDiscount === 'number' && order.TotalDiscount.toString().includes(searchTerm)) || // Tìm kiếm theo Total Discount
    (typeof order.Status === 'string' && order.Status.toLowerCase().includes(searchTerm.toLowerCase())) || // Tìm kiếm theo Status
    (typeof order.PaymentStatus === 'string' && order.PaymentStatus.toLowerCase().includes(searchTerm.toLowerCase())) // Tìm kiếm theo Payment Status
  );
});


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
                  <Th color="black">Code Order</Th>
                  <Th color="black">User ID</Th>
                  <Th color="black">Tên Người Mua</Th>
                  <Th color="black">Order Date</Th>
                  <Th color="black">Total Amount</Th>
                  <Th color="black">Status</Th>
                  <Th color="black">Payment Status</Th>
                  <Th color="black">Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredOrders.map((order) => (
                  <Tr key={order.OrderID}>
                    <Td>{order.codeorder}</Td> {/* Hiển thị codeorder */}
                    <Td>{order.UserID}</Td>
                    <Td>{order.Username}</Td> {/* Hiển thị tên người mua */}
                    <Td>{order.OrderDate}</Td>
                    <Td>{order.TotalAmount}</Td>
                    <Td>{order.Status}</Td>
                    <Td>{order.PaymentStatus}</Td>
                    <Td>
  <Button
    as={RouterLink} // Use RouterLink for navigation
    to={`/admin/order-detail?id=${order.OrderID}`} // Route to the detail page
    colorScheme="teal"        
  >
    Xem chi tiết
  </Button>
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
