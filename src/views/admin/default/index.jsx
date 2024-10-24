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
  useColorModeValue,
  Icon,
  Select,
  
  Badge
} from "@chakra-ui/react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, LabelList, ResponsiveContainer } from 'recharts';
import { MdVerifiedUser, MdAttachMoney, MdAddShoppingCart } from "react-icons/md";
import { Link as RouterLink } from "react-router-dom";
import { OrderService } from '../../../services/OrderService.ts'; // Update the path if necessary
import React, { useState, useEffect } from "react";
import MiniStatistics from "components/card/MiniStatistics";
import IconBox from "components/icons/IconBox";

// Sample order report data
const orderReportData = [
  { name: 'Tháng 1', orders: 30, revenue: 1200 },
  { name: 'Tháng 2', orders: 45, revenue: 2300 },
  { name: 'Tháng 3', orders: 25, revenue: 800 },
  // ...other data
];

const UserReports = () => {
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const headerColor = useColorModeValue("gray.800", "white");
  const tableBg = useColorModeValue("white", "gray.800");
  const brandColor = useColorModeValue("brand.500", "white");
  const [orderData, setOrderData] = useState([]); 
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10); // Số lượng đơn hàng hiển thị
  const [currentPage, setCurrentPage] = useState(1);

  // Filter orders based on search term
  const filteredOrders = orderData.filter(order => {
    const codeorder = order.codeorder || "";  // Default to empty string if undefined
    const buyerName = order.BuyerName || "";  // Default to empty string if undefined
    return (
      codeorder.toLowerCase().includes(searchTerm.toLowerCase()) ||
      buyerName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Calculate the orders to show based on pagination
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const showdata = async () => {
    try {
      const res = await OrderService.getFullOrder();
      setOrderData(res);
      console.log(res);
    } catch (error) {
      console.error("Error fetching order data:", error);
    }
  };
  const [datacountUser, setdatacountUser] = useState(0); // Đặt giá trị mặc định là 0 thay vì []
  const [datacountorder,setdatacountorder] = useState(0);
  const [datacountusd,setdatacountusdr] = useState(0);
  const formattedValue = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
}).format(datacountusd); // Định dạng số theo tiền tệ Việt Nam
const countOrderMonth = [
  { type: 'Đơn Hàng', orders: 50 },
  { type: 'Doanh Thu', revenue: 5000 },
];
  const countUser = async () => {
      try {
          const res = await fetch('http://localhost:3000/api/user/get-count');
          const data = await res.json(); // Chuyển đổi phản hồi sang JSON
  
          console.log("Dữ liệu trả về:", data); // In ra dữ liệu nhận được
          if (data) {
              setdatacountUser(data.totalUsers); // Cập nhật state với số lượng người dùng
          }
      } catch (error) {
          console.error("Lỗi khi lấy dữ liệu người dùng:", error); // In lỗi nếu có
      }
  };
  const [countOrdersums, setCountOrdersum] = useState([
    { month: "", totalOrders: 0, totalRevenue: 0 }
]);  const countOrdersum = async () => {
    try {
        const res = await fetch('http://localhost:3000/api/order/get-sum-moth');
        const data = await res.json(); // Chuyển đổi phản hồi sang JSON

        console.log("Dữ liệu trả về:", data); // In ra dữ liệu nhận được
        if (data) {
          setCountOrdersum(data.monthlySummary); // Cập nhật state với số lượng người dùng
        }
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu người dùng:", error); // In lỗi nếu có
    }
};
  const countOrder = async () => {
    try {
        const res = await fetch('http://localhost:3000/api/order/get-total-orders');
        const data = await res.json(); // Chuyển đổi phản hồi sang JSON

        console.log("Dữ liệu trả về:", data); // In ra dữ liệu nhận được
        if (data) {
            setdatacountorder(data.totalUnpaid); // Cập nhật state với số lượng người dùng
            setdatacountusdr(data.totalPaid)
        }
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu người dùng:", error); // In lỗi nếu có
    }
};
  useEffect(() => {
      showdata(); // Gọi hàm showdata nếu cần
      countUser(); // Gọi hàm countUser
      countOrder();
      countOrdersum();
  }, []);
  
  const formatCurrency = () => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format();
  };
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3, "2xl": 3 }} gap='20px' mb='20px'>
        
     <MiniStatistics
  startContent={
    <IconBox
      w='56px'
      h='56px'
      bg={boxBg}
      icon={
        <Icon w='32px' h='32px' as={MdVerifiedUser} color={brandColor} />
      }
      borderRadius="0" // Set borderRadius to 0 for a square shape
    />
  }
  name='Tổng Thành Viên'
  value={`${datacountUser}`}
