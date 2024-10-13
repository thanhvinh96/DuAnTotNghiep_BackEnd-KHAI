import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element: Component }) => {
    const token = localStorage.getItem('tokenUser'); // Lấy token từ localStorage

    // Nếu có token, điều hướng đến trang chính (hoặc trang bạn muốn)
    return token ? <Navigate to="/" /> : <Component />;
};

export default ProtectedRoute;
