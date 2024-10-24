import React, { useState, useEffect } from "react";
import { Box, Grid, Tab, TabList, TabPanel, TabPanels, Tabs, Button, Table, Thead, Tbody, Tr, Th, Td, Badge, Card, Image, Flex } from "@chakra-ui/react";

// Custom components
// import Banner from "views/admin/profile/components/Banner"; // Adjust the import as needed

function CategoryOverview() {
  interface DataCategory {
    CategoryName: string;
    Description: string;
    ImageURL: string | File;
    status: string;
    location: string;
  }

  interface DataTable {
    CategoryID: string;
    CategoryName: string;
    Description: string;
    ImageURL: string;
    status: string;
    product_count: number;
    location: string;

  }

  const [showForm, setShowForm] = useState<boolean>(false);
  const [showDatatable, setDatatable] = useState<DataTable[]>([]); // Initialize as an empty array
  const [selectedCategory, setSelectedCategory] = useState<DataTable | null>(null); // State for selected category
  const [categoryData, setCategoryData] = useState<DataCategory>({
    CategoryName: '',
    Description: '',
    ImageURL: '',
    status: '',
    location: '',
  });

  const getdatcategory = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/getall-category', {
        method: 'GET', // Set method to GET
      });

      // Check if response is successful
      if (response.ok) {
        const data = await response.json(); // Convert response to JSON
        console.log(data); // Handle the received data
        setDatatable(data);
      } else {
        console.error('Failed to fetch categories:', response.status);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    console.clear(); // Clear console when component renders
    getdatcategory();
  }, []);

  const handleToggleForm = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === "file") {
      const input = e.target as HTMLInputElement;
      if (input.files && input.files.length > 0) {
        const file = input.files[0];
        if (file) {
          setCategoryData((prev) => ({
            ...prev,
            ImageURL: file,
          }));
        }
      }
    } else {
      setCategoryData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCategoryData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("CategoryName", categoryData.CategoryName);
    formData.append("Description", categoryData.Description);
    formData.append("status", categoryData.status);
    formData.append("location", categoryData.location);

    if (categoryData.ImageURL) {
      formData.append("ImageURL", categoryData.ImageURL); // ImageURL is a file
    }

    try {
      const response = await fetch('http://localhost:3000/api/create-category', {
        method: "POST",
        body: formData, // Send FormData containing both text and file
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result);
        alert('tạo danh mục sản phẩm thành công')
        getdatcategory(); // Refresh the category list after creation
      } else {
        console.error('Failed to create category:', response.status);
        alert('tạo danh mục sản phẩm thất bại')

      }
    } catch (error) {
      console.error('Error during category creation:', error);
    }
  };
  const delete_category = async (id: string) => {
    try {
      const response = await fetch('http://localhost:3000/api/delete-category', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json', // Ensure the server knows the data type being sent
        },
        body: JSON.stringify({
          categoryId: id // Correct the key for consistency
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result);
        alert('Xóa sản phẩm thành công'); // Consider translating for consistency
        getdatcategory(); // Fetch updated categories after deletion
      } else {
        console.error('Failed to delete category:', response.status);
        alert('Xóa sản phẩm thất bại vì đang có sản phẩm');
      }
    } catch (error) {
      console.error('Error during category deletion:', error);
      alert('Đã xảy ra lỗi trong quá trình xóa sản phẩm'); // Provide user feedback on errors
    }
  };

  return (
    <Box pt={{ base: "20px", md: "80px", xl: "80px" }}>
      <Card p={5} mb={{ base: "0px", lg: "40px" }}>
        <Flex justify="space-between" align="center" wrap="wrap">
          <Tabs variant="soft-rounded" colorScheme="teal" width="100%">
            <TabList flexWrap="wrap" my="20px">
              {showDatatable.map((category) => (
                <Tab
                  key={category.CategoryID}
                  onClick={() => setSelectedCategory(category)}
                  fontSize={["sm", "md", "lg"]}
                  mx={2}
                  mb={4} // Thêm margin-bottom để tạo khoảng cách giữa các tab

                  borderColor={selectedCategory?.CategoryID === category.CategoryID ? "blue.500" : "gray.200"}
                  borderRadius="md"
                  p={3}
                  bg="white"
                  borderWidth={1}
                  shadow="md"
                  _selected={{ bg: "blue.100", color: "blue.800" }}
                  _hover={{ bg: "blue.50", transform: "scale(1.02)" }}
                  transition="transform 0.2s ease"
                >
                  <Image
                    src={category.ImageURL}
                    alt={category.CategoryName}
                    boxSize={["25px", "30px"]}
                    borderRadius="full"
                    mr={2}
                  />
                  {category.CategoryName}
                </Tab>
              ))}
              <Button
                colorScheme="blue"
                onClick={() => setShowForm(!showForm)}
                mt={["10px", "0px"]}
                width={["100%", "auto"]} // Đặt chiều rộng 100% trên màn hình nhỏ, tự động trên màn hình lớn
                height={["40px", "50px"]} // Chiều cao thay đổi theo kích thước màn hình
                borderRadius="md" // Hình vuông với góc bo nhẹ
                fontSize={["sm", "md"]} // Kích thước chữ thay đổi theo kích thước màn hình
                p="5px" // Thêm padding 5px
              >
                Tạo chuyên mục cha
              </Button>

            </TabList>



            <TabPanels>
              {showDatatable.map((category) => (
                <TabPanel key={category.CategoryID}>
                  {/* Container có thể cuộn cho bảng */}
                  <Box overflowX="auto">
                    <Table variant="striped" colorScheme="gray" width="100%">
                      <Thead>
                        <Tr>
                          <Th width="8%">Ưu tiên</Th>
                          <Th>Tên chuyên mục con</Th>
                          <Th>Liên kết tĩnh</Th>
                          <Th>Thống kê Sản phẩm</Th>
                          <Th>Ảnh</Th>
                          <Th>Trạng thái</Th>
                          <Th>Thao tác</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {selectedCategory && (
                          <Tr>
                            <Td>
                              <input
                                className="form-control"
                                type="number"
                                value={selectedCategory.location}
                                style={{ width: "100%" }}
                              />
                            </Td>
                            <Td>{selectedCategory.CategoryName}</Td>
                            <Td>{selectedCategory.Description}</Td>
                            <Td>
                              <Badge colorScheme="blue">
                                Sản phẩm: {selectedCategory.product_count}
                              </Badge>
                            </Td>
                            <Td>
                              <Image
                                src={selectedCategory.ImageURL}
                                width="40px"
                                alt={selectedCategory.CategoryName}
                                borderRadius="md"
                              />
                            </Td>
                            <Td>
                              <select
                                className="form-control"
                                value={selectedCategory.status}
                                onChange={(e) => {
                                  const newStatus = e.target.value;
                                  setCategoryData((prev) => ({
                                    ...prev,
                                    status: newStatus,
                                  }));
                                }}
                                style={{ width: "100%" }}
                              >
                                <option value="1">ON</option>
                                <option value="0">OFF</option>
                              </select>
                            </Td>
                            <Td>
                              <Button
                                colorScheme="blue"
                                size={["xs", "sm", "md"]}
                                as="a"
                                href={`http://localhost:3001/admin/category-edit?id=${selectedCategory?.CategoryID}`}
                                mt={["10px", "0px"]}
                                width={["100%", "auto"]} // Đặt chiều rộng 100% trên màn hình nhỏ, tự động trên màn hình lớn
                                height={["40px", "50px"]} // Chiều cao thay đổi theo kích thước màn hình
                                borderRadius="md" // Hình vuông với góc bo nhẹ
                                fontSize={["sm", "md"]} // Kích thước chữ thay đổi theo kích thước màn hình
                              >
                                Edit
                              </Button>
                              <Button
                                colorScheme="red"
                                size={["xs", "sm", "md"]}
                                mt={["10px", "0px"]} // Khoảng cách trên giữa các nút
                                ml={["20px", "20px", "20px"]} // Khoảng cách 20px bên trái cho nút Delete
                                width={["100%", "auto"]} // Đặt chiều rộng 100% trên màn hình nhỏ, tự động trên màn hình lớn
                                height={["40px", "50px"]} // Chiều cao thay đổi theo kích thước màn hình
                                borderRadius="md" // Hình vuông với góc bo nhẹ
                                fontSize={["sm", "md"]} // Kích thước chữ thay đổi theo kích thước màn hình
                                onClick={() => delete_category(selectedCategory.CategoryID)}
                              >
                                Delete
                              </Button>

                            </Td>
                          </Tr>
                        )}
                      </Tbody>
                    </Table>
                  </Box>
                </TabPanel>
              ))}
            </TabPanels>

          </Tabs>
        </Flex>

        {/* Form for creating new category */}
        {showForm && (
          <Box mt={5}>
            <Card p={5}
               borderRadius="md"
              
               bg="white"
               borderWidth={1}
               shadow="md"
               _selected={{ bg: "blue.100", color: "blue.800" }}
               _hover={{ bg: "blue.50", transform: "scale(1.02)" }}
               transition="transform 0.2s ease"
            >
              <form onSubmit={handleSubmit} encType="multipart/form-data">
                <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                  <Box>
                    <label>Tên chuyên mục cha: <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      name="CategoryName"
                      onChange={handleToggleForm}
                      placeholder="Nhập tên chuyên mục"
                      required
                    />
                  </Box>
                  <Box>
                    <label>Vị trí mục cha: <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      name="location"
                      onChange={handleToggleForm}
                      placeholder="Nhập tên chuyên mục"
                      required
                    />
                  </Box>
                  <Box>
                    <label>Icon: <span className="text-danger">*</span></label>
                    <input
                      type="file"
                      accept="image/*"
                      name="ImageURL"
                      onChange={handleToggleForm}
                    />
                  </Box>
                  <Box>
                    <label>Description SEO:</label>
                    <textarea
                      className="form-control"
                      name="Description"
                      onChange={handleTextareaChange}
                    ></textarea>
                  </Box>
                  <Box>
                    <label>Trạng thái: <span className="text-danger">*</span></label>
                    <select
                      className="form-control"
                      name="status"
                      onChange={handleToggleForm}
                      required
                    >
                      <option value="1">ON</option>
                      <option value="0">OFF</option>
                    </select>
                  </Box>
                </Grid>
                <Button type="submit" colorScheme="blue" mt={4}>
                  <i className="fa fa-fw fa-plus me-1"></i> Submit
                </Button>
              </form>
            </Card>
          </Box>
        )}
      </Card>
    </Box>
  );

}
export default CategoryOverview;

