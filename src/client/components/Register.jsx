import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2'; // Nhập SweetAlert2

const Register = () => {
    const [formData, setFormData] = useState({
        Username: '',
        Email: '',
        PhoneNumber: '',
        Password: '',
    });

    const [errors, setErrors] = useState({}); // State để lưu trữ thông báo lỗi

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value,
        }));

        // Xóa lỗi khi người dùng bắt đầu nhập lại
        setErrors((prevErrors) => ({
            ...prevErrors,
            [id]: '', // Xóa thông báo lỗi tương ứng
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.Username) {
            newErrors.Username = 'Họ tên là bắt buộc.';
        }
        if (!formData.Email) {
            newErrors.Email = 'Email là bắt buộc.';
        } else if (!/\S+@\S+\.\S+/.test(formData.Email)) {
            newErrors.Email = 'Email không hợp lệ.';
        }
        if (!formData.PhoneNumber) {
            newErrors.PhoneNumber = 'Số điện thoại là bắt buộc.';
        } else if (!/^\d+$/.test(formData.PhoneNumber)) {
            newErrors.PhoneNumber = 'Số điện thoại không hợp lệ.';
        }
        if (!formData.Password) {
            newErrors.Password = 'Mật khẩu là bắt buộc.';
        } else if (formData.Password.length < 6) {
            newErrors.Password = 'Mật khẩu phải có ít nhất 6 ký tự.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Trả về true nếu không có lỗi
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return; // Không tiếp tục nếu có lỗi
        }
    
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
            if (data.status === true) {
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
            } else {
                // Xử lý trường hợp thất bại
                Swal.fire({
                    title: 'Thất Bại',
                    text: data.message || 'Đăng ký thất bại! Vui lòng thử lại.', // Hiển thị thông điệp từ server nếu có
                    icon: 'error',
                    confirmButtonText: 'Đóng',
                });
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            Swal.fire({
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
                                        className={`common-input ${errors.Username ? 'is-invalid' : ''}`}
                                        id="Username"
                                        onChange={handleChange}
                                        value={formData.Username}
                                        placeholder="Nhập Họ Và Tên"
                                    />
                                    {errors.Username && <div className="text-danger">{errors.Username}</div>}
                                </div>

                                <div className="mb-24">
                                    <label htmlFor="Email" className="text-neutral-900 text-lg mb-8 fw-medium">
                                        Nhập Email <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        className={`common-input ${errors.Email ? 'is-invalid' : ''}`}
                                        id="Email"
                                        onChange={handleChange}
                                        placeholder="Nhập Email"
                                        value={formData.Email}
                                    />
                                    {errors.Email && <div className="text-danger">{errors.Email}</div>}
                                </div>

                                <div className="mb-24">
                                    <label htmlFor="PhoneNumber" className="text-neutral-900 text-lg mb-8 fw-medium">
                                        Nhập Phone <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className={`common-input ${errors.PhoneNumber ? 'is-invalid' : ''}`}
                                        id="PhoneNumber"
                                        onChange={handleChange}
                                        placeholder="Nhập Phone"
                                        value={formData.PhoneNumber}
                                    />
                                    {errors.PhoneNumber && <div className="text-danger">{errors.PhoneNumber}</div>}
                                </div>

                                <div className="mb-24">
                                    <label htmlFor="Password" className="text-neutral-900 text-lg mb-8 fw-medium">
                                        Nhập Mật Khẩu
                                    </label>
                                    <div className="position-relative">
                                        <input
                                            type="password"
                                            className={`common-input ${errors.Password ? 'is-invalid' : ''}`}
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
                                    {errors.Password && <div className="text-danger">{errors.Password}</div>}
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