/>


        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg={boxBg}
              icon={
                <Icon w='32px' h='32px' as={MdAddShoppingCart} color={brandColor} />
              }
            />
          }
          name='Đơn Hàng Chưa Xử Lý'
          value={`${datacountorder}`}
          borderRadius="4px" // Adjust this value for more or less rounding

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
          name='Danh Thu'
          value={`${formattedValue}`}
          borderRadius="4px" // Adjust this value for more or less rounding

          />
      </SimpleGrid>

      <Box pt={{}}>
        <SimpleGrid columns={1} gap='20px'>
          {/* <Box w="100%" bg={tableBg} borderRadius="lg" boxShadow="md" p="20px">
            <Input
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              mb="20px"
            />

            <Select
              placeholder="Số lượng hiển thị"
              mb="20px"
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
            </Select>

            <Box overflowX="auto">
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
  {paginatedOrders.map((order) => (
    <Tr key={order.OrderID}>
      <Td>
        <Badge colorScheme="blue">{order.codeorder}</Badge>
      </Td>
      
      <Td>
        <Badge colorScheme="gray">{order.UserID}</Badge>
      </Td>

      <Td>
        <Badge colorScheme="teal">{order.BuyerName}</Badge>
      </Td>

      <Td>
        <Badge colorScheme="purple">
          {new Date(order.OrderDate).toLocaleString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          })}
        </Badge>
      </Td>

      <Td>
        <Badge colorScheme="green">{formatCurrency(order.TotalAmount)}</Badge>
      </Td>

      <Td>
        <Badge colorScheme={order.Status === 'Completed' ? 'green' : 'red'}>
          {order.Status}
        </Badge>
      </Td>

      <Td>
        <Badge colorScheme={order.PaymentStatus === 'Paid' ? 'green' : 'red'}>
          {order.PaymentStatus}
        </Badge>
      </Td>

      <Td>
        <Button
          as={RouterLink}
          to={`/admin/order-detail?id=${order.OrderID}`}
          colorScheme="blue"
          borderRadius="md"
        >
          Xem chi tiết
        </Button>
      </Td>
    </Tr>
  ))}
</Tbody>

              </Table>
            </Box>
          </Box> */}

          {/* Order and Revenue Chart */}
          <Box w="100%" bg="white" borderRadius="lg" boxShadow="md" p="20px">
      <h2 style={{ fontSize: "24px", marginBottom: "20px" }}>Báo cáo Đơn Hàng và Doanh Thu</h2>
      
      {/* Biểu đồ tổng hàng tháng */}
      <h3 style={{ fontSize: "20px", marginBottom: "10px" }}>Tổng Đơn Hàng và Doanh Thu theo Tháng</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={countOrdersums}>
          <XAxis dataKey="month" />
          <YAxis width={80} tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
          <Tooltip />
          <Legend />
          <CartesianGrid strokeDasharray="3 3" />
          <Bar dataKey="totalOrders" fill="#8884d8" name="Số Đơn Hàng" barSize={20}>
            <LabelList dataKey="totalOrders" position="top" />
          </Bar>
          <Bar dataKey="totalRevenue" fill="#82ca9d" name="Doanh Thu" barSize={20}>
            <LabelList dataKey="totalRevenue" position="top" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Biểu đồ đơn hàng và doanh thu cho tháng cụ thể */}
      {/* <h3 style={{ fontSize: "20px", margin: "20px 0 10px" }}>Đơn Hàng và Doanh Thu cho Tháng Cụ Thể</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={countOrderMonth}>
          <XAxis dataKey="type" />
          <YAxis width={80} tickFormatter={(value) => `${value} đ`} />
          <Tooltip />
          <Legend />
          <CartesianGrid strokeDasharray="3 3" />
          <Bar dataKey="orders" fill="#8884d8" name="Số Đơn Hàng">
            <LabelList dataKey="orders" position="top" />
          </Bar>
          <Bar dataKey="revenue" fill="#82ca9d" name="Doanh Thu">
            <LabelList dataKey="revenue" position="top" />
          </Bar>
        </BarChart>
      </ResponsiveContainer> */}
    </Box>
        </SimpleGrid>
      </Box>
    </Box>
  );
}

export default UserReports;
