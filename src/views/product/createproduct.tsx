import React, { useState, useEffect } from 'react';
import { Box, Card, Grid, Button, FormControl, FormLabel, Input, Select } from "@chakra-ui/react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function ProductAdd() {
    interface OptionCategory {
        CategoryID: string;  // Changed String to string
        CategoryName: string; // Changed String to string
    }

    const [OptionCategory, setOptionCategory] = useState<OptionCategory[]>([]); // Use array of OptionCategory

    const [product, setProduct] = useState<{
        ProductName: string;
        Description: string;
        Price: string;
        StockQuantity: string;
        CategoryID: string;
        status: string;
        MainImage: File | null;
        OtherImages: File[];
        ShortDescription: string;
    }>({
        ProductName: '',
        Description: '',
        Price: '',
        StockQuantity: '',
        CategoryID: '',
        status: '',
        MainImage: null,
        OtherImages: [],
        ShortDescription: '',
    });
    const getDataCategory = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/getall-category', {
                method: 'GET',
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data);
                setOptionCategory(data); // Set categories directly

                return data; // Trả về dữ liệu nếu cần sử dụng ở nơi khác
            } else {
                console.error('Failed to fetch categories:', response.status);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setProduct({ ...product, MainImage: e.target.files[0] });
        }
    };

    const handleOtherImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setProduct({ ...product, OtherImages: Array.from(e.target.files) });
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        const formData = new FormData();
        formData.append('ProductName', product.ProductName);
        formData.append('Description', product.Description);
        formData.append('Price', product.Price);
        formData.append('StockQuantity', product.StockQuantity);
        formData.append('CategoryID', product.CategoryID);
        formData.append('status', product.status);
    
        
        console.log(product.OtherImages);
        product.OtherImages.forEach((image) => {
            console.log(image);
            formData.append('OtherImages', image); 
        });
        
        formData.append('ShortDescription', product.ShortDescription);
    
        try {
            console.log(formData)
            const response = await fetch('http://localhost:3000/api/products/creates', {
                method: 'POST',
                body: formData,
            });
    
            if (response.ok) {
                const data = await response.json();
                console.log('Product created successfully:', data);
                alert('thêm sản phẩm thành công');
            } else {
                console.error('Failed to create product:', response.status);
                alert('thêm sản phẩm thất bại');

            }
        } catch (error) {
            console.error('Error creating product:', error);
        }
    };
    
    useEffect(() => {
        getDataCategory();
    }, []);

    return (
        <Box pt={{ base: "20px", md: "80px", xl: "80px" }}>
        <Card p={5} mb={{ base: "0px", lg: "40px" }} borderRadius="md" boxShadow="md">
            <form onSubmit={handleSubmit}>
                <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
                    
                    {/* Tên Sản Phẩm */}
                    <FormControl>
                        <FormLabel htmlFor="productName">Tên Sản phẩm</FormLabel>
                        <Input
                            id="productName"
                            type="text"
                            value={product.ProductName}
                            onChange={(e) => setProduct({ ...product, ProductName: e.target.value })}
                            placeholder="Nhập tên sản phẩm"
                            variant="outline"
                        />
                    </FormControl>

                    {/* Giá */}
                    <FormControl>
                        <FormLabel htmlFor="price">Giá</FormLabel>
                        <Input
                            id="price"
                            type="text"
                            value={product.Price}
                            onChange={(e) => setProduct({ ...product, Price: e.target.value })}
                            placeholder="Nhập giá sản phẩm"
                            variant="outline"
                        />
                    </FormControl>

                    {/* Số Lượng Kho */}
                    <FormControl>
                        <FormLabel htmlFor="stockQuantity">Số Lượng Kho</FormLabel>
                        <Input
                            id="stockQuantity"
                            type="text"
                            value={product.StockQuantity}
                            onChange={(e) => setProduct({ ...product, StockQuantity: e.target.value })}
                            placeholder="Nhập số lượng kho"
                            variant="outline"
                        />
                    </FormControl>

                    {/* ID Danh Mục */}
                    <FormControl>
                        <FormLabel htmlFor="categoryId">ID Danh Mục</FormLabel>
                        <Select
                            id="categoryId"
                            value={product.CategoryID}
                            onChange={(e) => setProduct({ ...product, CategoryID: e.target.value })}
                            placeholder="Chọn danh mục"
                            variant="outline"
                        >
                            {OptionCategory.map((category) => (
                                <option key={category.CategoryID} value={category.CategoryID}>
                                    {category.CategoryName}
                                </option>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Trạng Thái */}
                    <FormControl>
                        <FormLabel htmlFor="status">Trạng Thái</FormLabel>
                        <Select
                            id="status"
                            value={product.status}
                            onChange={(e) => setProduct({ ...product, status: e.target.value })}
                            placeholder="Chọn trạng thái"
                            variant="outline"
                        >
                            <option value="active">Hoạt động</option>
                            <option value="inactive">Ngừng hoạt động</option>
                            <option value="pending">Đang chờ</option>
                        </Select>
                    </FormControl>

                    {/* Hình Phụ */}
                    <FormControl>
                        <FormLabel htmlFor="otherImages">Hình Phụ (tối đa 5)</FormLabel>
                        <Input
                            id="otherImages"
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleOtherImagesChange}
                            variant="outline"
                        />
                    </FormControl>

                    {/* Mô Tả Sản Phẩm */}
                    <FormControl>
                        <FormLabel htmlFor="description">Mô Tả</FormLabel>
                        <ReactQuill
                            value={product.Description}
                            onChange={(value) => setProduct({ ...product, Description: value })}
                            placeholder="Nhập mô tả sản phẩm"
                        />
                    </FormControl>

                    {/* Mô Tả Ngắn */}
                    <FormControl>
                        <FormLabel htmlFor="shortDescription">Mô Tả Ngắn</FormLabel>
                        <ReactQuill
                            value={product.ShortDescription}
                            onChange={(value) => setProduct({ ...product, ShortDescription: value })}
                            placeholder="Nhập mô tả ngắn"
                        />
                    </FormControl>
                </Grid>

                <Button 
                    type="submit" 
                    colorScheme="blue" 
                    mt={8} 
                    width="100%"
                    borderRadius="md" // Hình vuông với góc bo nhẹ

                >
                    Thêm Sản Phẩm
                </Button>
            </form>
        </Card>
    </Box>
    
    );
}
