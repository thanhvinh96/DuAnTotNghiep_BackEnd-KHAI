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
  const toast = useToast();
  const location = useLocation();
  const queryString = location.search;
  const urlParams = new URLSearchParams(queryString);
  const id = urlParams.get('id');

  useEffect(() => {
    const getDataCategory = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/getall-category');
        if (response.ok) {
          const data = await response.json();
          setOptionCategory(data);
        } else {
          console.error('Failed to fetch categories:', response.status);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    getDataCategory();
  }, []);

  const handleOtherImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setProduct({ ...product, OtherImages: Array.from(e.target.files) });
    }
  };

  useEffect(() => {
    const getProductData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/products/${id}`);
        if (response.ok) {
          const data = await response.json();
          setProduct(data);
        } else {
          console.error('Failed to fetch product:', response.status);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    getProductData();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('ProductName', product.ProductName);
    formData.append('Description', product.Description);
    formData.append('Price', product.Price);
    formData.append('StockQuantity', product.StockQuantity);
    formData.append('CategoryID', product.CategoryID);
    formData.append('status', product.status);
    formData.append('ShortDescription', product.ShortDescription);

    product.OtherImages.forEach((image) => {
      formData.append('OtherImages', image);
    });

    try {
      const response = await fetch(`http://localhost:3000/api/products/update/${id}`, {
        method: 'POST',
        body: formData, // Send FormData directly
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
    <Box pt={{ base: '20px', md: '80px', xl: '80px' }}>
      <Card p={5} mb={{ base: '0px', lg: '40px' }} style={{ height: 'auto', width: '100%' }}>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4} align="stretch">
            <FormControl isRequired>
              <FormLabel>Tên Sản Phẩm</FormLabel>
              <Input
                name="ProductName"
                placeholder="Enter Product Name"
                value={product.ProductName}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Mô Tả Chi Tiết</FormLabel>
              <Textarea
                name="Description"
                placeholder="Enter Description"
                value={product.Description}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Mô Tả Ngắn</FormLabel>
              <Textarea
                name="ShortDescription"
                placeholder="Enter Short Description"
                value={product.ShortDescription}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Giá sale</FormLabel>
              <Input
                type="number"
                name="Price"
                placeholder="Enter Price"
                value={product.Price}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Số Hàng</FormLabel>
              <Input
                type="number"
                name="StockQuantity"
                placeholder="Enter Stock Quantity"
                value={product.StockQuantity}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Danh Mục</FormLabel>
              <Select
                name="CategoryID"
                placeholder="Select Category"
                value={product.CategoryID}
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
                value={product.status}
                onChange={handleInputChange}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Uploads Ảnh (Tối đa 5 ảnh)</FormLabel>
              <Input
                type="file"
                name="OtherImages"
                accept="image/*"
                onChange={handleOtherImagesChange}
                multiple
              />
            </FormControl>
            <Button type="submit" size="lg" borderRadius="md" colorScheme="blue">
              Cập Nhật Dữ Liệu
            </Button>
          </VStack>
        </form>
      </Card>
    </Box>
  );
};

export default UpdateProductForm;
