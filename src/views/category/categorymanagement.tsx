import React, { useState, useEffect } from "react";
import { Box, Grid, Tab, TabList, TabPanel, TabPanels, Tabs, Button, Table, Thead, Tbody, Tr, Th, Td, Badge, Card } from "@chakra-ui/react";

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

  return (
    <Box pt={{ base: "20px", md: "80px", xl: "80px" }}>
      <Card p={5} mb={{ base: "0px", lg: "40px" }}>
        <Grid mb={{ base: "0px", lg: "40px" }}>
          <Box mt={5}>
            <Tabs variant="soft-rounded" colorScheme="teal">
              <TabList>
                {showDatatable.map((category) => (
                  <Tab key={category.CategoryID} onClick={() => setSelectedCategory(category)}>
                    <img
                      src={`http://localhost:3000/uploads/${category.ImageURL}`}
                      alt={category.CategoryName}
                      width="25px"
                      className="me-2"
                    />
                    {category.CategoryName}
                  </Tab>
                ))}
                <Button colorScheme="blue" ml={3} onClick={() => setShowForm(!showForm)}>
                  Tạo chuyên mục cha
                </Button>
              </TabList>

              <TabPanels>
                {showDatatable.map((category) => (
                  <TabPanel key={category.CategoryID}>
                    <Table variant="striped" colorScheme="gray">
                      <Thead>
                        <Tr>
                          <Th width="8%" color="white">Ưu tiên</Th>
                          <Th color="white">Tên chuyên mục con</Th>
                          <Th color="white">Liên kết tĩnh</Th>
                          <Th color="white">Thống kê</Th>
                          <Th color="white">Ảnh</Th>
                          <Th color="white">Trạng thái</Th>
                          <Th color="white">Thao tác</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {selectedCategory && (
                          <Tr>
                            <Td><input className="form-control" type="number" value={0} /></Td>
                            <Td>{selectedCategory.CategoryName}</Td>
                            <Td>{selectedCategory.Description}</Td>
                            <Td>
                              <Badge colorScheme="blue">Sản phẩm: {selectedCategory.status}</Badge>
                            </Td>
                            <Td><img src={`http://localhost:3000/uploads/${selectedCategory.ImageURL}`} width="40px" alt={selectedCategory.CategoryName} /></Td>
                            <Td>
                              <select
                                className="form-control"
                                value={selectedCategory.status}
                                onChange={(e) => {
                                  const newStatus = e.target.value;
                                  setCategoryData(prev => ({
                                    ...prev,
                                    status: newStatus,
                                  }));
                                }}
                              >
                                <option value="1">ON</option>
                                <option value="0">OFF</option>
                              </select>
                            </Td>

                            <Td>
                              <a
                                href={`http://localhost:3001/admin/category-edit?id=${selectedCategory.CategoryID}`}
                                className="btn btn-primary"
                              >
                                Edit
                              </a>
                              <Button size="sm" colorScheme="red" ml={2}>Delete</Button>
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

