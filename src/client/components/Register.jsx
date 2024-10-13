import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2'; // Nhập SweetAlert2

const Register = () => {
    const [formData, setFormData] = useState({
        Username: '',
        Email: '',
        PhoneNumber: '',
        Password: '',
        Address: 'Giá trị test',
        Role: 'Client',
        status: 'active',
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);

        fetch('http://localhost:3000/api/user/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            Swal.fire({
                title: 'Thành Công',
                text: 'Đăng ký thành công!',
                icon: 'success',
                confirmButtonText: 'Đóng',
            }).then((result) => {
                if (result.isConfirmed) {
                    // Chuyển hướng đến trang đăng nhập
                    window.location.href = '/login'; // Đường dẫn đến trang đăng nhập
                }
            });
        })
        .catch((error) => {
            console.error('Error:', error);
            Swal.fire({ // Sử dụng SweetAlert2 để hiển thị thông báo lỗi
                title: 'Thất Bại',
                text: 'Đăng ký thất bại! Vui lòng thử lại.',
                icon: 'error',
                confirmButtonText: 'Đóng',
            });
        });
    };

    return (
        <section className="account py-80">
            <div className="container container-lg">
                <form onSubmit={handleSubmit}>
                    <div className="row gy-4">
                        <div className="col-xl-12 pe-xl-5">
                            <div className="border border-gray-100 hover-border-main-600 transition-1 rounded-16 px-24 py-40 h-100">
                                <h6 className="text-xl mb-32">Đăng Ký Tài Khoản</h6>

                                <div className="mb-24">
                                    <label htmlFor="Username" className="text-neutral-900 text-lg mb-8 fw-medium">
                                        Nhập Đầy Đủ Họ Tên <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="common-input"
                                        id="Username"
                                        onChange={handleChange}
                                        value={formData.Username}

                                        placeholder="Nhập Họ Và Tên"
                                    />
                                </div>

                                <div className="mb-24">
                                    <label htmlFor="Email" className="text-neutral-900 text-lg mb-8 fw-medium">
                                        Nhập Email <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        className="common-input"
                                        id="Email"
                                        onChange={handleChange}
                                        placeholder="Nhập Email"
                                        value={formData.Email}
                                    />
                                </div>

                                <div className="mb-24">
                                    <label htmlFor="PhoneNumber" className="text-neutral-900 text-lg mb-8 fw-medium">
                                        Nhập Phone <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="common-input"
                                        id="PhoneNumber"
                                        onChange={handleChange}
                                        placeholder="Nhập Phone"
                                        value={formData.PhoneNumber}
                                    />
                                </div>

                                <div className="mb-24">
                                    <label htmlFor="Password" className="text-neutral-900 text-lg mb-8 fw-medium">
                                        Nhập Mật Khẩu
                                    </label>
                                    <div className="position-relative">
                                        <input
                                            type="password"
                                            className="common-input"
                                            id="Password"
                                            onChange={handleChange}
                                            placeholder="Nhập Mật Khẩu"
                                            value={formData.Password}
                                        />
                                        <span
                                            className="toggle-Password position-absolute top-50 inset-inline-end-0 me-16 translate-middle-y cursor-pointer ph ph-eye-slash"
                                            id="#Password"
                                        />
                                    </div>
                                </div>

                                <div className="mb-24 mt-48">
                                    <div className="flex-align gap-48 flex-wrap">
                                        <button type="submit" className="btn btn-main py-18 px-40">
                                            Đăng Ký
                                        </button>
                                        <Link to="/login" className="btn btn-secondary py-18 px-40">
            Đăng Nhập
        </Link>
                                    </div>
                                </div>

                                <div className="mt-48">
                                    <Link
                                        to="#"
                                        className="text-danger-600 text-sm fw-semibold hover-text-decoration-underline"
                                    >
                                        Quên Mật Khẩu ?
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default Register;
