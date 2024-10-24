import React, { useEffect, useState } from 'react';
import { Box, Card, Grid, Button } from "@chakra-ui/react";
import { useLocation } from 'react-router-dom';

interface DataCategoryEdit {
    CategoryName: string;
    Description: string;
    ImageURL: string;
    status: string;
    location: string; // Sửa thành string
}

export default function CategoryEdit() {
    const location = useLocation();

    const [dataCategory, setDataCategory] = useState<DataCategoryEdit>({
        CategoryName: '',
        Description: '',
        ImageURL: '',
        status: '',
        location: '',
    });

    const updateCategory = async (event: React.FormEvent) => {
        event.preventDefault();
        const queryString = location.search;
        const urlParams = new URLSearchParams(queryString);
        const id = urlParams.get('id');

        try {
            const formData = new FormData();
            formData.append('CategoryName', dataCategory.CategoryName);
            formData.append('Description', dataCategory.Description);
            formData.append('status', dataCategory.status);
            formData.append('location', dataCategory.location);
            const iconInput = document.querySelector('input[name="icon"]') as HTMLInputElement;
            if (iconInput?.files && iconInput.files.length > 0) {
                formData.append('ImageURL', iconInput.files[0]);
            }

            const response = await fetch(`http://localhost:3000/api/update-category/${id}`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                console.log('Category updated successfully');
                alert('cập nhật danh mục thành công');
            } else {
                console.error('Failed to update category:', response.status);
                alert(' cập nhật danh mục thất bại');
            }
        } catch (error) {
            console.error('Error updating category:', error);
        }
    };

    useEffect(() => {
        const getData = async () => {
            const queryString = location.search;
            const urlParams = new URLSearchParams(queryString);
            const id = urlParams.get('id');

            try {
                const response = await fetch(`http://localhost:3000/api/get-category/${id}`, {
                    method: 'GET',
                });

                if (response.ok) {
                    const data = await response.json();
                    setDataCategory({
                        CategoryName: data[0]['CategoryName'],
                        Description: data[0]['Description'],
                        ImageURL: data[0]['ImageURL'],
                        status: data[0]['status'],
                        location: data[0]['location'],
                    });
                } else {
                    console.error('Failed to fetch categories:', response.status);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        getData();
    }, [location]);

    return (
        <Box pt={{ base: "20px", md: "80px", xl: "80px" }}>
            <Card p={5} mb={{ base: "0px", lg: "40px" }}>
                <div className="row">
                    <div className="col-xl-12">
                        <div className="card custom-card">
                            <div className="card-header justify-content-between">
                                <div className="card-title">
                                    CHỈNH SỬA CHUYÊN DANH MỤC SẢN PHẨM
                                </div>
                            </div>
                            <div className="card-body">
                                <form onSubmit={updateCategory} encType="multipart/form-data">
                                    <div className="row mb-4">
                                        <div className="col-sm-12">
                                            <div className="mb-4">
                                                <label className="form-label" htmlFor="stt">Ưu tiên:</label>
                                                <input type="text" className="form-control" name="stt" value={dataCategory.location}
                                                    onChange={(e) => setDataCategory({ ...dataCategory, location: e.target.value })} />
                                                <small>Lưu ý: Ưu tiên càng cao, chuyên mục càng hiển thị trên cùng</small>
                                            </div>

                                            <div className="mb-4">
                                                <label className="form-label" htmlFor="name">Tên chuyên mục:</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="name"
                                                    required
                                                    value={dataCategory.CategoryName}
                                                    onChange={(e) => setDataCategory({ ...dataCategory, CategoryName: e.target.value })}
                                                />
                                            </div>

                                            <div className="mb-4">
                                                <label className="form-label" htmlFor="icon">Icon:</label>
                                                <input type="file" className="form-control" name="icon" />
                                                <img src={`http://localhost:3000/uploads/${dataCategory.ImageURL}`} alt="Category Icon" width="50px" />
                                            </div>
                                            <div className="mb-4">
                                                <label className="form-label" htmlFor="description">Description SEO:</label>
                                                <textarea
                                                    className="form-control"
                                                    name="description"
                                                    value={dataCategory.Description}
                                                    onChange={(e) => setDataCategory({ ...dataCategory, Description: e.target.value })}
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <label className="form-label" htmlFor="status">Status:</label>
                                                <select
                                                    className="form-control"
                                                    name="status"
                                                    required
                                                    value={dataCategory.status}
                                                    onChange={(e) => setDataCategory({ ...dataCategory, status: e.target.value })}
                                                >
                                                    <option value="1">ON</option>
                                                    <option value="0">OFF</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                                        <Button
                                            as="a"
                                            href="https://zshopclone7.cmsnt.net/?module=admin&amp;action=categories"
                                            colorScheme="red"
                                            size={["xs", "sm", "md"]}
                                            mt={["10px", "0px"]} // Khoảng cách trên giữa các nút
                                            ml={["20px", "0px"]} // Khoảng cách 0 bên trái cho nút Back
                                            width={["100%", "auto"]} // Đặt chiều rộng 100% trên màn hình nhỏ, tự động trên màn hình lớn
                                            height={["50px", "50px"]} // Chiều cao cố định cho nút
                                            borderRadius="md" // Hình vuông với góc bo nhẹ
                                            fontSize={["sm", "md"]} // Kích thước chữ thay đổi theo kích thước màn hình
                                            display="flex" // Để sử dụng justifyContent và alignItems
                                            alignItems="center" // Căn giữa theo chiều dọc
                                            justifyContent="center" // Căn giữa theo chiều ngang
                                        >
                                            <i className="fa fa-fw fa-undo me-1"></i> Back
                                        </Button>

                                        <Button
                                            type="submit"
                                            colorScheme="blue"
                                            width={["100%", "auto"]} // Đặt chiều rộng 100% trên màn hình nhỏ, tự động trên màn hình lớn
                                            height={["50px", "50px"]} // Chiều cao cố định cho nút
                                            borderRadius="md" // Hình vuông với góc bo nhẹ
                                            display="flex" // Để sử dụng justifyContent và alignItems
                                            alignItems="center" // Căn giữa theo chiều dọc
                                            justifyContent="center" // Căn giữa theo chiều ngang
                                        >
                                            <i className="fa fa-fw fa-save me-1"></i> Save
                                        </Button>
                                    </Grid>

                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </Box>
    );
}
