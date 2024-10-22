import React, { useEffect } from 'react';
import Preloader from "../helper/Preloader";
import HeaderTwo from "../components/HeaderTwo";
import Breadcrumb from "../components/Breadcrumb";
import FooterTwo from "../components/FooterTwo";
import BottomFooter from "../components/BottomFooter";
import ShippingOne from "../components/ShippingOne";
import TokenPasswords from "../components/TokenPassword";
import ScrollToTop from "react-scroll-to-top";
import ColorInit from "../helper/ColorInit";

export default function TokenPassword() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    useEffect(() => {
        const getURL = async () => {
            console.log("giá trị token: " + token);
            if (token) {
                try {
                    // Chú ý là bạn cần sửa URL ở đây
                    const response = await fetch(`http://localhost:3000/api/user/check-password`, {
                        method: 'POST', // Sử dụng phương thức POST
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({token: token }), // Gửi token trong body
                    });                    
                    const data = await response.json();

                    if (data.status === true) {
                        // Token hợp lệ, cho phép truy cập trang
                        console.log('Token is valid:', token);
                    } else {
                        // Token không hợp lệ, chuyển hướng đến trang đăng nhập
                        window.location.href = '/login'; // Bỏ chú thích nếu bạn muốn chuyển hướng
                    }
                } catch (error) {
                    console.error('Error checking token:', error);
                    // Chuyển hướng đến trang đăng nhập trong trường hợp lỗi
                    window.location.href = '/login'; // Bỏ chú thích nếu bạn muốn chuyển hướng
                }
            } else {
                // Không có token trong URL, chuyển hướng đến trang đăng nhập
                window.location.href = '/login'; // Bỏ chú thích nếu bạn muốn chuyển hướng
            }
        };

        getURL();
    }, [token]); // Chạy hàm khi component được mount

  return (
    <>
      {/* ColorInit */}
      <ColorInit color={true} />

      {/* ScrollToTop */}
      <ScrollToTop smooth color="#FA6400" />

      {/* Preloader */}
      <Preloader />

      {/* HeaderTwo */}
      <HeaderTwo category={true} />

      {/* Breadcrumb */}
      <Breadcrumb title={"Đổi Mật Khẩu Tài Khoản"} />

      {/* Account */}
      <TokenPasswords />

      {/* ShippingOne */}
      <ShippingOne />

      {/* FooterTwo */}
      <FooterTwo />

      {/* BottomFooter */}
      <BottomFooter />
    </>
  );
}
