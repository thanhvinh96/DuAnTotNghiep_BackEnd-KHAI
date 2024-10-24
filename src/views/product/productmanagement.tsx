import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Card,
    Checkbox,
    FormControl,
    FormLabel,
    Grid,
    Input,
    Select,
    Table,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    Badge,
    Text,
} from "@chakra-ui/react";
import Swal from 'sweetalert2'; // Nhập SweetAlert2

import { ProductController } from '../../controller/productController.tsx';
import { CategoryController } from '../../controller/categoryController.tsx';
import { any } from 'micromatch';
export default function ProductManagement() {
    interface DataTable {
        ProductName: string;
        Price: string;
        Cost: string;
        status: string;
        Creationtime: string;
        CategoryName: string;
        Priority: string;
        ShortDescription: string;
        ProductID: string; // Change this to 'string'
        SoldQuantity: Number;
    }

    const [dataTableProduc, setDataTableProduc] = useState<DataTable[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); // Số lượng sản phẩm mỗi trang
    const [searchTerm, setSearchTerm] = useState(''); // Tìm kiếm theo tên sản phẩm
    const [selectedCategory, setSelectedCategory] = useState(''); // Lọc theo danh mục
    const [statusFilter, setStatusFilter] = useState(''); // Lọc theo trạng thái

    const showData = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/products-notstatus', {
                method: 'GET',
            });

            if (response.ok) {
                const data = await response.json();
                setDataTableProduc(data);
            } else {
                console.error('Failed to create product:', response.status);
            }
        } catch (error) {
            console.error('Error creating product:', error);
        }
    };
    const [dataCategory, getdataCategory] = useState([]);
    const showdataCategory = async () => {
        try {
            const res: any = await CategoryController.fetchCategories(); // Đảm bảo bạn đang sử dụng await ở đây
            if (Array.isArray(res)) { // Kiểm tra xem res có phải là mảng không
                console.log(res)
                getdataCategory(res); // Cập nhật state với danh mục
            } else {
                console.error('Expected an array but received:', res); // Nếu không phải mảng
            }
        } catch (error) {
            console.error('Error fetching categories:', error); // Xử lý lỗi nếu có
        }
    };
    useEffect(() => {
        showData();
        showdataCategory();
    }, []);

    // Tính toán các chỉ số cho trang hiện tại
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    // Lọc dữ liệu theo các điều kiện
    const filteredData = dataTableProduc.filter(product => {
        return (
            (product.ProductName.toLowerCase().includes(searchTerm.toLowerCase()) || searchTerm === '') &&
            (selectedCategory === '' || product.CategoryName === selectedCategory) &&
            (statusFilter === '' || (statusFilter === 'active' ? product.status === 'active' : product.status === 'SHUTDOWN'))
        );
    });

    const currentItems: any = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    // Hàm chuyển đổi thời gian
    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        };
        return new Date(dateString).toLocaleString('vi-VN', options);
    };
    const handleHide = async (id: string, status: any) => {
        try {
            // Gọi hàm updateProductStatus và chờ kết quả
            const res = await ProductController.updateProductStatus(id, status);

            // Nếu thành công, hiển thị modal thông báo thành công
            Swal.fire({
                title: 'Success!',
                text: res, // Hiển thị kết quả trả về, ví dụ: "Product status updated successfully"
                icon: 'success',
                confirmButtonText: 'OK'
            });
        } catch (error) {
            // Nếu thất bại, hiển thị modal thông báo lỗi
            Swal.fire({
                title: 'Error!',
                text: 'Failed to update product status', // Thông báo lỗi
                icon: 'error',
                confirmButtonText: 'Try Again'
            });
        }
    };
    const handleDelete = async (id: string) => {
        try {
            // Gọi hàm deleteProductByID và chờ kết quả
            await ProductController.deleteProductByID(id);

            // Nếu thành công, hiển thị modal thông báo thành công
            Swal.fire({
                title: 'Success!',
                text: 'Product deleted successfully', // Thông báo thành công
                icon: 'success', // Icon hiển thị thành công
                confirmButtonText: 'OK'
            });
        } catch (error) {
            // Nếu thất bại, hiển thị modal thông báo lỗi
            Swal.fire({
                title: 'Error!',
                text: 'Failed to delete product', // Thông báo lỗi
                icon: 'error', // Icon hiển thị lỗi
                confirmButtonText: 'Try Again'
            });
        }
    };

    return (
        <Box pt={{ base: "20px", md: "80px", xl: "80px" }}>
            <Card p={5} mb={{ base: "0px", lg: "40px" }}>
                <div className="card-header">
                    {/* <Text fontSize="xl" fontWeight="bold">DANH SÁCH SẢN PHẨM</Text> */}
                    <Button
                        as="a"
                        href="/admin/products-create"
                        colorScheme="blue"
                        size="sm"
                        borderRadius="md" // Hình vuông với góc bo nhẹ
                    >
                        <i className="ri-add-line fw-semibold align-middle"></i> Thêm sản phẩm mới
                    </Button>
                </div>

                {/* Bộ lọc sản phẩm */}
                <Grid templateColumns="repeat(3, 1fr)" gap={4} mt={4}>
                    <FormControl>
                        <FormLabel>Tìm kiếm theo tên sản phẩm</FormLabel>
                        <Input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Chọn danh mục</FormLabel>
                        <Select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            <option value="">Tất cả danh mục</option>
                            {dataCategory.map((category: any) => (
                                <option key={category.CategoryID} value={category.CategoryName}>
                                    {category.CategoryName}
                                </option>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Trạng thái</FormLabel>
                        <Select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="">Tất cả</option>
                            <option value="active">Kích hoạt</option>
                            <option value="SHUTDOWN">Ngừng hoạt động</option>
                        </Select>
                    </FormControl>
                </Grid>

                <Box overflowX="auto" mt={4}>
                    <Text fontWeight="bold">Hiển thị từ <strong>{indexOfFirstItem + 1}</strong> đến <strong>{indexOfLastItem > filteredData.length ? filteredData.length : indexOfLastItem}</strong> của <strong>{filteredData.length}</strong> sản phẩm</Text>
                    <Table variant="striped" colorScheme="teal">
                        <Thead>
                            <Tr>
                                <Th color="black">Ưu tiên</Th>
                                <Th color="black">Thao tác</Th>
                                <Th color="black">Sản phẩm</Th>
                                <Th color="black">Trạng Thái</Th>
                                <Th color="black">Chuyên mục</Th>
                                <Th color="black">Số Lượng Đã Bán</Th>
                                <Th color="black">Giá bán</Th>
                                <Th color="black">Thời gian</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {currentItems.map((product: any, index: any) => (
                                <Tr key={index}>
                                    <Td>{product.Priority}</Td>
                                    <Td>
                                        <Box display="flex" flexDirection="column" gap="20px"> {/* Added Box for layout and spacing */}
                                            <Button
                                                as="a"
                                                href={`/admin/products-edit?id=${product.ProductID}`}
                                                colorScheme="yellow"
                                                size="sm"
                                                width="100%" // Ensures buttons are the same width
                                                borderRadius="md" // Hình vuông với góc bo nhẹ

                                            >
                                                <i className="fa-solid fa-pen-to-square"></i> Chỉnh sửa
                                            </Button>
                                            <Button
                                                onClick={() => handleHide(product.ProductID, product.status === 'Active' ? 'SHUTDOWN' : 'Active')} // Thay đổi status dựa trên giá trị hiện tại
                                                colorScheme="blue"
                                                size="sm"
                                                width="100%" // Đảm bảo các nút có cùng chiều rộng
                                                borderRadius="md" // Hình vuông với góc bo nhẹ

                                            >
                                                <i className={`fa-solid ${product.status === 'Active' ? "fa-eye-slash" : "fa-eye"}`}></i>
                                                {product.status === 'SHUTDOWN' ? "Hiển thị sản phẩm" : "Ẩn sản phẩm"}  {/* Điều kiện để hiển thị đúng text */}
                                            </Button>

                                            {/* <Button
            onClick={() => handleDelete(product.ProductID)} // Hàm xử lý xóa sản phẩm
            colorScheme="red"
            size="sm"
            width="100%" // Ensures buttons are the same width
        >
            <i className="fa-solid fa-trash"></i> Xóa
        </Button> */}
                                        </Box>
                                    </Td>


                                    <Td>
                                        <Text>
                                            <a href={`/admin/products-edit?id=${product.ProductID}`}>{product.ProductName}</a>
                                        </Text>
                                    </Td>
                                    <Td>
                                    <Badge colorScheme={product.status.trim().toLowerCase() === 'active' ? "green" : "red"}>
    Trạng thái sản phẩm: {product.status.trim().toLowerCase() === 'active' ? "Hoạt động" : "Đang ẩn"}
</Badge>



                                    </Td>

                                    <Td><Badge colorScheme="blue">{product.CategoryName}</Badge></Td>
                                    <Td>
                                        <Td>
                                            <Text>{product.TotalQuantitySold}</Text>
                                        </Td>

                                    </Td>
                                    <Td>
                                        Giá bán: <b style={{ color: 'red' }}>{product.Price}</b><br />
                                    </Td>
                                    <Td><Text>{formatDate(product.Creationtime) || "N/A"}</Text></Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>

                    {/* Pagination */}
                    <nav aria-label="Page navigation example" className="mt-4">
                        <ul className="pagination">
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                <Button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>Trước</Button>
                            </li>
                            {[...Array(totalPages)].map((_, index) => (
                                <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                    <Button className="page-link" onClick={() => setCurrentPage(index + 1)}>{index + 1}</Button>
                                </li>
                            ))}
                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                <Button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>Sau</Button>
                            </li>
                        </ul>
                    </nav>
                </Box>
            </Card>
        </Box>
    );
}
