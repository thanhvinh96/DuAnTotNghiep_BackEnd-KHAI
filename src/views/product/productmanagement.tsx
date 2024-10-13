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
        ProductID :String;
    }

    const [dataTableProduc, setDataTableProduc] = useState<DataTable[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); // Số lượng sản phẩm mỗi trang
    const [searchTerm, setSearchTerm] = useState(''); // Tìm kiếm theo tên sản phẩm
    const [selectedCategory, setSelectedCategory] = useState(''); // Lọc theo danh mục
    const [statusFilter, setStatusFilter] = useState(''); // Lọc theo trạng thái

    const showData = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/products/', {
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

    useEffect(() => {
        showData();
    }, []);

    // Tính toán các chỉ số cho trang hiện tại
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    // Lọc dữ liệu theo các điều kiện
    const filteredData = dataTableProduc.filter(product => {
        return (
            (product.ProductName.toLowerCase().includes(searchTerm.toLowerCase()) || searchTerm === '') &&
            (selectedCategory === '' || product.CategoryName === selectedCategory) &&
            (statusFilter === '' || (statusFilter === 'active' ? product.status === '1' : product.status === '0'))
        );
    });

    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
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

    return (
        <Box pt={{ base: "20px", md: "80px", xl: "80px" }}>
            <Card p={5} mb={{ base: "0px", lg: "40px" }}>
                <div className="card-header">
                    <Text fontSize="xl" fontWeight="bold">DANH SÁCH SẢN PHẨM</Text>
                    <Button
                        as="a"
                        href="/admin/products-create"
                        colorScheme="blue"
                        size="sm"
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
                            <option value="Category1">Danh mục 1</option>
                            <option value="Category2">Danh mục 2</option>
                            <option value="Category3">Danh mục 3</option>
                            {/* Thêm các danh mục khác nếu cần */}
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
                            <option value="inactive">Ngừng hoạt động</option>
                        </Select>
                    </FormControl>
                </Grid>

                <Box mt={4}>
                    <Text fontWeight="bold">Hiển thị từ <strong>{indexOfFirstItem + 1}</strong> đến <strong>{indexOfLastItem > filteredData.length ? filteredData.length : indexOfLastItem}</strong> của <strong>{filteredData.length}</strong> sản phẩm</Text>
                    <Table variant="striped" colorScheme="teal" mt={4}>
                        <Thead>
                            <Tr>
                            <Th color="white">Ưu tiên</Th>
    <Th color="white">Thao tác</Th>
    <Th color="white">Sản phẩm</Th>
    <Th color="white">Chuyên mục</Th>
    <Th color="white">Trạng thái</Th>
    <Th color="white">Giá bán</Th>
    <Th color="white">Thời gian</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {currentItems.map((product, index) => (
                                <Tr key={index}>
                                    <Td>{product.Priority || "N/A"}</Td>
                                    <Td>
                                        <Button as="a" href={`/admin/products-edit?id=${product.ProductID}`} colorScheme="yellow" size="sm">
                                            <i className="fa-solid fa-pen-to-square"></i> Chỉnh sửa
                                        </Button>
                                    </Td>
                                    <Td>
                                        <Text>
                                            <a href={`/admin/products-edit?id=${product.ProductID}`}>{product.ProductName}</a>
                                        </Text>
                                    </Td>
                                    <Td><Badge colorScheme="blue">{product.CategoryName}</Badge></Td>
                                    <Td>
                                        <Checkbox isChecked={product.status === "1"} />
                                    </Td>
                                    <Td>
                                        Giá bán: <b style={{ color: 'red' }}>{product.Price}</b><br />
                                        Giá vốn: <b style={{ color: 'blue' }}>{product.Cost}</b>
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
