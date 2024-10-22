import React,{useState} from 'react'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'; // Nhập SweetAlert2

const Forgotpasswords = () => {
    const [formData, setFormData] = useState({
    
        Email: '',
    
        Password: '',
     
    });
    const [errors, setErrors] = useState({}); // State để lưu trữ thông báo lỗi

    const validateForm = () => {
        const newErrors = {};
    
        if (!formData.Email) {
            newErrors.Email = 'Email là bắt buộc.';
        } else if (!/\S+@\S+\.\S+/.test(formData.Email)) {
            newErrors.Email = 'Email không hợp lệ.';
        }
       

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Trả về true nếu không có lỗi
    };
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
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return; // Không tiếp tục nếu có lỗi
        }
    
        console.log(formData);
    
        try {
            const response = await fetch('http://localhost:3000/api/user/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
    
            const data = await response.json();
    
            if (data.status === true) {
                console.log('Success:', data);
                const result = await Swal.fire({
                    title: 'Thành Công',
                    text: 'Vui Lòng Kiểm Tra Email Để Đổi Mật Khẩu',
                    icon: 'success',
                    confirmButtonText: 'Đóng',
                });
                if (result.isConfirmed) {
                    // Chuyển hướng đến trang đăng nhập
                    window.location.href = '/login'; // Đường dẫn đến trang đăng nhập
                }
            } else {
                Swal.fire({
                    title: 'Thất Bại',
                    text: 'Vui lòng thử lại.',
                    icon: 'error',
                    confirmButtonText: 'Đóng',
                });
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                title: 'Thất Bại',
                text: 'Vui lòng thử lại.',
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
                                <h6 className="text-xl mb-32">Lấy Lại Mật Khẩu </h6>
                               
                                <div className="mb-24">
                                    <label
                                        htmlFor="Email"
                                        className="text-neutral-900 text-lg mb-8 fw-medium"
                                    >
                                        Nhập Mail <span className="text-danger">*</span>{" "}
                                    </label>
                                    <input
                                        type="text"
                                        className="common-input"
                                        id="Email"
                                        onChange={handleChange}
                                        value={formData.Email}
                                        placeholder="First Name"
                                    />
                                </div>
                               
                              
                                <div className="mb-24 mt-48">
    <div className="flex-align gap-48 flex-wrap">
        {/* Nút Đăng Nhập */}
        <button type="submit" className="btn btn-main py-18 px-40">
            Gửi Token Đổi Mật Khẩu
        </button>

        {/* Nút Đăng Ký */}
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
                                        Đăng Ký
                                    </Link>
                                </div>
                            </div>
                        </div>
                        {/* Đăng Nhập Tài Khoản Card End */}
                        {/* Register Card Start */}
                   
                        {/* Register Card End */}
                    </div>
                </form>
            </div>
        </section>

    )
}

export default Forgotpasswords;