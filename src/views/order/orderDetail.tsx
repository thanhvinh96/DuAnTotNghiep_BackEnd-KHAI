import React, { useEffect, useState } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Heading,
  Input,
  FormControl,
  FormLabel,
  Button,
  Select,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link as RouterLink } from 'react-router-dom';
import { OrderService } from '../../services/OrderService.ts';

interface IProduct {
  OrderItemID: number;
  ProductID: number;
  Quantity: number;
  Price: number;
  ProductName: string;
  ProductPrice: number;
  StockQuantity: number;
  CategoryID: number;
  Cost: number;
  CreationTime: string;
  Priority: number;
}

interface IOrderDetail {
  RecipientName: string;
  UserID: string | null;
  OrderID: number;
  TimeBuy: string;
  TotalAmount: number;
  TotalDiscount: number;
  OrderStatus: string;
  PaymentStatus: string;
  Products: IProduct[];
}

const OrderDetail: React.FC = () => {
  const [orderDetailData, setOrderDetailData] = useState<IOrderDetail>({
    RecipientName: '',
    UserID: null,
    OrderID: 0,
    TimeBuy: '',
    TotalAmount: 0,
    TotalDiscount: 0,
    OrderStatus: 'Đang xử lý',
    PaymentStatus: 'Chưa thanh toán',
    Products: [],
  });

  const headerColor = useColorModeValue("black", "white");
  const tableBg = useColorModeValue("white", "gray.800");
  const inputBg = useColorModeValue("gray.100", "gray.700");

  const showdataorderitems = async () => {
    try {
      const params = new URLSearchParams(window.location.search);
      const id:any = params.get('id');
      const res = await OrderService.getFullOrdersByOrderId(id);
      console.log(res);

      // Kiểm tra xem res có hợp lệ không
      if (res) {
        setOrderDetailData(res);
      } else {
        console.error("No data returned");
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };
  const [datapost, setdatapost] = useState<{
    OrderID: number;
    OrderStatus: string;
    PaymentStatus: string;
    UserID: string | null; // Có thể UserID là string hoặc null
    Product: string[]; // Khai báo kiểu cho Product
}>({
    OrderID: 0,
    OrderStatus: '',
    PaymentStatus: '',
    UserID: null, 
    Product: [] 
});

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { id, value } = e.target;
    setdatapost((prevState) => ({
      ...prevState,
      [id]: value,
      UserID: orderDetailData.UserID,
      OrderID: orderDetailData.OrderID, // Sử dụng giá trị OrderID từ orderDetailData
      Products: orderDetailData.Products, // Sử dụng giá trị OrderID từ orderDetailData
    }));
    
  };
  
  const handleUpdate = async () => {
    try {
      // console.log(datapost)
      console.log(orderDetailData.Products);
      const response = await OrderService.updateStatus(datapost);
      
      if (response.status===true) {
        alert("Cập nhật trạng thái đơn hàng và thanh toán thành công!");
        showdataorderitems(); // Tải lại thông tin đơn hàng
      } else {
        alert("Cập nhật không thành công. Vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Có lỗi xảy ra trong quá trình cập nhật.");
    }
  };

  useEffect(() => {
    showdataorderitems();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }} px={{ base: "20px", md: "40px" }}>
      <Heading as="h2" size="lg" mb="20px">
        Chi Tiết Đơn Hàng
      </Heading>

      {/* Card hiển thị thông tin người dùng */}
      <Box mb="20px" borderRadius="lg" boxShadow="md" p="20px" bg={tableBg}>
        <FormControl mb="10px">
          <FormLabel htmlFor="buyerName">Tên Người Mua</FormLabel>
          <Input id="buyerName" value={orderDetailData.RecipientName} readOnly bg={inputBg} />
        </FormControl>

        <FormControl mb="10px">
          <FormLabel htmlFor="userId">User ID</FormLabel>
          <Input id="userId" value={orderDetailData.UserID || ''} readOnly bg={inputBg} />
        </FormControl>

        <FormControl mb="20px">
          <FormLabel htmlFor="orderDate">Ngày Đặt Hàng</FormLabel>
          <Input
  id="orderDate"
  value={new Date(orderDetailData.TimeBuy).toLocaleString('vi-VN', {
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit', 
    hour12: false,
    timeZone: 'Asia/Ho_Chi_Minh' // Thêm tùy chọn này để chuyển đổi múi giờ
  })}
  readOnly
  bg={inputBg}
/>

        </FormControl>
       
        <FormControl mb="20px">
          <FormLabel htmlFor="totalAmount">Tổng Giá Trị Đơn Hàng</FormLabel>
          <Input id="totalAmount" value={formatCurrency(orderDetailData.TotalAmount)} readOnly bg={inputBg} />
        </FormControl>

        <FormControl mb="20px">
          <FormLabel htmlFor="totalDiscount">Tổng Giá Trị Đơn Hàng Sau Giảm Giá</FormLabel>
          <Input id="totalDiscount" value={formatCurrency(orderDetailData.TotalDiscount)} readOnly bg={inputBg} />
        </FormControl>

        {/* Form cập nhật trạng thái đơn hàng và thanh toán */}
        <FormControl mb="20px">
          <FormLabel htmlFor="orderStatus">Trạng Thái Đơn Hàng</FormLabel>
          <Select id="orderStatus" value={orderDetailData.OrderStatus} onChange={handleChange} bg={inputBg}>
            <option value="Đang xử lý">Đang xử lý</option>
            <option value="Đang vận chuyển">Đang vận chuyển</option>
            <option value="Đã giao">Đã giao</option>
            <option value="Đã nhận hàng">Đã nhận hàng</option>
            <option value="Đã hoàn tiền">Đã hoàn tiền</option>
          </Select>
        </FormControl>

        <FormControl mb="20px">
          <FormLabel htmlFor="paymentStatus">Trạng Thái Thanh Toán</FormLabel>

          <Select id="paymentStatus" value={orderDetailData.PaymentStatus} onChange={handleChange} bg={inputBg}>
            <option value="Đã thanh toán">Đã thanh toán</option>
            <option value="Chưa thanh toán">Chưa thanh toán</option>
            <option value="Đang xử lý">Đang xử lý</option>
            <option value="Đã hoàn tiền">Đã hoàn tiền</option>
          </Select>
        </FormControl>

        {/* Nút cập nhật */}
        <Button colorScheme="blue" onClick={handleUpdate}>
          Cập Nhật
        </Button>
      </Box>

      {/* Bảng hiển thị sản phẩm trong đơn hàng */}
      <Box w="100%" borderRadius="lg" boxShadow="md" p="20px">
        <Table variant="simple" bg={tableBg}>
          <Thead>
            <Tr>
              <Th color={headerColor}>Sản Phẩm</Th>
              <Th color={headerColor}>Số Lượng</Th>
              <Th color={headerColor}>Giá</Th>
              <Th color={headerColor}>Hành Động</Th>
            </Tr>
          </Thead>
          <Tbody>
            {orderDetailData.Products.map((product) => (
              <Tr key={product.OrderItemID}>
                <Td color={headerColor}>{product.ProductName}</Td>
                <Td color={headerColor}>{product.Quantity}</Td>
                <Td color={headerColor}>{formatCurrency(product.Price)}</Td>
                <Td color={headerColor}>
                  <RouterLink to={`/product/${product.ProductID}`}>
                    Xem Chi Tiết
                  </RouterLink>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

export default OrderDetail;
