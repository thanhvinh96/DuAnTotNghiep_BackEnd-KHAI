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
        <Card p={5} mb={{ base: "0px", lg: "40px" }} style={{ height: 'auto', width: '100%' }}>
            <div className="card-title">
                THÊM SẢN PHẨM MỚI
            </div>
            <form onSubmit={handleSubmit}>
                <Grid templateColumns="1fr" gap={6}>
                    
                    {/* Product Name */}
                    <FormControl>
                        <FormLabel htmlFor="productName">Tên Sản phẩm</FormLabel>
                        <Input
                            id="productName"
                            type="text"
                            value={product.ProductName}
                            onChange={(e) => setProduct({ ...product, ProductName: e.target.value })}
                        />
                    </FormControl>
    
                    {/* Price */}
                    <FormControl>
                        <FormLabel htmlFor="price">Price</FormLabel>
                        <Input
                            id="price"
                            type="text"
                            value={product.Price}
                            onChange={(e) => setProduct({ ...product, Price: e.target.value })}
                        />
                    </FormControl>
    
                    {/* Stock Quantity */}
                    <FormControl>
                        <FormLabel htmlFor="stockQuantity">Số Lượng Kho</FormLabel>
                        <Input
                            id="stockQuantity"
                            type="text"
                            value={product.StockQuantity}
                            onChange={(e) => setProduct({ ...product, StockQuantity: e.target.value })}
                        />
                    </FormControl>
    
                    {/* Category ID */}
                    <FormControl>
                        <FormLabel htmlFor="categoryId">ID Danh Mục</FormLabel>
                        <Select
                            id="categoryId"
                            value={product.CategoryID}
                            onChange={(e) => setProduct({ ...product, CategoryID: e.target.value })}
                        >
                            <option value="">Select a category</option>
                            {OptionCategory.map((category) => (
                                <option key={category.CategoryID} value={category.CategoryID}>
                                    {category.CategoryName} {/* Display category name */}
                                </option>
                            ))}
                        </Select>
                    </FormControl>
    
                    {/* Status */}
                    <FormControl>
                        <FormLabel htmlFor="status">Trạng Thái</FormLabel>
                        <Select
                            id="status"
                            value={product.status}
                            onChange={(e) => setProduct({ ...product, status: e.target.value })}
                        >
                            <option value="">Select a status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="pending">Pending</option>
                        </Select>
                    </FormControl>
    
                    {/* Main Image */}
                  
    
                    {/* Other Images */}
                    <FormControl>
                        <FormLabel htmlFor="otherImages">Hình Phụ (up to 5)</FormLabel>
                        <Input
                            id="otherImages"
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleOtherImagesChange}
                        />
                    </FormControl>
    
                    {/* Product Description */}
                    <FormControl>
                        <FormLabel htmlFor="description">Description</FormLabel>
                        <ReactQuill
                            value={product.Description}
                            onChange={(value) => setProduct({ ...product, Description: value })}
                        />
                    </FormControl>
    
                    {/* Short Description */}
                    <FormControl>
                        <FormLabel htmlFor="shortDescription">Short Description</FormLabel>
                        <ReactQuill
                            value={product.ShortDescription}
                            onChange={(value) => setProduct({ ...product, ShortDescription: value })}
                        />
                    </FormControl>
    
                </Grid>
    
                <Button type="submit" colorScheme="blue" style={{ marginTop: '70px' }}>
                    Thêm Sản Phẩm
                </Button>
            </form>
        </Card>
    </Box>
    
    );
}
