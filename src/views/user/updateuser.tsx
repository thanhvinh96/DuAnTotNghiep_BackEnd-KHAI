import React, { useState, useEffect } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Select,
  VStack,
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  Card,
  ModalBody,
  ModalFooter,
  useColorModeValue,
} from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import { UserController } from '../../controller/userController.tsx';

export default function UserForm() {
  const location = useLocation(); 
  const query = new URLSearchParams(location.search);
  const id = query.get('id') || ""; // Default to an empty string if id is null

  const [user, setUser] = useState({
    UserID: "",
    Username: "",
    Password: "", // Avoid displaying Password in the form
    Email: "",
    Address: "",
    PhoneNumber: "",
    Role: "User",
    status: "Active",
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalMessage, setModalMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const getDataUserByID = async () => {
    try {
      const data = await UserController.getUserByID(id);
      console.log(data); // Data received from API
      
      // Update user state with data received
      setUser({
        UserID: data.UserID,
        Username: data.Username,
        Email: data.Email,
        Address: data.Address || "", // Default to empty if Address is not available
        PhoneNumber: data.PhoneNumber,
        Role: data.Role || "User", // Use returned Role or default to "User"
        status: data.status || "Active", // Use returned status or default to "Active"
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    if (id) {
      getDataUserByID();
    }
  }, [id]); // Call this effect when id changes

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Submitted user:", user);

    try {
      const updatedUser = await UserController.updateUserByID(user.UserID, user);
      console.log('User updated successfully:', updatedUser); // Log updated user
      
      // Show success modal
      setModalMessage("User updated successfully!");
      setIsSuccess(true);
      onOpen();
    } catch (error) {
      console.error('Error updating user:', error);
      
      // Show error modal
      setModalMessage("Error updating user. Please try again.");
      setIsSuccess(false);
      onOpen();
    }
  };
  const tableBg = useColorModeValue("white", "gray.800");

  return (
    <Box pt={{ base: "20px", md: "80px", xl: "80px" }}>
    <Card p={5} mb={{ base: "0px", lg: "40px" }} style={{ height: 'auto', width: '100%' }}>
      <Box w="100%" bg={tableBg} borderRadius="lg" boxShadow="md" p="20px">
        <form onSubmit={handleSubmit}>
          <VStack spacing={4} align="stretch">
            {/* Username */}
            <FormControl id="Username">
              <FormLabel>Username</FormLabel>
              <Input
                type="text"
                name="Username"
                value={user.Username}
                onChange={handleChange}
                placeholder="Enter Username"
              />
            </FormControl>

            {/* Password (optional) */}
            <FormControl id="Password">
              <FormLabel>Password (leave empty to keep current)</FormLabel>
              <Input
                type="password"
                name="Password"
                value={user.Password}
                onChange={handleChange}
                placeholder="Enter Password"
              />
            </FormControl>

            {/* Email */}
            <FormControl id="Email">
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                name="Email"
                value={user.Email}
                onChange={handleChange}
                placeholder="Enter Email"
              />
            </FormControl>

            {/* Address */}
            <FormControl id="Address">
              <FormLabel>Address</FormLabel>
              <Input
                type="text"
                name="Address"
                value={user.Address}
                onChange={handleChange}
                placeholder="Enter Address"
              />
            </FormControl>

            {/* Phone Number */}
            <FormControl id="PhoneNumber">
              <FormLabel>Phone Number</FormLabel>
              <Input
                type="tel"
                name="PhoneNumber"
                value={user.PhoneNumber}
                onChange={handleChange}
                placeholder="Enter Phone Number"
              />
            </FormControl>

            {/* Role */}
            <FormControl id="Role">
              <FormLabel>Role</FormLabel>
              <Select name="Role" value={user.Role} onChange={handleChange}>
                <option value="User">User</option>
                <option value="Admin">Admin</option>
              </Select>
            </FormControl>

            {/* Status */}
            <FormControl id="status">
              <FormLabel>Status</FormLabel>
              <Select name="status" value={user.status} onChange={handleChange}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </Select>
            </FormControl>

            <Button
            type="submit"
            colorScheme="teal"
            size="lg"
            width="full"
            borderRadius="md"
          >
            Cập Nhật Thông Tin Tài Khoản
          </Button>
          </VStack>
        </form>

      {/* Modal for success/error message */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{isSuccess ? "Success" : "Error"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>{modalMessage}</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      </Box>
      </Card>
    </Box>
  );
}
