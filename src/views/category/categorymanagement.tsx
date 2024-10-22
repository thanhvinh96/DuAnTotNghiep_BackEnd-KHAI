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
    product_count:number;
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
        <Grid mb={{ base: "0px", lg: "40px" }}>
          <Box mt={5}>
          <Tabs variant="soft-rounded" colorScheme="teal">
  <Flex justify="space-between" align="center" wrap="wrap">
    <TabList flexWrap="wrap" my="20px">
      {showDatatable.map((category) => (
        <Tab
          key={category.CategoryID}
          onClick={() => setSelectedCategory(category)}
          fontSize={["sm", "md", "lg"]} // Responsive font size
        >
          <Image
            src={`http://localhost:3000/uploads/${category.ImageURL}`}
            alt={category.CategoryName}
            boxSize={["20px", "25px", "30px"]} // Responsive image size
            borderRadius="full"
            mr="2"
          />
          {category.CategoryName}
        </Tab>
      ))}
      <Button
        colorScheme="blue"
        onClick={() => setShowForm(!showForm)}
        mt={["10px", "0px"]} // Adds space on smaller screens
      >
        Tạo chuyên mục cha
      </Button>
    </TabList>
  </Flex>

  <TabPanels>
    {showDatatable.map((category) => (
      <TabPanel key={category.CategoryID}>
        
        <Table variant="striped" colorScheme="gray" width="100%">
          <Thead>
            <Tr>
              <Th width="8%" color="black">Ưu tiên</Th>
              <Th color="black">Tên chuyên mục con</Th>
              <Th color="black">Liên kết tĩnh</Th>
              <Th color="black">Thống kê Sản phẩm</Th>
              <Th color="black">Ảnh</Th>
              <Th color="black">Trạng thái</Th>
              <Th color="black">Thao tác</Th>
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
                    style={{ width: "100%" }} // Responsive input
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
                  <img
                    src={`http://localhost:3000/uploads/${selectedCategory.ImageURL}`}
                    width="40px"
                    alt={selectedCategory.CategoryName}
                    style={{ maxWidth: "100%" }} // Make image responsive
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
                    style={{ width: "100%" }} // Responsive select box
                  >
                    <option value="1">ON</option>
                    <option value="0">OFF</option>
                  </select>
                </Td>

                <Td>
                  <Button
                    as="a"
                    href={`http://localhost:3001/admin/category-edit?id=${selectedCategory?.CategoryID}`}
                    colorScheme="blue"
                    size={["xs", "sm", "md"]} // Responsive button size
                  >
                    Edit
                  </Button>

                  <Button
    size={["xs", "sm", "md"]} // Responsive button size
    colorScheme="red"
    ml={2}
    onClick={() => delete_category(selectedCategory.CategoryID)} // Use an arrow function to pass the ID
>
    Delete
</Button>

                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </TabPanel>
    ))}
  </TabPanels>
</Tabs>

          </Box>

          {/* Form for creating new category */}
          {showForm && (
            <Box mt={5}>
              <div className="card custom-card">
                <div className="card-body">
                  <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="row mb-4">
                      <label className="col-sm-4 col-form-label">
                        Tên chuyên mục cha: <span className="text-danger">*</span>
                      </label>
                      <div className="col-sm-8">
                        <input
                          type="text"
                          className="form-control"
                          name="CategoryName"
                          onChange={handleToggleForm}
                          placeholder="Nhập tên chuyên mục"
                          required
                        />
                      </div>
                    </div>
                    <div className="row mb-4">
                      <label className="col-sm-4 col-form-label">
                        Vị trí mục cha: <span className="text-danger">*</span>
                      </label>
                      <div className="col-sm-8">
                        <input
                          type="text"
                          className="form-control"
                          name="location"
                          onChange={handleToggleForm}
                          placeholder="Nhập tên chuyên mục"
                          required
                        />
                      </div>
                    </div>
                    <div className="row mb-4">
                      <label className="col-sm-4 col-form-label">
                        Icon: <span className="text-danger">*</span>
                      </label>
                      <div className="col-sm-8">
                        <input
                          type="file"
                          accept="image/*"
                          name="ImageURL"
                          onChange={handleToggleForm}
                        />
                      </div>
                    </div>
                    <div className="row mb-4">
                      <label className="col-sm-4 col-form-label">Description SEO:</label>
                      <div className="col-sm-12">
                        <textarea
                          className="form-control"
                          name="Description"
                          onChange={handleTextareaChange}
                        ></textarea>
                      </div>
                    </div>
                    <div className="row mb-4">
                      <label className="col-sm-4 col-form-label">
                        Trạng thái: <span className="text-danger">*</span>
                      </label>
                      <div className="col-sm-8">
                        <select
                          className="form-control"
                          name="status"
                          onChange={handleToggleForm}
                          required
                        >
                          <option value="1">ON</option>
                          <option value="0">OFF</option>
                        </select>
                      </div>
                    </div>
                    <Button type="submit" colorScheme="blue">
                      <i className="fa fa-fw fa-plus me-1"></i> Submit
                    </Button>
                  </form>
                </div>

              </div>
            </Box>
          )}
        </Grid>
      </Card>
    </Box>
  );
}
export default CategoryOverview;

