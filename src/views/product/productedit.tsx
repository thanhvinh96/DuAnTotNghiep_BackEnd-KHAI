import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  ChakraProvider,
  Box,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  Button,
  VStack,
  useToast,
  Card,
} from '@chakra-ui/react';

interface OptionCategory {
  CategoryID: string;
  CategoryName: string;
}

interface Product {
  ProductID: number;
  ProductName: string;
  Description: string;
  Price: number;
  StockQuantity: number;
  CategoryID: number;
  status: string;
  ShortDescription: string;
  Cost: number;
  Priority: number;
}

const UpdateProductForm = () => {

  const [optionCategory, setOptionCategory] = useState<OptionCategory[]>([]);
  const [product, setProduct] = useState<Product | null>(null); // State to hold product data
  const toast = useToast();
  const location = useLocation();
  const queryString = location.search; 
  const urlParams = new URLSearchParams(queryString);
  const id = urlParams.get('id'); 

  // Fetch categories when component mounts
  useEffect(() => {
    const getDataCategory = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/getall-category', {
          method: 'GET',
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setOptionCategory(data);
        } else {
          console.error('Failed to fetch categories:', response.status);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    getDataCategory(); // Call the function to fetch categories
  }, []);

  // Fetch product data when component mounts
  useEffect(() => {
    const getProductData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/products/${id}`, {
          method: 'GET',
        });

        if (response.ok) {
          const data = await response.json();
          console.log('dữ liệu', data['StockQuantity']);
          setProduct({
            ProductID: data['ProductID'],
            ProductName: data['ProductName'],
            Description: data['Description'],
            Price: data['Price'],
            StockQuantity: data['StockQuantity'],
            CategoryID: data['CategoryID'],
            status: data['status'],
            ShortDescription: data['ShortDescription'],
            Cost: data['Cost'],
            Priority: data['Priority'],
          });
        } else {
          console.error('Failed to fetch product:', response.status);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    getProductData(); // Call the function to fetch product
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    // Handle form data here
    // Example: Send formData to API
    try {
      const response = await fetch(`http://localhost:3000/api/products/${id}`, {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        toast({
          title: 'Product updated.',
          description: 'Your product information has been updated successfully.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Error updating product.',
          description: 'There was an error updating your product. Please try again.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: 'Error.',
        description: 'There was an error updating your product. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box pt={{ base: "20px", md: "80px", xl: "80px" }}>
      <Card p={5} mb={{ base: "0px", lg: "40px" }} style={{ height: 'auto', width: '100%' }}>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4} align="stretch">
            <FormControl isRequired>
              <FormLabel>Vị Trí Ưu Tiên</FormLabel>
              <Input
                name="ProductName"
                placeholder="Enter Product Name"
                value={product?.ProductName || ''}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Tên Sản Phẩm</FormLabel>
              <Input
                name="ProductName"
                placeholder="Enter Product Name"
                value={product?.ProductName || ''}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Mô Tả Chi Tiết</FormLabel>
              <Textarea
                name="Description"
                placeholder="Enter Description"
                value={product?.Description || ''}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Mô Tả Ngắn</FormLabel>
              <Textarea
                name="ShortDescription"
                placeholder="Enter Short Description"
                value={product?.ShortDescription || ''}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Giá sale</FormLabel>
              <Input
                type="number"
                name="Price"
                placeholder="Enter Price"
                value={product?.Price || 0}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Giá Vốn</FormLabel>
              <Input
                type="number"
                name="Cost"
                placeholder="Enter Cost"
                value={product?.Cost || ''}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Sổ Hàng</FormLabel>
              <Input
                type="number"
                name="StockQuantity"
                placeholder="Enter Stock Quantity"
                value={product?.StockQuantity || 0}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Danh Mục</FormLabel>
              <Select
                name="CategoryID"
                placeholder="Select Category"
                value={product?.CategoryID || ''}
                onChange={handleInputChange}
              >
                {optionCategory.map((category) => (
                  <option key={category.CategoryID} value={category.CategoryID}>
                    {category.CategoryName}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Trạng Thái</FormLabel>
              <Select
                name="status"
                placeholder="Select Status"
                value={product?.status || ''}
                onChange={handleInputChange}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Select>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Vị Trí</FormLabel>
              <Input
                type="number"
                name="Priority"
                placeholder="Enter Priority"
                value={product?.Priority || 0}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Uploads Ảnh Tối 5 Ảnh</FormLabel>
              <Input type="file" name="image" accept="image/*" multiple />
            </FormControl>
            <Button type="submit" colorScheme="teal" size="lg">
              Cập Nhật Dữ Liệu
            </Button>
          </VStack>
        </form>
      </Card>
    </Box>
  );
};

export default UpdateProductForm;
