import React, { useEffect, useState } from "react";
import Preloader from "../helper/Preloader";
import ColorInit from "../helper/ColorInit";
import HeaderTwo from "../components/HeaderTwo";
import Breadcrumb from "../components/Breadcrumb";
import FooterTwo from "../components/FooterTwo";
import BottomFooter from "../components/BottomFooter";
import CartSection from "../components/CartSection";
import ShippingOne from "../components/ShippingOne";
import ScrollToTop from "react-scroll-to-top";
import { Link } from 'react-router-dom'
import { VoucherService } from '../../services/VoucherService.ts';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromProduct, updateProductQuantity ,updateTotalPrices} from '../../redux/acction/cartActions.ts'; // Đảm bảo đường dẫn đúng
import Swal from 'sweetalert2'; // Nhập SweetAlert2
import { Modal, Button } from 'react-bootstrap';  // Import các component từ Bootstrap
import { jwtDecode } from 'jwt-decode';
import { AddressController } from '../../services/AddressController.ts';
import {OrderService} from '../../services/OrderService.ts'
import QuantityControl from '../helper/QuantityControl'

const CartPage = () => {
  const tokenUser = localStorage.getItem('tokenUser');
  const decodedToken = jwtDecode(tokenUser); // Giải mã token
  console.log('giá trị id '+decodedToken.userId)
  const [addresses, setaddresses] = useState([]);  // Khởi tạo là mảng rỗng

  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.items); // Lấy danh sách sản phẩm trong giỏ hàng
  const [quantities, setQuantities] = useState({}); // State để lưu trữ số lượng cho từng sản phẩm
  const [loading, setLoading] = useState(false); // State để kiểm tra trạng thái tải lại dữ liệu
  const showData = async ()=>{
    const res = await AddressController.getAlladdressById(decodedToken.userId);
    setaddresses(res)
    console.log(res)
  }
  useEffect(()=>{
    showData();

  },[])
  const handleUpdateData = () => {
    setLoading(true); // Đặt trạng thái loading là true
    // Tại đây, bạn có thể thêm logic để cập nhật dữ liệu (gọi API hoặc xử lý dữ liệu)

    // Sau khi cập nhật xong dữ liệu, có thể tải lại trang
    // Ví dụ: window.location.reload() nếu bạn muốn tải lại toàn bộ trang
    setTimeout(() => { // Giả lập một khoảng thời gian tải
      window.location.reload();
    }, 1000); // Thay đổi 1000 thành khoảng thời gian cần thiết
  };
  const [discountCode, setDiscountCode] = useState(''); // Lưu mã giảm giá
const [discountValue, setDiscountValue] = useState(0); // Lưu giá trị giảm giá tính theo % hoặc số tiền
const [voucher, setVoucher] = useState([]); // Hoặc có thể là {}
const [idvoucher,setidvoucher] = useState('');

