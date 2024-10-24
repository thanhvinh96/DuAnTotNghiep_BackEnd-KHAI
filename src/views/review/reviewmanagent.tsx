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
  Card,
  Badge,
  Td,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link as RouterLink } from 'react-router-dom'; 
import { ReviewService } from '../../services/ReviewService.ts';

export default function OrderManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [orderData, setOrderData] = useState<any[]>([]);
  const tableBg = useColorModeValue("white", "gray.800");

  const showdata = async () => {
    try {
      const res: any = await ReviewService.getAllReviews();
      setOrderData(res);
      console.log(res);
    } catch (error) {
      console.error("Error fetching order data:", error);
    }
  };

  useEffect(() => {
    showdata();
  }, []);

  const filteredOrders = orderData.filter(order => {
    return (
      (typeof order.UserName === 'string' && order.UserName.toLowerCase().includes(searchTerm.toLowerCase())) || // Tìm kiếm theo tên người dùng
      (typeof order.Comment === 'string' && order.Comment.toLowerCase().includes(searchTerm.toLowerCase())) || // Tìm kiếm theo nội dung
      (typeof order.ProductID === 'string' && order.ProductID.toLowerCase().includes(searchTerm.toLowerCase())) || // Tìm kiếm theo ID sản phẩm
      (typeof order.ReviewDate === 'string' && order.ReviewDate.toLowerCase().includes(searchTerm.toLowerCase())) // Tìm kiếm theo thời gian
    );
  });
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };
  return (
    <Box
    pt={{ base: "130px", md: "80px", xl: "80px" }}
  >
    <Card
      p={8}
      mb={{ base: "20px", lg: "40px" }}
      borderRadius="lg"
      boxShadow="lg"
      bg="white"
      style={{ width: '100%' }}
    >
      <Box w="100%" borderRadius="lg" boxShadow="md" p="20px">
        <Input
          placeholder="Tìm kiếm đơn hàng..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          mb="20px"
          borderColor="gray.300"
          focusBorderColor="teal.500"
          borderRadius="md"
          size="lg"
        />
  
        <Box overflowX="auto">
          <Table variant="striped" colorScheme="gray" size="md">
            <Thead bg="gray.100">
              <Tr>
                <Th color="gray.700">Người Dùng</Th>
                <Th color="gray.700">Nội Dung</Th>
                <Th color="gray.700">Sản Phẩm</Th>
                <Th color="gray.700">Thời Gian</Th>
                <Th color="gray.700">Hành Động</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredOrders.map((order) => (
                <Tr key={order.OrderID} _hover={{ bg: "gray.50" }}>
                  {/* <Td>{order.UserName}</Td>
                  <Td>{order.Comment}</Td> */}
                  <Td>
                      <Badge colorScheme="orange">
                        {order.UserName}
                      </Badge></Td>                  <Td>
                      <Badge colorScheme="blue">

                        {order.Comment}
                        </Badge></Td>
                  <Td>
                    <Button
                      as={RouterLink}
                      to={`/product-details?id=${order.ProductID}`}
                      colorScheme="teal"
                      size="sm"
                      borderRadius="md"
                      >
                      Xem sản phẩm
                    </Button>
                  </Td>
                  <Td>{new Date(order.ReviewDate).toLocaleString('vi-VN', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: false 
})}</Td>                  <Td>
                    <Button
                      as={RouterLink}
                      to={`/admin/order-detail?id=${order.OrderID}`}
                      colorScheme="red"
                      size="sm"
                      borderRadius="md"

                    >
                      Xóa Bình Luận
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Box>
    </Card>
  </Box>
  
  );
}
