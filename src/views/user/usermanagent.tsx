import {
    Avatar,
    Box,
    Flex,
    FormLabel,
    Icon,
    Select,
    SimpleGrid,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Input,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    Badge,
    ModalHeader,
    ModalCloseButton,
    useColorModeValue,
    ModalBody,
    ModalFooter,
} from "@chakra-ui/react";

import { UserController } from '../../controller/userController.tsx'
import {
    MdAddTask,
    MdAttachMoney,
    MdBarChart,
    MdFileCopy,
} from "react-icons/md";
import Usa from "assets/img/dashboards/usa.png";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function UserManagementView() {
    const tableBg = useColorModeValue("white", "gray.800");

    const navigate = useNavigate();
    const brandColor = useColorModeValue("brand.500", "white");
    const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
    const fetchUsers = async () => {

        try {
            const data: any = await UserController.fetchUsers();
            console.log(data)
            setUsers(data);
        } catch (error) {
            console.error(error);
        }
    }
    useEffect(() => {
        fetchUsers();
    }, [])
    const [users, setUsers] = useState([

    ]);
    const [status, setStatus] = useState([]);

    const [filter, setFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10;
    const [isOpen, setIsOpen] = useState(false); // State to control modal visibility
    const [newUser, setNewUser] = useState({ Username: '', Email: '', PhoneNumber: '', Address: '', Role: 'User', status: 'Active', Password: '' });


    const filteredUsers = users.filter(user =>
        user.Username.toLowerCase().includes(filter.toLowerCase()) ||
        user.Email.toLowerCase().includes(filter.toLowerCase())
    );

    const totalUsers = filteredUsers.length;
    const totalPages = Math.ceil(totalUsers / usersPerPage);
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const hanlClickUpdate = (userId: any) => {
        navigate(`/admin/update-user?id=${userId}`)
    }

    const handleCreateUser = async () => {
        try {

            setIsOpen(false); // Đóng modal
            // setNewUser({ Username: '', Email: '', PhoneNumber: '', Address: '', Role: 'User', status: 'Active', Password: '' }); // Reset form

            const data = await UserController.createUser(newUser);
            console.log(data)
        } catch (error) {
            console.error('Error:', error);
            alert('Đã có lỗi xảy ra khi tạo người dùng');
        }
    };
    const [isUpdateSuccess, setIsUpdateSuccess] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');

    const handleUpdateClick = (user:any) => {
      setSelectedAddress(user.Address);
      hanlClickUpdate(user.UserID);
    };
  
    const handleStatusClick = (status:any) => {
      setSelectedStatus(status); // Lưu trạng thái để hiển thị trong modal
      setIsUpdateSuccess(true); // Mở modal
    };
    const handleStatusChange = async (user: any) => {
        try {
            // Xác định giá trị của Status
            const Status = user.status === 'Active' ? 'Inactive' : 'Active';

            // In ra user.UserID và Status
            console.log("User ID:", user.UserID);
            console.log("Status:", Status);

            const updatedUsers = {
                status: Status, // Sử dụng biến Status đã xác định
            };
            console.log(updatedUsers);
            // Gọi API để cập nhật trạng thái người dùng
            await UserController.updateStatusByID(user.UserID, updatedUsers);

            // // Nếu cập nhật thành công, hiển thị modal thông báo
            setIsUpdateSuccess(true);
            fetchUsers();
            // updateStatus(); // Gọi hàm cập nhật trạng thái
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Đã có lỗi xảy ra khi cập nhật trạng thái');
        }
    };
    const [addressByUser,setaddressByUser]=useState([]);
    const fetchUserAddresses = async (UserID:string) => {
        try {
            const response:any = await fetch('http://localhost:3000/api/address/byuser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    "UserID": UserID

                 }), // Gửi userId trong body của request
            });
    
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            const data = await response.json(); // Chuyển đổi phản hồi thành JSON
            setaddressByUser(data)
            return data; // Trả về dữ liệu địa chỉ
        } catch (error) {
            console.error('Failed to fetch user addresses:', error);
            throw error; // Ném lỗi để xử lý sau
        }
    };
    return (
        <Box pt={{ base: "20px", md: "80px", xl: "80px" }}>
            <SimpleGrid
                columns={3} // Force three columns
                gap="20px"
                mb="20px"
                width="100%" // Ensures full width
            >

            </SimpleGrid>

            <Box bg="white" borderRadius="md" boxShadow="md" p={5}>
                <Flex mb={4} align="center">
                    <Input
                        placeholder="Search by Username or Email"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        width="300px"
                        mr={2}
                    />
                    <Button colorScheme="teal"   borderRadius="md" onClick={() => setFilter("")}>
                        Xóa Bộ Lọc
                    </Button>
                    <Button     borderRadius="md" // Hình vuông với góc bo nhẹ
colorScheme="blue" ml={2} onClick={() => setIsOpen(true)}>
                        Tạo Tài Khoản
                    </Button>
                </Flex>
                <Box overflowX="auto">
                    <Table  size="sm">
                        <Thead>
                            <Tr>
                                <Th color="black">Hành Động</Th>
                                <Th color="black">User ID</Th>
                                <Th color="black">Username</Th>
                                <Th color="black">Email</Th>
                                <Th color="black">Phone Number</Th>
                                <Th color="black">Role</Th>
                                <Th color="black">Status</Th>
                                <Th color="black">Địa Chỉ</Th>


                            </Tr>
                        </Thead>
                        <Tbody>
  {currentUsers.map((user: any, index) => (
    <Tr key={index}>
      <Td>
      <Button
  colorScheme="blue"
  variant="solid"
  borderRadius="md"
  size="sm" 
  onClick={() => hanlClickUpdate(user.UserID)}
>
  Cập nhật
</Button>
<Button
  colorScheme={user.status === 'Active' ? 'red' : 'green'}
  variant="solid"
  borderRadius="md"
  size="sm"  
  onClick={() => handleStatusChange(user)}
>
  {user.status === 'Active' ? 'Block' : 'Unblock'}
</Button>


        <Modal isOpen={isUpdateSuccess} onClose={() => setIsUpdateSuccess(false)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Success</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <p>Cập nhật trạng thái người dùng thành công!</p>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" onClick={() => setIsUpdateSuccess(false)}>
                Đóng
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Td>

      {/* UserID Column */}
      <Td color={user.UserID === 'admin' ? 'blue.500' : 'black'}>{user.UserID}</Td>

      {/* Username Column */}
      <Td >
      <Badge colorScheme="green">
          {user.Username}
        </Badge>
      </Td>

      {/* Email Column */}
      <Td >
      <Badge colorScheme="purple">
          {user.Email}
        </Badge>
      </Td>

      {/* PhoneNumber Column */}
      <Td >
      <Badge colorScheme="teal">
          {user.PhoneNumber}
        </Badge>
      </Td>
     
      {/* Role Column with Badge */}
      <Td>
        <Badge colorScheme={user.Role === 'Admin' ? 'orange' : 'gray'}>
          {user.Role}
        </Badge>
      </Td>

      {/* Status Column with Badge */}
      <Td>
      <Badge colorScheme={user.status === 'active' ? 'green' : 'red'}>
  {user.status === 'active' ? 'Hoạt động' : 'Bị chặn'}
</Badge>

      </Td>
      <Td>
  <Button
    colorScheme='green'
    variant="solid"
    onClick={() => {
        fetchUserAddresses(user.UserID );
      setIsUpdateSuccess(true); // Mở modal khi nhấn nút
    }}
  >
Xem Địa Chỉ
  </Button>

  {/* Modal hiển thị trạng thái */}
  <Modal isOpen={isUpdateSuccess} onClose={() => setIsUpdateSuccess(false)}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Trạng thái người dùng</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
      <ul>
                {addressByUser.map(address => (
                    <li key={address.id_address}>
                        <strong>Tên: </strong>{address.name}<br />
                        <strong>Địa chỉ: </strong>{address.address}<br />
                        <strong>Loại địa chỉ: </strong>{address.addressType}<br />
                        <strong>Số điện thoại: </strong>{address.phone}
                    </li>
                ))}
            </ul>
      </ModalBody>
      <ModalFooter>
        <Button colorScheme="blue" onClick={() => setIsUpdateSuccess(false)}>
          Đóng
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
</Td>
    </Tr>
  ))}
</Tbody>


                    </Table>
                </Box>
                <Flex mt={4} justify="space-between" align="center">
                    <Button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        isDisabled={currentPage === 1}
                    >
                        Previous
                    </Button>
                    <Flex>
                        {[...Array(totalPages)].map((_, index) => (
                            <Button
                                key={index + 1}
                                onClick={() => setCurrentPage(index + 1)}
                                variant={currentPage === index + 1 ? "solid" : "outline"}
                                mx={1}
                            >
                                {index + 1}
                            </Button>
                        ))}
                    </Flex>
                    <Button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        isDisabled={currentPage === totalPages}
                    >
                        Next
                    </Button>
                </Flex>
            </Box>

            {/* Modal for creating a new user */}
            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Create User</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormLabel htmlFor="Username">Username</FormLabel>
                        <Input
                            id="Username"
                            value={newUser.Username}
                            onChange={(e) => setNewUser({ ...newUser, Username: e.target.value })}
                            placeholder="Enter Username"
                            mb={4}
                        />
                        <FormLabel htmlFor="Email">Email</FormLabel>
                        <Input
                            id="Email"
                            type="Email"
                            value={newUser.Email}
                            onChange={(e) => setNewUser({ ...newUser, Email: e.target.value })}
                            placeholder="Enter Email"
                            mb={4}
                        />
                        <FormLabel htmlFor="PhoneNumber">Phone Number</FormLabel>
                        <Input
                            id="PhoneNumber"
                            value={newUser.PhoneNumber}
                            onChange={(e) => setNewUser({ ...newUser, PhoneNumber: e.target.value })}
                            placeholder="Enter phone number"
                            mb={4}
                        />
                        <FormLabel htmlFor="Address">Address</FormLabel>
                        <Input
                            id="Address"
                            value={newUser.Address}
                            onChange={(e) => setNewUser({ ...newUser, Address: e.target.value })}
                            placeholder="Enter Address"
                            mb={4}
                        />
                        <Input
                            id="Password"
                            value={newUser.Password}
                            onChange={(e) => setNewUser({ ...newUser, Password: e.target.value })}
                            placeholder="Enter Address"
                            mb={4}
                        />
                        <FormLabel htmlFor="Role">Role</FormLabel>
                        <Select
                            id="Role"
                            value={newUser.Role}
                            onChange={(e) => setNewUser({ ...newUser, Role: e.target.value })}
                            mb={4}
                        >
                            <option value="User">User</option>
                            <option value="Admin">Admin</option>
                        </Select>
                        <FormLabel htmlFor="status">Status</FormLabel>
                        <Select
                            id="status"
                            value={newUser.status}
                            onChange={(e) => setNewUser({ ...newUser, status: e.target.value })}
                            mb={4}
                        >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </Select>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={handleCreateUser}>
                            Create User
                        </Button>
                        <Button variant="ghost" onClick={() => setIsOpen(false)}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
}
