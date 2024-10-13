import './assets/css/App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import AuthLayout from './layouts/auth';
import AdminLayout from './layouts/admin/index';
import RTLLayout from './layouts/rtl';
import 'select2';
import 'select2/dist/css/select2.css'; // Nhập CSS nếu cần

import RouteScrollToTop from "./client/helper/RouteScrollToTop";
import HomePageOne from "./client/pages/HomePageOne";
import PhosphorIconInit from "./client/helper/PhosphorIconInit";
import HomePageTwo from "./client/pages/HomePageTwo";
import ShopPage from "./client/pages/ShopPage";
import ProductDetailsPageOne from "./client/pages/ProductDetailsPageOne";
import Profile from "./client/pages/Profile";
import ProductDetailsPageTwo from "./client/pages/ProductDetailsPageTwo";
import CartPage from "./client/pages/CartPage";
import CheckoutPage from "./client/pages/CheckoutPage";
import AccountPage from "./client/pages/AccountPage";
import BlogPage from "./client/pages/BlogPage";
import BlogDetailsPage from "./client/pages/BlogDetailsPage";
import ContactPage from "./client/pages/ContactPage";
import LoginPage from "./client/pages/Login";
import RegisterPage from "./client/pages/Register";
import CategoryManagement from './views/category/categorymanagement.tsx'; // Ensure the path starts with './'
import VoucherManagement from './views/voucher/managentvoucher.tsx'; // Ensure the path starts with './'
import Product from 'views/product/productmanagement.tsx';
import Productcreate from 'views/product/createproduct.tsx';
import UpdateVoucher from './views/voucher/updatevoucher.tsx';
import ProtectedRoute from './ProtectedRoute';

import {
  ChakraProvider,
} from '@chakra-ui/react';
import initialTheme from './theme/theme'; // { themeGreen }
import { useState } from 'react';

// Component cho Client và các chi tiết


export default function Main() {
  const [currentTheme, setCurrentTheme] = useState(initialTheme);

  return (
    <ChakraProvider theme={currentTheme}>
            <RouteScrollToTop />
            <PhosphorIconInit />
      <Routes>
      <Route path="auth/*" element={<AuthLayout />} />

{/* Router cho admin và các trang bên trong */}
<Route path="admin/*" element={<AdminLayout theme={currentTheme} setTheme={setCurrentTheme} />}>
  <Route path="category-management" element={<CategoryManagement />} />
  <Route path="category-edit" element={<CategoryManagement />} />
  <Route path="products-management" element={<Product />} />
  <Route path="products-create" element={<Productcreate />} />
  <Route path="voucher-management" element={<VoucherManagement />} />
  {/* <Route path="voucher-update" element={<VoucherManagement />} /> */}
</Route>


        {/* Route cho client */}
        <Route path="client" element={<HomePageTwo />} />
            <Route exact path="/" element={<HomePageTwo />} />
            <Route exact path="/shop" element={<ShopPage />} />
            <Route exact path="/profile" element={<Profile />} />
            <Route exact path="/login" element={<ProtectedRoute element={LoginPage} />} />
            <Route exact path="/register" element={<ProtectedRoute element={RegisterPage} />} />
            <Route exact path="/product-details" element={<ProductDetailsPageTwo />} />
            <Route exact path="/cart" element={<CartPage />} />
            <Route exact path="/checkout" element={<CheckoutPage />} />
            <Route exact path="/account" element={<AccountPage />} />
            <Route exact path="/blog" element={<BlogPage />} />
            <Route exact path="/blog-details" element={<BlogDetailsPage />} />
            <Route exact path="/contact" element={<ContactPage />} />

        <Route
          path="rtl/*"
          element={
            <RTLLayout theme={currentTheme} setTheme={setCurrentTheme} />
          }
        />
        
        {/* Redirect từ root đến admin */}
        <Route path="/" element={<Navigate to="/client" replace />} />
      </Routes>
    </ChakraProvider>
  );
}
