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
  Select,
  useColorModeValue,
  Badge,

  Card,
} from "@chakra-ui/react";
import { Link as RouterLink } from 'react-router-dom';
import { OrderService } from '../../services/OrderService.ts';

export default function OrderManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [orderData, setOrderData] = useState<any[]>([]);
  const [filterDate, setFilterDate] = useState(""); // Lưu trữ ngày lọc
  const [statusFilter, setStatusFilter] = useState(""); // Lọc theo trạng thái
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [rowsPerPage] = useState(10); // Số hàng mỗi trang (10 hàng mỗi trang)

  const tableBg = useColorModeValue("white", "gray.800");

  const showdata = async () => {
    try {
      const res: any = await OrderService.getFullOrder();
      setOrderData(res);
      console.log(res);
    } catch (error) {
      console.error("Error fetching order data:", error);
    }
  };

  useEffect(() => {
    showdata();
  }, []);

  // Hàm lọc đơn hàng theo tìm kiếm, trạng thái, và ngày
  const filteredOrders = orderData.filter(order => {
    const orderDate = new Date(order.OrderDate).toLocaleDateString(); // Chuyển thành dạng string để so sánh
    const filterDateString = filterDate ? new Date(filterDate).toLocaleDateString() : null;

    const matchesStatus = statusFilter ? order.Status.toLowerCase() === statusFilter.toLowerCase() : true;
    const matchesSearchTerm = (typeof order.codeorder === 'string' && order.codeorder.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (typeof order.UserID === 'string' && order.UserID.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (typeof order.Address === 'string' && order.Address.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (typeof order.TotalAmount === 'number' && order.TotalAmount.toString().includes(searchTerm)) ||
      (typeof order.Status === 'string' && order.Status.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (typeof order.PaymentStatus === 'string' && order.PaymentStatus.toLowerCase().includes(searchTerm.toLowerCase()));

    // Kiểm tra ngày
    const matchesDate = filterDateString ? orderDate === filterDateString : true;

    return matchesSearchTerm && matchesStatus && matchesDate;
  });

  // Tính toán tổng số trang
  const totalPages = Math.ceil(filteredOrders.length / rowsPerPage);

  // Tính toán dữ liệu cho trang hiện tại
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstRow, indexOfLastRow);

  // Hàm chuyển trang
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Hàm reset bộ lọc
  const handleReset = () => {
    setSearchTerm("");
    setFilterDate("");
    setStatusFilter("");
    setCurrentPage(1); // Đặt lại về trang đầu tiên
  };
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };
  const getBadgeColor = (status:string) => {
    switch (status) {
      case 'Hoàn Thành':
        return 'green';
      case 'Đang Xử Lý':
        return 'yellow';
      case 'Đã Hủy':
        return 'red';
      case 'pending':
          return 'red';
      default:
        return 'gray';
    }
  };

  const getPaymentBadgeColor = (paymentStatus: string) => {
    console.log(paymentStatus)
    switch (paymentStatus) {
      case 'ĐÃ THANH TOÁN':
        return 'green';
      case 'Chưa thanh toán':
        return 'orange';
      case 'Đã Hoàn Trả':
        return 'blue';
      case 'ĐÃ GIAO':
          return 'green';
      case 'unpaid':
        return 'red';
      default:
        return 'gray';
    }
  };
  return (
    <Box pt={{ base: "20px", md: "80px", xl: "80px" }}>
      <Card p={5} mb={{ base: "0px", lg: "40px" }} style={{ height: 'auto', width: '100%' }}>
        <Box w="100%" bg={tableBg} borderRadius="lg" boxShadow="md" p="20px">
          <Input
            placeholder="Tìm kiếm đơn hàng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            mb="20px"
          />

          {/* Bộ lọc theo ngày */}
          <Input
            type="date"
            placeholder="Chọn ngày"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            mb="20px"
          />

          {/* Bộ lọc theo trạng thái */}
          <Select
            placeholder="Lọc theo trạng thái"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            mb="20px"
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="in-progress">In Progress</option>
          </Select>

          <Button colorScheme="red"  borderRadius="md" onClick={handleReset} mb="20px">
            Xóa Bộ Lọc
          </Button>

          <Box overflowX="auto">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th color="black">Code Order</Th>
                  <Th color="black">User ID</Th>
                  <Th color="black">Tên Người Mua</Th>
                  <Th color="black">Order Date</Th>
                  <Th color="black">Total Amount</Th>
                  <Th color="black">Loại Thanh Toán</Th>
                  <Th color="black">Status</Th>
                  <Th color="black">Payment Status</Th>
                  <Th color="black">Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {currentOrders.map((order) => (
                  <Tr key={order.OrderID}>
                    <Td>
                      <Badge colorScheme="green">
                        {order.codeorder}
                      </Badge></Td>
                    <Td>
                      <Badge colorScheme="yellow">
                        {order.UserID}
                      </Badge></Td>
                    <Td>
                      <Badge colorScheme="orange">
                        {order.Username}
                      </Badge></Td>
                    <Td>
                      <Badge colorScheme="purple"> {new Date(order.OrderDate).toLocaleString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: false,
                        timeZone: 'Asia/Ho_Chi_Minh' // Thêm tùy chọn này để chuyển đổi múi giờ

                      })}</Badge>
                    </Td>
                    <Td>
                      <Badge colorScheme="blue">
                        {order.PaymentType}
                      </Badge></Td>
                    <Td>
                      <Badge colorScheme="red">
                        {formatCurrency(order.TotalAmount)}
                      </Badge></Td>
                    <Td>
                    <Badge colorScheme={getBadgeColor(order.Status)}>{order.Status}</Badge>

                    </Td>
                    <Badge colorScheme={getPaymentBadgeColor(order.PaymentStatus)}>{order.PaymentStatus}</Badge>
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

          {/* Phân trang */}
          <Box mt="20px" textAlign="center">
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              isDisabled={currentPage === 1}
              mr="5px"
            >
              Previous
            </Button>
            <Button onClick={() => handlePageChange(currentPage + 1)} isDisabled={currentPage === totalPages}>
              Next
            </Button>
          </Box>
        </Box>
      </Card>
    </Box>
  );
}
