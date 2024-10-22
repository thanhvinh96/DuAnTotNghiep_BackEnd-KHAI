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

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }} px={{ base: "20px", md: "40px" }}>
      <SimpleGrid columns={1} gap='20px'>
        <Box w="100%" bg={tableBg} borderRadius="lg" boxShadow="md" p="20px">
          <Input
            placeholder="Tìm kiếm đơn hàng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            mb="20px"
          />
          <Box overflowX="auto">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th color="black">Người Dùng</Th>
                  <Th color="black">Nội Dung</Th>
                  <Th color="black">Sản Phẩm</Th>
                  <Th color="black">Thời Gian</Th>
                  <Th color="black">Hành Động</Th> {/* Cột hành động */}
                </Tr>
              </Thead>
              <Tbody>
                {filteredOrders.map((order) => (
                  <Tr key={order.OrderID}> {/* Sử dụng OrderID làm key */}
                    <Td>{order.UserName}</Td> {/* Hiển thị tên người dùng */}
                    <Td>{order.Comment}</Td> {/* Hiển thị nội dung */}
                    <Td>
                    <Button
                        as={RouterLink} // Use RouterLink for navigation
                        to={`/product-details?id=${order.ProductID}`} // Route to the product detail page
                        colorScheme="teal"        
                      >
                        Xem sản phẩm
                      </Button>
                        </Td> {/* Hiển thị ID sản phẩm */}
                    <Td>{order.ReviewDate}</Td> {/* Hiển thị thời gian */}
                    <Td>
                      <Button
                        as={RouterLink}
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
