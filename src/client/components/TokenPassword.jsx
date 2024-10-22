import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2'; // Nhập SweetAlert2

const TokenPasswords = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const [formData, setFormData] = useState({
        token: token,
        newPassword: '',
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData);
        
        // Send POST request to update the password
        try {
            const response = await fetch('http://localhost:3000/api/user/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.status) {
                Swal.fire({
                    title: 'Thành Công',
                    text: 'Đổi mật khẩu thành công!',
                    icon: 'success',
                    confirmButtonText: 'Đóng',
                });
            } else {
                Swal.fire({
                    title: 'Thất Bại',
                    text: 'Đổi mật khẩu thất bại! Vui lòng thử lại.',
                    icon: 'error',
                    confirmButtonText: 'Đóng',
                });
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                title: 'Lỗi',
                text: 'Có lỗi xảy ra. Vui lòng thử lại.',
                icon: 'error',
                confirmButtonText: 'Đóng',
            });
        }
    };

    return (
        <section className="account py-80">
            <div className="container container-lg">
                <form onSubmit={handleSubmit}>
                    <div className="row gy-4">
                        {/* Login Card Start */}
                        <div className="col-xl-12 pe-xl-5">
                            <div className="border border-gray-100 hover-border-main-600 transition-1 rounded-16 px-24 py-40 h-100">
                                <h6 className="text-xl mb-32">Nhập Mật Khẩu Mới</h6>

                                <div className="mb-24">
                                    <label
                                        htmlFor="newPassword"
                                        className="text-neutral-900 text-lg mb-8 fw-medium"
                                    >
                                        Nhập Mật Khẩu Mới
                                    </label>
                                    <div className="position-relative">
                                        <input
                                            type="password" // Chỉnh sửa từ Password thành password
                                            className="common-input"
                                            id="newPassword" // Cập nhật ID cho input
                                            onChange={handleChange}
                                            value={formData.newPassword}
                                            placeholder="Enter Password"
                                        />
                                        <span
                                            className="toggle-Password position-absolute top-50 inset-inline-end-0 me-16 translate-middle-y cursor-pointer ph ph-eye-slash"
                                            id="#Password"
                                        />
                                    </div>
                                </div>

                                <div className="mb-24 mt-48">
                                    <div className="flex-align gap-48 flex-wrap">
                                        {/* Nút Đổi Mật Khẩu */}
                                        <button type="submit" className="btn btn-main py-18 px-40">
                                            Đổi Mật Khẩu
                                        </button>

                                        {/* Nút Đăng Ký */}
                                        <Link to="/register" className="btn btn-secondary py-18 px-40">
                                            Đăng Ký
                                        </Link>
                                    </div>
                                </div>

                                <div className="mt-48">
                                    <Link
                                        to="/forgot-password"
                                        className="text-danger-600 text-sm fw-semibold hover-text-decoration-underline"
                                    >
                                        Quên Mật Khẩu
                                    </Link>
                                </div>
                            </div>
                        </div>
                        {/* Đăng Nhập Tài Khoản Card End */}
                    </div>
                </form>
            </div>
        </section>
    );
};

export default TokenPasswords;
