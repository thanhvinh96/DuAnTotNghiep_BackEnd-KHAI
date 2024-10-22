import React from 'react';

import { Icon } from '@chakra-ui/react';
import jwtDecode from 'jwt-decode';

import {
  MdBarChart,
  MdPerson,
  MdHome,
  MdLock,
  MdOutlineShoppingCart,
} from 'react-icons/md';
import SignInCentered from 'views/auth/signIn';

// Admin Imports
import MainDashboard from 'views/admin/default';
import NFTMarketplace from 'views/admin/marketplace';
import Profile from 'views/admin/profile';
import DataTables from 'views/admin/dataTables';
import RTL from 'views/admin/rtl';
import Category from 'views/category/categorymanagement.tsx';
import Product from 'views/product/productmanagement.tsx';
import Productcreate from 'views/product/createproduct.tsx';
import Categoryedit from 'views/category/categoryedit.tsx';
import Productedit from 'views/product/productedit.tsx';
import UserManagent from 'views/user/usermanagent.tsx';
import UserUpdate from 'views/user/updateuser.tsx';
import Managentbank from 'views/bank/managentbank.tsx';
import VoucherManagement from './views/voucher/managentvoucher.tsx'; // Ensure the path starts with './'
import OrderManagement from './views/order/orderManagent.tsx'; // Ensure the path starts with './'
import Orderdetail from './views/order/orderDetail.tsx'; // Ensure the path starts with './'
import UpdateVoucher from './views/voucher/updatevoucher.tsx';
import Reviewmanagent from './views/review/reviewmanagent.tsx';

// Auth Imports

const routes = [
  {
    name: 'Trang chủ',
    layout: '/admin',
    path: '/default',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: <MainDashboard />,
  },
  {
    name: 'Danh Mục',
    path: '/category',
    layout: '/admin',

    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: <Category />,
  },
  {

    path: '/category-edit',
    layout: '/admin',

    component: <Categoryedit />,
    icon: null, // Không có icon
    hidden: true, // Thêm thuộc tính này để ẩn route khỏi menu
  },
  {

    path: '/products-edit',
    layout: '/admin',

    component: <Productedit />,
    icon: null, // Không có icon
    hidden: true, // Thêm thuộc tính này để ẩn route khỏi menu
  },
  {
    name: 'Sản Phẩm',
    layout: '/admin',
    path: '/products-managent',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: <Product />,
  },
  {
    name: 'Tạo Sản Phẩm', // Tên cho route tạo sản phẩm
    layout: '/admin',
    path: '/products-create', // Đường dẫn mới cho việc tạo sản phẩm
    icon: null, // Không có icon
    component: <Productcreate />, // Sử dụng component ProductCreate
    hidden: true, // Thêm thuộc tính này để ẩn route khỏi menu
  },
  {
    // name: 'Tạo Sản Phẩm', // Tên cho route tạo sản phẩm
    layout: '/admin',
    path: '/order-detail', // Đường dẫn mới cho việc tạo sản phẩm
    icon: null, // Không có icon
    component: <Orderdetail />, // Sử dụng component ProductCreate
    hidden: true, // Thêm thuộc tính này để ẩn route khỏi menu
  },
  {
    name: 'Đơn Hàng',
    layout: '/admin',
    path: '/order-managent',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: <OrderManagement />,
  },
  {
    name: 'Thành Viên',
    layout: '/admin',
    path: '/user-managent',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: <UserManagent />,
  },
  {
    name: 'Review',
    layout: '/admin',
    path: '/review-managent',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: <Reviewmanagent />,
  },
  {

    path: '/update-user',
    layout: '/admin',

    component: <UserUpdate />,
    icon: null, // Không có icon
    hidden: true, // Thêm thuộc tính này để ẩn route khỏi menu
  },
  {
    name: 'Phiếu Giảm Giá',
    layout: '/admin',
    path: '/voucher-managent',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: <VoucherManagement />,
  },
  {
    name: 'Ngân Hàng',
    layout: '/admin',
    path: '/bank-managent',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: <Managentbank />,
  },
    {
    // name: 'Phiếu Giảm Giá',
    layout: '/admin',
    path: '/voucher-update',
    // icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    icon: null, // Không có icon
    hidden: true, // Thêm thuộc tính này để ẩn route khỏi menu
    component: <UpdateVoucher />,
  },
  {
    layout: '/auth',
    path: '/login',
    icon: null, // Không có icon
    hidden: true, // Thêm thuộc tính này để ẩn route khỏi menu
    component: <SignInCentered />,
  },
  // {
  //   name: 'Thanh Toán',
  //   layout: '/admin',
  //   path: '/default',
  //   icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
  //   component: <MainDashboard />,
  // },
  // {
  //   name: 'Trang Web',
  //   layout: '/admin',
  //   path: '/default',
  //   icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
  //   component: <MainDashboard />,
  // },
 
];

export default routes;
