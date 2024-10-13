import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Checkout.css'; // Import custom CSS for styling

const Checkout = () => {
    const [selectedPayment, setSelectedPayment] = useState("payment1");
    const [discountCode, setDiscountCode] = useState("");
    const [products] = useState([
        { id: 1, name: "Sản phẩm 1", quantity: 2, price: 100000 },
        { id: 2, name: "Sản phẩm 2", quantity: 1, price: 50000 },
        { id: 3, name: "Sản phẩm 3", quantity: 3, price: 150000 }
    ]);
    const [totalPrice, setTotalPrice] = useState(0);

    const calculateTotalPrice = () => {
        return products.reduce((acc, product) => acc + product.price * product.quantity, 0);
    };

    const handlePaymentChange = (event) => {
        setSelectedPayment(event.target.id);
    };

    const handleDiscountChange = (event) => {
        setDiscountCode(event.target.value);
    };

    const handleApplyDiscount = () => {
        if (discountCode === "DISCOUNT10") {
            alert("Áp dụng giảm giá 10%");
            setTotalPrice(totalPrice * 0.9); // Apply 10% discount
        } else {
            alert("Mã giảm giá không hợp lệ");
        }
    };

    return (
        <section className="cart py-80">
        <div className="container container-lg">
          <div className="row gy-4">
          <div className="address-section">
                    <h2 className="payment-title">Địa chỉ nhận hàng</h2>
                    <div className="address-details">
                        <div className="address-info">
                            <div className="address-name">
                                phan gia thuyên (+84) 869895748
                            </div>
                            <div className="address-full">
                                Thị Trấn Đức An Đăk Song Đăk Nông, Thái Dương, Tổ 2, Thị Trấn Đức An, Huyện Đắk Song, Đắk Nông
                            </div>
                            <div className="address-default">Mặc định</div>
                        </div>
                        <button className="change-btn">Thay đổi</button>
                    </div>
                </div>
            <div className="col-xl-9 col-lg-8">
              <div className="cart-table border border-gray-100 rounded-8 px-40 py-48">
                <div className="overflow-x-auto scroll-sm scroll-sm-horizontal">
                  <table className="table style-three" >
                    <thead style={{ padding: '100px' }}>
                      <tr>
                        <th className="h6 mb-0 text-lg fw-bold" style={{ padding: '20px', color: 'white' }}>Hành Động</th>
                        <th className="h6 mb-0 text-lg fw-bold" style={{ padding: '20px', color: 'white' }}>Tên Sản Phẩm</th>
                        <th className="h6 mb-0 text-lg fw-bold" style={{ padding: '20px', color: 'white' }}>Giá Sản Phẩm</th>
                        <th className="h6 mb-0 text-lg fw-bold" style={{ padding: '20px', color: 'white' }}>Số Lượng</th>
                        <th className="h6 mb-0 text-lg fw-bold" style={{ padding: '20px', color: 'white' }}>Tổng Tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                     
                    </tbody>
                  </table>
                </div>
                <div className="flex-between flex-wrap gap-16 mt-16">
                <div className="flex-align gap-16">
  <input
    type="text"
    className="common-input"
    placeholder="Áp Dụng Mã Giảm Giá"
    value={discountCode} // State để lưu trữ mã giảm giá
    onChange={(e) => setDiscountCode(e.target.value)} // Cập nhật giá trị mã giảm giá khi thay đổi input
  />
  <button
    type="button"
    className="btn btn-main py-18 w-100 rounded-8"
    onClick={handleApplyDiscount} // Gọi hàm khi nhấn nút "Áp Dụng"
  >
    Áp Dụng
  </button>
</div>


                </div>
              </div>
            </div>
            <div class="col-xl-3 col-lg-4">
              <div class=" border border-gray-100 rounded-8 px-24 py-40">
                <h6 class="text-xl mb-32">Tổng Giỏ Hàng</h6>
                <div class="bg-color-three rounded-8 p-24">
                  <div class="mb-32 d-flex justify-content-between gap-8">
                    <span class="text-gray-900 font-heading-two">Tổng Tiền</span>
                    <span className="text-gray-900 fw-semibold"></span>
                    </div>
                 
                  <div class="mb-0 d-flex justify-content-between gap-8">
                    <span class="text-gray-900 font-heading-two">Giá Sau Khi Áp Dụng</span>
                    <span class="text-gray-900 fw-semibold">
                 

                    </span>
                  </div>
                </div>
                <div class="bg-color-three rounded-8 p-24 mt-24">
                  <div class="d-flex justify-content-between gap-8">
                    <span class="text-gray-900 text-xl fw-semibold">Tổng Tiền</span>
                   
                  </div>
                </div>
                <button
      className="btn btn-main mt-40 py-18 w-100 rounded-8"
    >
      Đặt Hàng
    </button>              </div>
            </div>

          </div>
        </div>
      </section>
    );
};

export default Checkout;
