import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2'; // Nhập SweetAlert2
import { VoucherService } from '../../services/VoucherService.ts';
import { Voucher } from '../../model/voucherModel.ts';
import {
    Box,
    Button,
    Card,
    FormControl,
    Badge,
    FormLabel,
    Grid,
    Input,
    Table,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    Text,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    useDisclosure,
    InputGroup,
    InputRightElement,
    useColorModeValue,

    IconButton,
    Select as ChakraSelect,
} from "@chakra-ui/react";
import { SearchIcon } from '@chakra-ui/icons';
import { Alert } from 'bootstrap';
import { useNavigate } from 'react-router-dom';

export default function VoucherManagement() {
    const navigate = useNavigate();

    const tableBg = useColorModeValue("white", "gray.800");

    const { isOpen, onOpen, onClose } = useDisclosure(); // Modal hooks
    const [showdata, setShowdata] = useState<Voucher[]>([]);
    const [filteredVouchers, setFilteredVouchers] = useState<Voucher[]>([]);
    const [newVoucher, setNewVoucher] = useState<Voucher>({
        Code: '',
        ExpiryDate: '',
        MinimumPurchaseAmount: 0,
        usablequantity: 0,  // Change to lowercase "q"
        status: '',
        percent: 0,
        quantityused: 0,
        VoucherID: ''
    });

    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const fetchData = async () => {
        try {
            const data = await VoucherService.getAllVouchers();
            // const data: Voucher[] = await response.json();

            setShowdata(data);
            setFilteredVouchers(data); // Set initial filtered vouchers to show all
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []); // Chỉ chạy 1 lần khi component được mount

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const filterVouchers = () => {
        const filtered = showdata.filter((voucher) =>
            voucher.Code.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredVouchers(filtered);
        setCurrentPage(1); // Reset to first page when searching
    };

    const totalPages = Math.ceil(filteredVouchers.length / itemsPerPage);
    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const currentVouchers = filteredVouchers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        let validatedValue: string | number = value;

        if (name === "percent") {
            validatedValue = Math.max(1, Math.min(100, Number(value))); // Validate the value between 1 and 100
        }

        setNewVoucher((prevState) => ({
            ...prevState,
            [name]: validatedValue, // Use validatedValue here
        }));
    };
    const deletevoucher = async (id: string) => {
        // Hiển thị thông báo xác nhận
        Swal.fire({
            title: 'Bạn có chắc chắn?',
            text: 'Bạn có muốn xóa voucher này không?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Có, xóa nó!',
            cancelButtonText: 'Hủy'
        }).then(async (result) => {
            if (result.isConfirmed) {
                // Nếu người dùng nhấn "OK", thực hiện hành động xóa
                try {
                    const response: any = await VoucherService.deleteVoucherByID(id); // Giả sử hàm deleteVoucher thực hiện xóa
                    console.log(response)

                    if (response.status === true) {
                        Swal.fire(
                            'Đã Xóa!',
                            'Voucher đã được xóa thành công.',
                            'success'
                        );
                        // Gọi lại dữ liệu hoặc cập nhật danh sách sau khi xóa
                        const updatedData = await VoucherService.getAllVouchers();
                        setShowdata(updatedData); // Cập nhật lại dữ liệu
                    } else {
                        Swal.fire('Lỗi!', 'Không thể xóa voucher. Vui lòng thử lại.', 'error');
                    }
                } catch (error) {
                    Swal.fire('Lỗi!', 'Xảy ra lỗi khi xóa voucher. Vui lòng thử lại.', 'error');
                    console.error('Lỗi khi xóa voucher:', error);
                }
            }
        });
    };
    const updatevoucher = async (id: string) => {
        navigate(`/admin/voucher-update?id=${id}`);

    };
    const handleAddVoucher = async () => {
        const newVoucherData: Voucher = {
            ...newVoucher,
            MinimumPurchaseAmount: parseFloat(newVoucher.MinimumPurchaseAmount.toString()),
            usablequantity: parseInt(newVoucher.usablequantity.toString(), 10),
            percent: parseFloat(newVoucher.percent.toString()),
        };

        try {
            const response = await VoucherService.createVoucher(newVoucher);

            if (response) {
                // If successfully added, update the vouchers state

                Swal.fire({
                    title: 'Thêm Thành Công',
                    text: 'Thêm Thành Công.',
                    icon: 'success',
                    confirmButtonText: 'Đóng',
                });
                filterVouchers(); // Reapply the filter to include the new voucher
                onClose(); // Close the modal
            } else {
                Swal.fire({
                    title: 'Thêm Thất Bại',
                    text: 'Thêm thất bại! Vui lòng thử lại.',
                    icon: 'error',
                    confirmButtonText: 'Đóng',
                });
                filterVouchers(); // Reapply the filter to include the new voucher
                onClose(); // Close the modal
            }
        } catch (error) {
            Swal.fire({
                title: 'Thêm Thất Bại',
                text: 'Thêm thất bại! Vui lòng thử lại.',
                icon: 'error',
                confirmButtonText: 'Đóng',
            });
            console.error('Error adding voucher:', error);
        }
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(value);
    };
    return (
        <Box pt={{ base: "20px", md: "80px", xl: "80px" }}>
            <Card p={5} mb={{ base: "0px", lg: "40px" }}>
                <div className="card-header">
                    <Button
                        onClick={onOpen} // Open modal on click
                        colorScheme="blue"
                        size="sm"
                        borderRadius="md"

                    >
                        <i className="ri-add-line fw-semibold align-middle"></i> Thêm voucher mới
                    </Button>
                </div>

                {/* Thanh tìm kiếm */}
                <Grid templateColumns="1fr 3fr" gap={4} mt={4}>
                    <FormControl>
                        <FormLabel>Tìm kiếm theo mã voucher</FormLabel>
                        <InputGroup>
                            <Input
                                value={searchQuery}
                                onChange={handleSearchChange}
                                placeholder="Nhập mã voucher"
                            />
                            <InputRightElement>
                                <IconButton
                                    aria-label="Search voucher"
                                    icon={<SearchIcon />}
                                    onClick={filterVouchers}
                                />
                            </InputRightElement>
                        </InputGroup>
                    </FormControl>
                </Grid>

                {/* Modal for adding new voucher */}
                <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Thêm Voucher Mới</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            {/* Single Column Layout for Form Fields */}
                            <Grid templateColumns="1fr" gap={6}>
                                <FormControl>
                                    <FormLabel>Mã Voucher</FormLabel>
                                    <Input
                                        name="Code"
                                        value={newVoucher.Code}
                                        onChange={handleInputChange}
                                        type="text"
                                        placeholder="Nhập mã voucher"
                                    />

                                </FormControl>
                                {/* <FormControl>
                                    <FormLabel>Số tiền giảm giá</FormLabel>
                                    <Input
                                        name="DiscountAmount"
                                        value={newVoucher.DiscountAmount}
                                        onChange={handleInputChange}
                                        type="number"
                                        placeholder="Nhập số tiền giảm giá"
                                    />
                                </FormControl> */}
                                <FormControl>
                                    <FormLabel>Ngày hết hạn</FormLabel>
                                    <Input
                                        name="ExpiryDate"
                                        value={newVoucher.ExpiryDate}
                                        onChange={handleInputChange}
                                        type="date"
                                    />
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Số tiền mua tối thiểu</FormLabel>
                                    <Input
                                        name="MinimumPurchaseAmount"
                                        value={newVoucher.MinimumPurchaseAmount}
                                        onChange={handleInputChange}
                                        type="number"
                                        placeholder="Nhập số tiền mua tối thiểu"
                                    />
                                </FormControl>

                                <FormControl>
                                    <FormLabel>Phần trăm Giảm Giá</FormLabel>
                                    <Input
                                        name="percent"
                                        value={newVoucher.percent}
                                        onChange={handleInputChange}
                                        type="number"
                                        placeholder="Nhập phần trăm giảm giá"
                                        min={1}
                                        max={100}
                                    />
                                </FormControl>


                                <FormControl>
                                    <FormLabel>Số lượng có thể dùng</FormLabel>
                                    <Input
                                        name="usablequantity"
                                        value={newVoucher.usablequantity}
                                        onChange={handleInputChange}
                                        type="number"
                                        placeholder="Nhập số lượng có thể dùng"
                                    />
                                </FormControl>
                            </Grid>

                            {/* Trạng thái voucher */}
                            <Grid templateColumns="1fr" gap={6} mt={4}>
                                <FormControl>
                                    <FormLabel>Trạng thái</FormLabel>
                                    <ChakraSelect
                                        name="status"
                                        value={newVoucher.status}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Chọn trạng thái</option>
                                        <option value="active">Kích hoạt</option>
                                        <option value="inactive">Ngừng hoạt động</option>
                                    </ChakraSelect>
                                </FormControl>
                            </Grid>
                        </ModalBody>
                        <ModalFooter>
                            <Button colorScheme="blue" onClick={handleAddVoucher}>
                                Thêm Voucher
                            </Button>
                            <Button variant="ghost" onClick={onClose}>
                                Hủy
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>

                {/* Bảng danh sách voucher */}
                <Box overflowX="auto"> {/* Add this container to enable horizontal scrolling */}

                    <Table variant="simple" mt={6}>
                        <Thead>
                            <Tr>
                                <Th style={{ backgroundColor: tableBg, color: 'black' }}>Mã Voucher</Th>
                                <Th style={{ backgroundColor: tableBg, color: 'black' }}>Ngày hết hạn</Th>
                                <Th style={{ backgroundColor: tableBg, color: 'black' }}>Số tiền mua tối thiểu</Th>
                                <Th style={{ backgroundColor: tableBg, color: 'black' }}>Số lượng đã sử dụng</Th>
                                <Th style={{ backgroundColor: tableBg, color: 'black' }}>Số lượng có thể dùng</Th>
                                <Th style={{ backgroundColor: tableBg, color: 'black' }}>Trạng thái</Th>
                                <Th style={{ backgroundColor: tableBg, color: 'black' }}>Hành Động</Th>

                            </Tr>
                        </Thead>
                        <Tbody>
  {showdata.map((voucher) => (
    <Tr key={voucher.VoucherID} _hover={{ bg: "gray.50" }}>
      <Td>
        <Badge colorScheme="blue">{voucher.Code}</Badge>
      </Td>

      <Td>
        <Badge colorScheme="purple">
          {new Date(voucher.ExpiryDate).toLocaleString('vi-VN', {
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
        <Badge colorScheme="green">{formatCurrency(voucher.MinimumPurchaseAmount)} VNĐ</Badge>
      </Td>
      
      <Td>
        <Badge colorScheme="orange">{voucher.quantityused}</Badge>
      </Td>
      
      <Td>
        <Badge colorScheme="teal">{voucher.usablequantity}</Badge>
      </Td>
      
      <Td>
        <Badge colorScheme={voucher.status === 'active' ? 'green' : 'red'}>
          {voucher.status === 'active' ? 'Kích hoạt' : 'Ngừng hoạt động'}
        </Badge>
      </Td>
      
      <Td>
        <Button
          colorScheme="blue"
          size="sm"
          borderRadius="md"
          mr={2}
          onClick={() => updatevoucher(String(voucher.VoucherID))} // Convert to string
        >
          Edit
        </Button>

        <Button 
          colorScheme="green" 
          size="sm"
          borderRadius="md"
          onClick={() => deletevoucher(String(voucher.VoucherID))} // Convert to string
        >
          Sửa
        </Button>
      </Td>
    </Tr>
  ))}
</Tbody>

                    </Table>
                </Box>

                {/* Phân trang */}
                <Box mt={4} display="flex" justifyContent="center">
                    <Button
                        onClick={() => paginate(currentPage - 1)}
                        isDisabled={currentPage === 1}
                    >
                        Trước
                    </Button>
                    <Text mx={2}>
                        Trang {currentPage} của {totalPages}
                    </Text>
                    <Button
                        onClick={() => paginate(currentPage + 1)}
                        isDisabled={currentPage === totalPages}
                    >
                        Sau
                    </Button>
                </Box>
            </Card>
        </Box>
    );
}


