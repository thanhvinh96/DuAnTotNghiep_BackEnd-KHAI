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
  Icon,
} from "@chakra-ui/react";
// Assets
import Usa from "assets/img/dashboards/usa.png";
// Custom components
import MiniStatistics from "components/card/MiniStatistics";
import IconBox from "components/icons/IconBox";
import React, { useState } from "react";
import { MdAddTask, MdAttachMoney, MdBarChart, MdFileCopy } from "react-icons/md";
import { Link as RouterLink } from "react-router-dom";

// Sample data for orders
const tableDataComplex = [
  {
    OrderID: 1,
    CodeOrder: "ORD123",
    UserID: "USR001",
    BuyerName: "Nguyễn Văn A",
    OrderDate: "2024-09-01",
    TotalAmount: "$100",
    Status: "Completed",
    PaymentStatus: "Paid",
    VoucherID: "VOU001",
    TotalDiscount: "$10",
  },
  {
    OrderID: 2,
    CodeOrder: "ORD124",
    UserID: "USR002",
    BuyerName: "Trần Thị B",
    OrderDate: "2024-09-02",
    TotalAmount: "$200",
    Status: "Pending",
    PaymentStatus: "Unpaid",
    VoucherID: "VOU002",
    TotalDiscount: "$20",
  },
  {
    OrderID: 3,
    CodeOrder: "ORD125",
    UserID: "USR003",
    BuyerName: "Lê Văn C",
    OrderDate: "2024-09-03",
    TotalAmount: "$300",
    Status: "Shipped",
    PaymentStatus: "Paid",
    VoucherID: "VOU003",
    TotalDiscount: "$30",
  },
  // Add more sample data as needed
];

export default function UserReports() {
  // Chakra Color Mode
  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const headerColor = useColorModeValue("gray.800", "white");
  const tableBg = useColorModeValue("white", "gray.800");

  // State for search term
  const [searchTerm, setSearchTerm] = useState("");

  // Sample data for orders
  const orders = tableDataComplex; // Using the embedded sample data

  // Filter orders based on search term
  const filteredOrders = orders.filter(order =>
    (order.CodeOrder && order.CodeOrder.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (order.BuyerName && order.BuyerName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 3, "2xl": 3 }}
        gap='20px'
        mb='20px'
      >
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg={boxBg}
              icon={
                <Icon w='32px' h='32px' as={MdBarChart} color={brandColor} />
              }
            />
          }
          name='Earnings'
          value='$350.4'
        />

        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg={boxBg}
              icon={
                <Icon w='32px' h='32px' as={MdAttachMoney} color={brandColor} />
              }
            />
          }
          name='Spend this month'
          value='$642.39'
        />

        <MiniStatistics growth='+23%' name='Sales' value='$574.34' />
      </SimpleGrid>

      <Box pt={{}}>
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
                    <Th color={headerColor}>Order ID</Th>
                    <Th color={headerColor}>Code Order</Th>
                    <Th color={headerColor}>User ID</Th>
                    <Th color={headerColor}>Tên Người Mua</Th>
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
                      <Td>{order.CodeOrder}</Td>
                      <Td>{order.UserID}</Td>
                      <Td>{order.BuyerName}</Td>
                      <Td>{order.OrderDate}</Td>
                      <Td>{order.TotalAmount}</Td>
                      <Td>{order.Status}</Td>
                      <Td>{order.PaymentStatus}</Td>
                      <Td>{order.VoucherID}</Td>
                      <Td>{order.TotalDiscount}</Td>
                      <Td>
                        <Link
                          as={RouterLink}
                          to={`/admin/order-detail?id=${order.OrderID}`}
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
    </Box>
  );
}