const handleApplyDiscount = async () => {
  // Hiển thị hộp thoại xác nhận từ SweetAlert2
  const result = await Swal.fire({
      title: 'Bạn có chắc chắn?',
      text: 'Bạn có muốn áp dụng voucher này không?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Áp dụng',
      cancelButtonText: 'Hủy'
  });
  if (result.isConfirmed) {
      try {
          // Lấy voucher từ mã giảm giá
          const voucher = await VoucherService.getVoucherByCode(discountCode);
          console.log(voucher.code.VoucherID)
          if (voucher && voucher.status === true) { // Kiểm tra voucher còn hiệu lực
              // Giả sử voucher có thuộc tính 'percent' chứa tỷ lệ giảm giá
              const discountValue = voucher.code.percent / 100; // Chuyển tỷ lệ giảm giá thành số thập phân

              // Cập nhật giá trị giảm giá vào state hoặc biến
              setDiscountValue(discountValue);
              setidvoucher(voucher.code.VoucherID)
              // Hiển thị thông báo thành công
              Swal.fire({
                  title: 'Voucher đã được áp dụng!',
                  text: `Giảm giá: ${voucher.code.percent}%`,
                  icon: 'success',
                  confirmButtonText: 'OK'
              });

              console.log(`Applied discount: ${discountValue * 100}%`);
          } else {
              // Nếu voucher không hợp lệ hoặc đã hết hạn
              Swal.fire({
                  title: 'Mã giảm giá không hợp lệ!',
                  text: 'Voucher này không còn hiệu lực hoặc không tồn tại.',
                  icon: 'error',
                  confirmButtonText: 'OK'
              });
          }
      } catch (error) {
          console.error('Error applying discount:', error);
          Swal.fire({
              title: 'Lỗi khi áp dụng voucher',
              text: 'Không thể áp dụng voucher. Vui lòng thử lại.',
              icon: 'error',
              confirmButtonText: 'OK'
          });
      }
  } else {
      // Nếu người dùng hủy bỏ
      Swal.fire({
          title: 'Đã hủy!',
          text: 'Bạn đã hủy việc áp dụng voucher.',
          icon: 'info',
          confirmButtonText: 'OK'
      });
  }
};


  
  const handleRemoveToCart = (id) => {
    console.log(id);
    dispatch(removeFromProduct(id)); // Gửi action để xóa sản phẩm khỏi giỏ hàng
  };

  useEffect(() => {
    // Khởi tạo quantities với số lượng sản phẩm từ cartItems
    const initialQuantities = {};
    cartItems.forEach(item => {
      initialQuantities[item.ProductID] = item.quantity; // Gán số lượng cho từng sản phẩm
    });
    setQuantities(initialQuantities);
    console.log(cartItems);
  }, [cartItems]); // Chỉ chạy khi cartItems thay đổi

  const incrementQuantity = (id) => {
    setQuantities(prevQuantities => {
      const newQuantity = (prevQuantities[id] || 0) + 1; // Tăng số lượng cho sản phẩm
      dispatch(updateProductQuantity(id, newQuantity)); // Gửi action cập nhật số lượng sản phẩm
      return {
        ...prevQuantities,
        [id]: newQuantity,
      };
    });
  };

  const decrementQuantity = (id) => {
    setQuantities(prevQuantities => {
      const newQuantity = Math.max((prevQuantities[id] || 1) - 1, 1); // Giảm số lượng nếu lớn hơn 1
      dispatch(updateProductQuantity(id, newQuantity)); // Gửi action cập nhật số lượng sản phẩm
      return {
        ...prevQuantities,
        [id]: newQuantity,
      };
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };
  const totalPrice = cartItems.reduce((total, item) => {
    const quantity = quantities[item.ProductID] || 0; // Lấy số lượng từ quantities
    return total + (item.Price * quantity); // Tính tổng tiền
  }, 0);
  const totalPriceAfterDiscount = totalPrice * (1 - discountValue); // Áp dụng giảm giá vào tổng tiền
  const [selectedAddressid, setSelectedAddressid] = useState('');  // Để lưu địa chỉ đã chọn
  const [dataorder,setdataorder] = useState([]);
  const pushData = ()=>{
    console.log(dataorder);

  }
  const [selectedAddress, setSelectedAddress] = useState('');  // Để lưu địa chỉ đã chọn

  const handlePlaceOrder = async () => {
    const orderDetails = {
      cartItems: cartItems.map(item => ({
        ProductID : item.ProductID,

        ProductName: item.ProductName,
        Price: item.Price,
        Quantity: quantities[item.ProductID],
      })),
      TotalAmount: totalPrice,
      VoucherID:idvoucher,
      discountValue: discountValue * 100, // Giảm giá theo phần trăm
      TotalDiscount: totalPriceAfterDiscount,
      selectedAddressid: selectedAddressid,
      UserID:decodedToken.userId,
      address:selectedAddress,
    };
  
    try {
      console.log(orderDetails);
      // Call your API to place the order (Assuming OrderService.createOrder is implemented)
      const response = await OrderService.createOrder(orderDetails);
      if (response.status===true) {
        Swal.fire({
          title: 'Đặt hàng thành công!',
          text: `Mã đơn hàng: ${response.orderId}`,
          icon: 'success',
          confirmButtonText: 'OK',
        });
      } else {
        throw new Error('Đặt hàng thất bại!');
      }
    } catch (error) {
      Swal.fire({
        title: 'Lỗi khi đặt hàng',
        text: error.message || 'Không thể đặt hàng. Vui lòng thử lại.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };
  
  
  const [isModalOpen, setIsModalOpen] = useState(false);  // Để điều khiển việc hiển thị modal

  const handleChangeAddress = (address) => {
    console.log(address.id_address)
    setSelectedAddress(address.address);  // Cập nhật địa chỉ đã chọn
    setSelectedAddressid(address.id_address);
  
    
    setIsModalOpen(false);  // Đóng modal sau khi chọn
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);  // Mở modal khi nhấn "Thay đổi"
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);  // Đóng modal khi nhấn "Đóng"
  };

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
      <Breadcrumb title={"Giỏ Hàng"} />

      {/* CartSection */}
      <section className="cart py-80">
        <div className="container container-lg">
          <div className="row gy-4">
            <div className="col-xl-9 col-lg-8">
            <div>
      {/* Address Section */}
      <div className="address-section">
        <h2 className="payment-title">Địa chỉ nhận hàng</h2>
        <div className="address-details">
          <div className="address-info">
            <div className="address-name">
              phan gia thuyên (+84) 869895748
            </div>
            <div className="address-full">
              {selectedAddress || ""}
            </div>
            <div className="address-default">Mặc định</div>
          </div>
          <Button className="change-btn" onClick={() => setIsModalOpen(true)}>Thay đổi</Button>
        </div>
      </div>

      {/* Bootstrap Modal */}
      <Modal show={isModalOpen} onHide={() => setIsModalOpen(false)}>
  <Modal.Header className="custom-modal-header" closeButton>
    <p className="payment-titles">Địa chỉ nhận hàng</p>
  </Modal.Header>
  <Modal.Body>
  <ul className="list-group">
  {Array.isArray(addresses) && addresses.map((address, index) => (
    <li key={index} className="list-group-item">
      <a 
        href="#" 
        className="w-100 text-left custom-text-black" 
        onClick={() => handleChangeAddress(address)}
      >
        {address.name || "No Name"} - {address.address || "No Address"}
      </a>
    </li>
  ))}
</ul>


  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
      Đóng
    </Button>
  </Modal.Footer>
</Modal>

    </div>

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
                      {cartItems.map(item => (
                        <tr key={item.ProductID}>
                          <td style={{ padding: '20px' }}>
                            <button
                              type="button"
                              className="remove-tr-btn flex-align gap-12 hover-text-danger-600"
                              // Thêm hàm xóa sản phẩm nếu cần
                              onClick={() => { handleRemoveToCart(item.ProductID) }}
                            >
                              <i className="ph ph-x-circle text-2xl d-flex" />
                              Xóa Sản Phẩm
                            </button>
                          </td>
                          <td style={{ padding: '20px' }}>
                            <div className="table-product d-flex align-items-center gap-24">
                              <Link
                                to={`/product-details/${item.ProductID}`} // Giả sử bạn có route cho từng sản phẩm
                                className="table-product__thumb border border-gray-100 rounded-8 flex-center"
                              >
                                <img
                                  src={`http://localhost:3000/uploads/${item.OtherImages[0] || 'default-image.png'}`}
                                  alt={item.ProductName}
                                />
                              </Link>
                              <div className="table-product__content text-start">
                                <h6 className="title text-lg fw-semibold mb-8">
                                  <Link
                                    to={`/product-details/${item.ProductID}`} // Giả sử bạn có route cho từng sản phẩm
                                    className="link text-line-2"
                                    tabIndex={0}
                                  >
                                    {item.ProductName}
                                  </Link>
                                </h6>
                                {/* <div className="flex-align gap-16 mb-16">
                                  <div className="flex-align gap-6">
                                    <span className="text-md fw-medium text-warning-600 d-flex">
                                      <i className="ph-fill ph-star" />
                                    </span>
                                    <span className="text-md fw-semibold text-gray-900">
                                      4.8
                                    </span>
                                  </div>
                                  <span className="text-sm fw-medium text-gray-200">|</span>
                                  <span className="text-neutral-600 text-sm">128 Reviews</span>
                                </div> */}
                                <div className="flex-align gap-16">
                                  {/* <Link
                                    to="/cart"
                                    className="product-card__cart btn bg-gray-50 text-heading text-sm hover-bg-main-600 hover-text-white py-7 px-8 rounded-8 flex-center gap-8 fw-medium"
                                  >
                                    Camera
                                  </Link>
                                  <Link
                                    to="/cart"
                                    className="product-card__cart btn bg-gray-50 text-heading text-sm hover-bg-main-600 hover-text-white py-7 px-8 rounded-8 flex-center gap-8 fw-medium"
                                  >
                                    Videos
                                  </Link> */}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: '20px' }}>
                            <span className="text-lg h6 mb-0 fw-semibold">{formatCurrency(item.Price)}</span>
                          </td>
                          <td>
                            <div className="d-flex rounded-4 overflow-hidden">
                              <button
                                type="button"
                                onClick={() => decrementQuantity(item.ProductID)}
                                className="quantity__minus border border-end border-gray-100 flex-shrink-0 h-48 w-48 text-neutral-600 flex-center hover-bg-main-600 hover-text-white"
                              >
                                <i className="ph ph-minus" />
                              </button>
                              <input
                                type="number"
                                className="quantity__input flex-grow-1 border border-gray-100 border-start-0 border-end-0 text-center w-32 px-4"
                                value={quantities[item.ProductID]}
                                min={1}
                                readOnly

                              />
                              <button
                                type="button"
                                onClick={() => incrementQuantity(item.ProductID)}
                                className="quantity__plus border border-end border-gray-100 flex-shrink-0 h-48 w-48 text-neutral-600 flex-center hover-bg-main-600 hover-text-white"
                              >
                                <i className="ph ph-plus" />
                              </button>
                            </div>
                          </td>
                          <td style={{ padding: '20px' }}>
                            <span className="text-lg h6 mb-0 fw-semibold">
                              {formatCurrency((item.Price * item.quantity))}
                            </span>
                          </td>
                        </tr>
                      ))}

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
                    <span className="text-gray-900 fw-semibold">{formatCurrency(totalPrice)}</span>
                    </div>
                 
                  <div class="mb-0 d-flex justify-content-between gap-8">
                    <span class="text-gray-900 font-heading-two">Giá Sau Khi Áp Dụng</span>
                    <span class="text-gray-900 fw-semibold">
                    {formatCurrency(totalPriceAfterDiscount)} 

                    </span>
                  </div>
                </div>
                <div class="bg-color-three rounded-8 p-24 mt-24">
                  <div class="d-flex justify-content-between gap-8">
                    <span class="text-gray-900 text-xl fw-semibold">Tổng Tiền</span>
                    {
  totalPrice > totalPriceAfterDiscount ? (
    <span className="text-gray-900 text-xl fw-semibold">
      {formatCurrency(totalPrice)} → {formatCurrency(totalPriceAfterDiscount)}
    </span>
  ) : null
}
                  </div>
                </div>
                <button
      className="btn btn-main mt-40 py-18 w-100 rounded-8"
      onClick={handlePlaceOrder}
    >
      Đặt Hàng
    </button>              </div>
            </div>

          </div>
        </div>
      </section>
      {/* ShippingOne */}
      <ShippingOne />

      {/* FooterTwo */}
      <FooterTwo />

      {/* BottomFooter */}
      <BottomFooter />


    </>
  );
};

export default CartPage;
