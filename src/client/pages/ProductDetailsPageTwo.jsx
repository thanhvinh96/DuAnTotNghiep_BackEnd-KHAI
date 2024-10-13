import React,{useEffect,useState} from "react";
import Preloader from "../helper/Preloader";
import ColorInit from "../helper/ColorInit";
import HeaderTwo from "../components/HeaderTwo";
import Breadcrumb from "../components/Breadcrumb";
import NewArrivalTwo from "../components/NewArrivalTwo";
import ShippingOne from "../components/ShippingOne";
import FooterTwo from "../components/FooterTwo";
import BottomFooter from "../components/BottomFooter";
import ScrollToTop from "react-scroll-to-top";
import { ProductController } from '../../controller/productController.tsx';
import Slider from 'react-slick';
import { getCountdown } from '../helper/Countdown';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addToProduct } from '../../redux/acction/cartActions.ts'; // Đảm bảo đường dẫn đúng
import Swal from 'sweetalert2'; // Nhập SweetAlert2

const ProductDetailsPageTwo = () => {
  
  const location = useLocation();
  const queryString = location.search; 
  const urlParams = new URLSearchParams(queryString);
  const id = urlParams.get('id'); 
  const [product, setProduct] = useState({
    ProductID: '',
    ProductName: '',
    Description: '',
    StockQuantity: '',
    CategoryName: '',
    ShortDescription: '',
    OtherImages: [],
    quantity: 1, // Đặt giá trị mặc định cho quantity
});

  const [mainImage, setMainImage] = useState(product?.OtherImages ? product.OtherImages[0] : null);
  const cartItems = useSelector(state => state.cart.items); // Lấy danh sách sản phẩm trong giỏ hàng
  const dispatch = useDispatch();


  const showdataProduct = async (id) => {
    const data = await ProductController.getProductByID(id);
    console.log(data);
    setProduct(data);

    // Cập nhật mainImage sau khi product đã được gán dữ liệu
    if (data && data.OtherImages && data.OtherImages.length > 0) {
        setMainImage(data.OtherImages[0]); // Gán hình ảnh đầu tiên
    } else {
        setMainImage(null); // Nếu không có hình ảnh nào
    }
};

    useEffect(()=>{
      showdataProduct(id);
    console.log(id);
  },[])
  const [timeLeft, setTimeLeft] = useState(getCountdown());

  const getDataProductById = async ()=>{
      console.log('show data');
    console.log(cartItems)
      product.OtherImages.map((image, index) => (
        console.log(image)
      ))
    }
  useEffect(() => {

      const interval = setInterval(() => {
          setTimeLeft(getCountdown());
      }, 1000);
      getDataProductById();
    
      return () => clearInterval(interval);
  }, []);
 


  // increment & decrement
  const [quantity, setQuantity] = useState(1);
  const incrementQuantity = () => {
    setQuantity(prevQuantity => {
        const newQuantity = prevQuantity + 1;

        // Kiểm tra nếu newQuantity không vượt quá product.StockQuantity
        if (newQuantity <= product.StockQuantity) {
            // Cập nhật quantity trong product
            setProduct(prevProduct => ({
                ...prevProduct,
                quantity: newQuantity
            }));
            return newQuantity;
        }
        
        return prevQuantity; // Trả lại giá trị cũ nếu không hợp lệ
    });
};

const decrementQuantity = () => {
    setQuantity(prevQuantity => {
        if (prevQuantity > 1) {
            const newQuantity = prevQuantity - 1;

            // Cập nhật quantity trong product
            setProduct(prevProduct => ({
                ...prevProduct,
                quantity: newQuantity
            }));
            return newQuantity;
        }
        return prevQuantity; // Trả lại giá trị cũ nếu không hợp lệ
    });
};



  const settingsThumbs = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,  // Hiển thị 1 hình ảnh tại một thời điểm
    slidesToScroll: 1,
    focusOnSelect: true,
    centerMode: true, // Có thể thử bật chế độ trung tâm
    centerPadding: '20px', // Khoảng cách giữa các hình ảnh
};
const handleAddToCart = () => {
    // Lấy token từ localStorage
    const tokenUser = localStorage.getItem('tokenUser');
  
    if (!tokenUser) {
      // Nếu không có tokenUser, hiển thị thông báo yêu cầu đăng nhập
      Swal.fire({
        icon: 'error',
        title: 'Bạn chưa đăng nhập!',
        text: 'Vui lòng đăng nhập để tiếp tục.',
        confirmButtonText: 'Đăng nhập'
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = '/login'; // Điều hướng tới trang đăng nhập
        }
      });
    } else {
      // Nếu đã đăng nhập, thực hiện thêm sản phẩm vào giỏ hàng
      try {
        console.log(product);
        dispatch(addToProduct(product)); // Gửi action thêm sản phẩm vào giỏ hàng
  
        // Hiển thị thông báo thành công
        Swal.fire({
          icon: 'success',
          title: 'Thêm vào giỏ hàng thành công!',
          text: `${product.name} đã được thêm vào giỏ hàng.`,
          confirmButtonText: 'OK'
        });
      } catch (error) {
        // Hiển thị thông báo lỗi nếu xảy ra lỗi
        Swal.fire({
          icon: 'error',
          title: 'Có lỗi xảy ra!',
          text: 'Không thể thêm sản phẩm vào giỏ hàng, vui lòng thử lại.',
          confirmButtonText: 'Thử lại'
        });
      }
    }
  };
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
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
      <Breadcrumb title={`${product.ProductName}`} />

      {/* ProductDetailsTwo */}
      <section className="product-details py-80">
            <div className="container container-lg">
                <div className="row gy-4">
                    <div className="col-xl-9">
                        <div className="row gy-4">
                            <div className="col-xl-6">
                                <div className="product-details__left">
                                    <div className="product-details__thumb-slider border border-gray-100 rounded-16">
                                        <div className="">
                                            <div className="product-details__thumb flex-center h-100">
                                            <img 
    src={mainImage ? `http://localhost:3000/uploads/${mainImage}` : 'http://localhost:3000/uploads/default-image.png'} 
    alt="Main Product" 
/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-24">
                                        <div className="product-details__images-slider">
                                        <Slider {...settingsThumbs}>
    {product?.OtherImages && product.OtherImages.length > 0 ? (
        product.OtherImages.map((image, index) => (
            <div key={index} style={{ width: '100%', textAlign: 'center' }}> {/* Căn giữa các hình ảnh */}
                <img
                    src={`http://localhost:3000/uploads/${image}`}
                    alt={`Other product view ${index + 1}`}
                    onClick={() => setMainImage(image)}
                    style={{ maxWidth: '100%', height: 'auto' }} // Giới hạn chiều rộng
                />
            </div>
        ))
    ) : (
        <p>No additional images available.</p>
    )}
</Slider>


                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-6">
                                <div className="product-details__content">
                                    {/* <div className="flex-center mb-24 flex-wrap gap-16 bg-color-one rounded-8 py-16 px-24 position-relative z-1">
                                        <img
                                            src="assets/images/bg/details-offer-bg.png"
                                            alt=""
                                            className="position-absolute inset-block-start-0 inset-inline-start-0 w-100 h-100 z-n1"
                                        />
                                        <div className="flex-align gap-16">
                                            <span className="text-white text-sm">Special Offer:</span>
                                        </div>
                                        <div className="countdown" id="countdown11">
                                            <ul className="countdown-list flex-align flex-wrap">
                                                <li className="countdown-list__item text-heading flex-align gap-4 text-xs fw-medium w-28 h-28 rounded-4 border border-main-600 p-0 flex-center">
                                                    {timeLeft.days}<span className="days" />
                                                </li>
                                                <li className="countdown-list__item text-heading flex-align gap-4 text-xs fw-medium w-28 h-28 rounded-4 border border-main-600 p-0 flex-center">
                                                    {timeLeft.hours}<span className="hours" />
                                                </li>
                                                <li className="countdown-list__item text-heading flex-align gap-4 text-xs fw-medium w-28 h-28 rounded-4 border border-main-600 p-0 flex-center">
                                                    {timeLeft.minutes}<span className="minutes" />
                                                </li>
                                                <li className="countdown-list__item text-heading flex-align gap-4 text-xs fw-medium w-28 h-28 rounded-4 border border-main-600 p-0 flex-center">
                                                    {timeLeft.seconds}<span className="seconds" />
                                                </li>
                                            </ul>
                                        </div>
                                        <span className="text-white text-xs">
                                            Remains untill the end of the offer
                                        </span>
                                    </div> */}
                                    <h5 className="mb-12">
                                        
                                    <h5 className="mb-12" dangerouslySetInnerHTML={{ __html: product.ProductName }} />
                                    </h5>
                                    <div className="flex-align flex-wrap gap-12">
                                        <div className="flex-align gap-12 flex-wrap">
                                            <div className="flex-align gap-8">
                                                <span className="text-15 fw-medium text-warning-600 d-flex">
                                                    <i className="ph-fill ph-star" />
                                                </span>
                                                <span className="text-15 fw-medium text-warning-600 d-flex">
                                                    <i className="ph-fill ph-star" />
                                                </span>
                                                <span className="text-15 fw-medium text-warning-600 d-flex">
                                                    <i className="ph-fill ph-star" />
                                                </span>
                                                <span className="text-15 fw-medium text-warning-600 d-flex">
                                                    <i className="ph-fill ph-star" />
                                                </span>
                                                <span className="text-15 fw-medium text-warning-600 d-flex">
                                                    <i className="ph-fill ph-star" />
                                                </span>
                                            </div>
                                            
                                        </div>
                                        <span className="text-sm fw-medium text-gray-500">|</span>
                                        <span className="text-gray-900">
                                            {" "}
                                            <span className="text-gray-400">SKU:</span>EB4DRP{" "}
                                        </span>
                                    </div>
                                    <span className="mt-32 pt-32 text-gray-700 border-top border-gray-100 d-block" />
                                    <p className="text-gray-700" dangerouslySetInnerHTML={{ __html: product.ShortDescription }} />

                                    {/* <p className="text-gray-700" dangerouslySetInnerHTML={{ __html: product.ShortDescription }}>
                                    </p> */}
                                    <div className="my-32 flex-align gap-16 flex-wrap">
                                        <div className="flex-align gap-8">
                                            <div className="flex-align gap-8 text-main-two-600">
                                                <i className="ph-fill ph-seal-percent text-xl" />
                                                Giá Sản Phẩm :
                                            </div>
                                            
                                            <h6 className=" mb-0">{formatCurrency(product.Price)}</h6>

                                        </div>
                                        {/* <div className="flex-align gap-8">
                                            <span className="text-gray-700">Regular Price</span>
                                            <h6 className="text-xl text-gray-400 mb-0 fw-medium">
                                                USD 452.99
                                            </h6>
                                        </div> */}
                                    </div>
                                    <div className="my-32 flex-align flex-wrap gap-12">
                                        <Link
                                            to="#"
                                            className="px-12 py-8 text-sm rounded-8 flex-align gap-8 text-gray-900 border border-gray-200 hover-border-main-600 hover-text-main-600"
                                        >
                                            Monthyly EMI USD 15.00
                                            <i className="ph ph-caret-right" />
                                        </Link>
                                        <Link
                                            to="#"
                                            className="px-12 py-8 text-sm rounded-8 flex-align gap-8 text-gray-900 border border-gray-200 hover-border-main-600 hover-text-main-600"
                                        >
                                            Shipping Charge
                                            <i className="ph ph-caret-right" />
                                        </Link>
                                        <Link
                                            to="#"
                                            className="px-12 py-8 text-sm rounded-8 flex-align gap-8 text-gray-900 border border-gray-200 hover-border-main-600 hover-text-main-600"
                                        >
                                            Security &amp; Privacy
                                            <i className="ph ph-caret-right" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-3">
                        <div className="product-details__sidebar py-40 px-32 border border-gray-100 rounded-16">
                           
                            <div className="mb-32">
                                <label
                                    htmlFor="stock"
                                    className="text-lg mb-8 text-heading fw-semibold d-block"
                                >
                                    Số Lượng :  {product.StockQuantity}

                                </label>
                                <span className="text-xl d-flex">
                                    <i className="ph ph-location" />
                                </span>
                                <div className="d-flex rounded-4 overflow-hidden">
                                    <button onClick={decrementQuantity}
                                        type="button"
                                        className="quantity__minus flex-shrink-0 h-48 w-48 text-neutral-600 bg-gray-50 flex-center hover-bg-main-600 hover-text-white"
                                    >
                                        <i className="ph ph-minus" />
                                    </button>
                                    <input
                                        type="number"
                                        className="quantity__input flex-grow-1 border border-gray-100 border-start-0 border-end-0 text-center w-32 px-16"
                                        id="stock"
                                        value={
                                            quantity
                                        } readOnly

                                    />
                                    <button onClick={incrementQuantity}
                                        type="button"
                                        className="quantity__plus flex-shrink-0 h-48 w-48 text-neutral-600 bg-gray-50 flex-center hover-bg-main-600 hover-text-white"
                                    >
                                        <i className="ph ph-plus" />
                                    </button>
                                </div>
                            </div>
                            <div className="mb-32">
                                <div className="flex-between flex-wrap gap-8 border-bottom border-gray-100 pb-16 mb-16">
                                    <span className="text-gray-500">Giá Sản Phẩm</span>
                                    <h6 className="text-lg mb-0">
  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.Price)}
</h6>
                                </div>
                                <div className="flex-between flex-wrap gap-8">
                                    <span className="text-gray-500">Tổng Tiền</span>
                                    <h6 className="text-lg mb-0">{formatCurrency(product.Price * quantity)}</h6>
                                    </div>
                            </div>
                            <button
  className="btn btn-main flex-center gap-8 rounded-8 py-16 fw-normal mt-8 w-100"
  onClick={handleAddToCart}
>
  <i className="ph ph-shopping-cart-simple text-lg" />
  Thêm Vào Giỏ Hàng
</button>

<Link
  to="#"
  className="btn btn-outline-main rounded-8 py-16 fw-normal mt-16 w-100"
>
  Thanh Toán
</Link>

                           
                            <div className="mt-32">
                                <div className="px-32 py-16 rounded-8 border border-gray-100 flex-between gap-8">
                                    <Link to="#" className="d-flex text-main-600 text-28">
                                        <i className="ph-fill ph-chats-teardrop" />
                                    </Link>
                                    <span className="h-26 border border-gray-100" />
                                    <div className="dropdown on-hover-item">
                                        <button className="d-flex text-main-600 text-28" type="button">
                                            <i className="ph-fill ph-share-network" />
                                        </button>
                                        <div className="on-hover-dropdown common-dropdown border-0 inset-inline-start-auto inset-inline-end-0">
                                            <ul className="flex-align gap-16">
                                                <li>
                                                    <Link
                                                        to="/https://www.facebook.com"
                                                        className="w-44 h-44 flex-center bg-main-100 text-main-600 text-xl rounded-circle hover-bg-main-600 hover-text-white"
                                                    >
                                                        <i className="ph-fill ph-facebook-logo" />
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link
                                                        to="/https://www.twitter.com"
                                                        className="w-44 h-44 flex-center bg-main-100 text-main-600 text-xl rounded-circle hover-bg-main-600 hover-text-white"
                                                    >
                                                        <i className="ph-fill ph-twitter-logo" />
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link
                                                        to="/https://www.linkedin.com"
                                                        className="w-44 h-44 flex-center bg-main-100 text-main-600 text-xl rounded-circle hover-bg-main-600 hover-text-white"
                                                    >
                                                        <i className="ph-fill ph-instagram-logo" />
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link
                                                        to="/https://www.pinterest.com"
                                                        className="w-44 h-44 flex-center bg-main-100 text-main-600 text-xl rounded-circle hover-bg-main-600 hover-text-white"
                                                    >
                                                        <i className="ph-fill ph-linkedin-logo" />
                                                    </Link>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="pt-80">
                    <div className="product-dContent border rounded-24">
                        <div className="product-dContent__header border-bottom border-gray-100 flex-between flex-wrap gap-16">
                            <ul
                                className="nav common-tab nav-pills mb-3"
                                id="pills-tab"
                                role="tablist"
                            >
                                <li className="nav-item" role="presentation">
                                    <button
                                        className="nav-link active"
                                        id="pills-description-tab"
                                        data-bs-toggle="pill"
                                        data-bs-target="#pills-description"
                                        type="button"
                                        role="tab"
                                        aria-controls="pills-description"
                                        aria-selected="true"
                                    >
                                        Mô Tả Sản Phẩm
                                    </button>
                                </li>
                               
                            </ul>
                            <Link
                                to="#"
                                className="btn bg-color-one rounded-16 flex-align gap-8 text-main-600 hover-bg-main-600 hover-text-white"
                            >
                              
                            </Link>
                        </div>
                        <div className="product-dContent__box">
                            <div className="tab-content" id="pills-tabContent">
                                <div
                                    className="tab-pane fade show active"
                                    id="pills-description"
                                    role="tabpanel"
                                    aria-labelledby="pills-description-tab"
                                    tabIndex={0}
                                >
                                    <div className="mb-40">
                                        {/* <h6 className="mb-24">Product Description</h6> */}
                                      {/* {product.ShortDescription} */}
                                      <p dangerouslySetInnerHTML={{ __html: product.Description }} />

                                    </div>
                                </div>
                                <div
                                    className="tab-pane fade"
                                    id="pills-reviews"
                                    role="tabpanel"
                                    aria-labelledby="pills-reviews-tab"
                                    tabIndex={0}
                                >
                                    <div className="row g-4">
                                        <div className="col-lg-6">
                                            <h6 className="mb-24">Product Description</h6>
                                            <div className="d-flex align-items-start gap-24 pb-44 border-bottom border-gray-100 mb-44">
                                                <img
                                                    src="assets/images/thumbs/comment-img1.png"
                                                    alt=""
                                                    className="w-52 h-52 object-fit-cover rounded-circle flex-shrink-0"
                                                />
                                                <div className="flex-grow-1">
                                                    <div className="flex-between align-items-start gap-8 ">
                                                        <div className="">
                                                            <h6 className="mb-12 text-md">Nicolas cage</h6>
                                                            <div className="flex-align gap-8">
                                                                <span className="text-15 fw-medium text-warning-600 d-flex">
                                                                    <i className="ph-fill ph-star" />
                                                                </span>
                                                                <span className="text-15 fw-medium text-warning-600 d-flex">
                                                                    <i className="ph-fill ph-star" />
                                                                </span>
                                                                <span className="text-15 fw-medium text-warning-600 d-flex">
                                                                    <i className="ph-fill ph-star" />
                                                                </span>
                                                                <span className="text-15 fw-medium text-warning-600 d-flex">
                                                                    <i className="ph-fill ph-star" />
                                                                </span>
                                                                <span className="text-15 fw-medium text-warning-600 d-flex">
                                                                    <i className="ph-fill ph-star" />
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <span className="text-gray-800 text-xs">
                                                            3 Days ago
                                                        </span>
                                                    </div>
                                                    <h6 className="mb-14 text-md mt-24">Greate Product</h6>
                                                    <p className="text-gray-700">
                                                        There are many variations of passages of Lorem Ipsum
                                                        available, but the majority have suffered alteration in
                                                        some form, by injected humour
                                                    </p>
                                                    <div className="flex-align gap-20 mt-44">
                                                        <button className="flex-align gap-12 text-gray-700 hover-text-main-600">
                                                            <i className="ph-bold ph-thumbs-up" />
                                                            Like
                                                        </button>
                                                        <Link
                                                            to="#comment-form"
                                                            className="flex-align gap-12 text-gray-700 hover-text-main-600"
                                                        >
                                                            <i className="ph-bold ph-arrow-bend-up-left" />
                                                            Replay
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="d-flex align-items-start gap-24">
                                                <img
                                                    src="assets/images/thumbs/comment-img1.png"
                                                    alt=""
                                                    className="w-52 h-52 object-fit-cover rounded-circle flex-shrink-0"
                                                />
                                                <div className="flex-grow-1">
                                                    <div className="flex-between align-items-start gap-8 ">
                                                        <div className="">
                                                            <h6 className="mb-12 text-md">Nicolas cage</h6>
                                                            <div className="flex-align gap-8">
                                                                <span className="text-15 fw-medium text-warning-600 d-flex">
                                                                    <i className="ph-fill ph-star" />
                                                                </span>
                                                                <span className="text-15 fw-medium text-warning-600 d-flex">
                                                                    <i className="ph-fill ph-star" />
                                                                </span>
                                                                <span className="text-15 fw-medium text-warning-600 d-flex">
                                                                    <i className="ph-fill ph-star" />
                                                                </span>
                                                                <span className="text-15 fw-medium text-warning-600 d-flex">
                                                                    <i className="ph-fill ph-star" />
                                                                </span>
                                                                <span className="text-15 fw-medium text-warning-600 d-flex">
                                                                    <i className="ph-fill ph-star" />
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <span className="text-gray-800 text-xs">
                                                            3 Days ago
                                                        </span>
                                                    </div>
                                                    <h6 className="mb-14 text-md mt-24">Greate Product</h6>
                                                    <p className="text-gray-700">
                                                        There are many variations of passages of Lorem Ipsum
                                                        available, but the majority have suffered alteration in
                                                        some form, by injected humour
                                                    </p>
                                                    <div className="flex-align gap-20 mt-44">
                                                        <button className="flex-align gap-12 text-gray-700 hover-text-main-600">
                                                            <i className="ph-bold ph-thumbs-up" />
                                                            Like
                                                        </button>
                                                        <Link
                                                            to="#comment-form"
                                                            className="flex-align gap-12 text-gray-700 hover-text-main-600"
                                                        >
                                                            <i className="ph-bold ph-arrow-bend-up-left" />
                                                            Replay
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-56">
                                                <div className="">
                                                    <h6 className="mb-24">Write a Review</h6>
                                                    <span className="text-heading mb-8">
                                                        What is it like to Product?
                                                    </span>
                                                    <div className="flex-align gap-8">
                                                        <span className="text-15 fw-medium text-warning-600 d-flex">
                                                            <i className="ph-fill ph-star" />
                                                        </span>
                                                        <span className="text-15 fw-medium text-warning-600 d-flex">
                                                            <i className="ph-fill ph-star" />
                                                        </span>
                                                        <span className="text-15 fw-medium text-warning-600 d-flex">
                                                            <i className="ph-fill ph-star" />
                                                        </span>
                                                        <span className="text-15 fw-medium text-warning-600 d-flex">
                                                            <i className="ph-fill ph-star" />
                                                        </span>
                                                        <span className="text-15 fw-medium text-warning-600 d-flex">
                                                            <i className="ph-fill ph-star" />
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="mt-32">
                                                    <form action="#">
                                                        <div className="mb-32">
                                                            <label
                                                                htmlFor="title"
                                                                className="text-neutral-600 mb-8"
                                                            >
                                                                Review Title
                                                            </label>
                                                            <input
                                                                type="text"
                                                                className="common-input rounded-8"
                                                                id="title"
                                                                placeholder="Great Products"
                                                            />
                                                        </div>
                                                        <div className="mb-32">
                                                            <label
                                                                htmlFor="desc"
                                                                className="text-neutral-600 mb-8"
                                                            >
                                                                Review Content
                                                            </label>
                                                            <textarea
                                                                className="common-input rounded-8"
                                                                id="desc"
                                                                defaultValue={
                                                                    "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English."
                                                                }
                                                            />
                                                        </div>
                                                        <button
                                                            type="submit"
                                                            className="btn btn-main rounded-pill mt-48"
                                                        >
                                                            Submit Review
                                                        </button>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="ms-xxl-5">
                                                <h6 className="mb-24">Customers Feedback</h6>
                                                <div className="d-flex flex-wrap gap-44">
                                                    <div className="border border-gray-100 rounded-8 px-40 py-52 flex-center flex-column flex-shrink-0 text-center">
                                                        <h2 className="mb-6 text-main-600">4.8</h2>
                                                        <div className="flex-center gap-8">
                                                            <span className="text-15 fw-medium text-warning-600 d-flex">
                                                                <i className="ph-fill ph-star" />
                                                            </span>
                                                            <span className="text-15 fw-medium text-warning-600 d-flex">
                                                                <i className="ph-fill ph-star" />
                                                            </span>
                                                            <span className="text-15 fw-medium text-warning-600 d-flex">
                                                                <i className="ph-fill ph-star" />
                                                            </span>
                                                            <span className="text-15 fw-medium text-warning-600 d-flex">
                                                                <i className="ph-fill ph-star" />
                                                            </span>
                                                            <span className="text-15 fw-medium text-warning-600 d-flex">
                                                                <i className="ph-fill ph-star" />
                                                            </span>
                                                        </div>
                                                        <span className="mt-16 text-gray-500">
                                                            Average Product Rating
                                                        </span>
                                                    </div>
                                                    <div className="border border-gray-100 rounded-8 px-24 py-40 flex-grow-1">
                                                        <div className="flex-align gap-8 mb-20">
                                                            <span className="text-gray-900 flex-shrink-0">5</span>
                                                            <div
                                                                className="progress w-100 bg-gray-100 rounded-pill h-8"
                                                                role="progressbar"
                                                                aria-label="Basic example"
                                                                aria-valuenow={70}
                                                                aria-valuemin={0}
                                                                aria-valuemax={100}
                                                            >
                                                                <div
                                                                    className="progress-bar bg-main-600 rounded-pill"
                                                                    style={{ width: "70%" }}
                                                                />
                                                            </div>
                                                            <div className="flex-align gap-4">
                                                                <span className="text-xs fw-medium text-warning-600 d-flex">
                                                                    <i className="ph-fill ph-star" />
                                                                </span>
                                                                <span className="text-xs fw-medium text-warning-600 d-flex">
                                                                    <i className="ph-fill ph-star" />
                                                                </span>
                                                                <span className="text-xs fw-medium text-warning-600 d-flex">
                                                                    <i className="ph-fill ph-star" />
                                                                </span>
                                                                <span className="text-xs fw-medium text-warning-600 d-flex">
                                                                    <i className="ph-fill ph-star" />
                                                                </span>
                                                                <span className="text-xs fw-medium text-warning-600 d-flex">
                                                                    <i className="ph-fill ph-star" />
                                                                </span>
                                                            </div>
                                                            <span className="text-gray-900 flex-shrink-0">
                                                                124
                                                            </span>
                                                        </div>
                                                        <div className="flex-align gap-8 mb-20">
                                                            <span className="text-gray-900 flex-shrink-0">4</span>
                                                            <div
                                                                className="progress w-100 bg-gray-100 rounded-pill h-8"
                                                                role="progressbar"
                                                                aria-label="Basic example"
                                                                aria-valuenow={50}
                                                                aria-valuemin={0}
                                                                aria-valuemax={100}
                                                            >
                                                                <div
                                                                    className="progress-bar bg-main-600 rounded-pill"
                                                                    style={{ width: "50%" }}
                                                                />
                                                            </div>
                                                            <div className="flex-align gap-4">
                                                                <span className="text-xs fw-medium text-warning-600 d-flex">
                                                                    <i className="ph-fill ph-star" />
                                                                </span>
                                                                <span className="text-xs fw-medium text-warning-600 d-flex">
                                                                    <i className="ph-fill ph-star" />
                                                                </span>
                                                                <span className="text-xs fw-medium text-warning-600 d-flex">
                                                                    <i className="ph-fill ph-star" />
                                                                </span>
                                                                <span className="text-xs fw-medium text-warning-600 d-flex">
                                                                    <i className="ph-fill ph-star" />
                                                                </span>
                                                                <span className="text-xs fw-medium text-gray-400 d-flex">
                                                                    <i className="ph-fill ph-star" />
                                                                </span>
                                                            </div>
                                                            <span className="text-gray-900 flex-shrink-0">
                                                                52
                                                            </span>
                                                        </div>
                                                        <div className="flex-align gap-8 mb-20">
                                                            <span className="text-gray-900 flex-shrink-0">3</span>
                                                            <div
                                                                className="progress w-100 bg-gray-100 rounded-pill h-8"
                                                                role="progressbar"
                                                                aria-label="Basic example"
                                                                aria-valuenow={35}
                                                                aria-valuemin={0}
                                                                aria-valuemax={100}
                                                            >
                                                                <div
                                                                    className="progress-bar bg-main-600 rounded-pill"
                                                                    style={{ width: "35%" }}
                                                                />
                                                            </div>
                                                            <div className="flex-align gap-4">
                                                                <span className="text-xs fw-medium text-warning-600 d-flex">
                                                                    <i className="ph-fill ph-star" />
                                                                </span>
                                                                <span className="text-xs fw-medium text-warning-600 d-flex">
                                                                    <i className="ph-fill ph-star" />
                                                                </span>
                                                                <span className="text-xs fw-medium text-warning-600 d-flex">
                                                                    <i className="ph-fill ph-star" />
                                                                </span>
                                                                <span className="text-xs fw-medium text-gray-400 d-flex">
                                                                    <i className="ph-fill ph-star" />
                                                                </span>
                                                                <span className="text-xs fw-medium text-gray-400 d-flex">
                                                                    <i className="ph-fill ph-star" />
                                                                </span>
                                                            </div>
                                                            <span className="text-gray-900 flex-shrink-0">
                                                                12
                                                            </span>
                                                        </div>
                                                        <div className="flex-align gap-8 mb-20">
                                                            <span className="text-gray-900 flex-shrink-0">2</span>
                                                            <div
                                                                className="progress w-100 bg-gray-100 rounded-pill h-8"
                                                                role="progressbar"
                                                                aria-label="Basic example"
                                                                aria-valuenow={20}
                                                                aria-valuemin={0}
                                                                aria-valuemax={100}
                                                            >
                                                                <div
                                                                    className="progress-bar bg-main-600 rounded-pill"
                                                                    style={{ width: "20%" }}
                                                                />
                                                            </div>
                                                            <div className="flex-align gap-4">
                                                                <span className="text-xs fw-medium text-warning-600 d-flex">
                                                                    <i className="ph-fill ph-star" />
                                                                </span>
                                                                <span className="text-xs fw-medium text-warning-600 d-flex">
                                                                    <i className="ph-fill ph-star" />
                                                                </span>
                                                                <span className="text-xs fw-medium text-gray-400 d-flex">
                                                                    <i className="ph-fill ph-star" />
                                                                </span>
                                                                <span className="text-xs fw-medium text-gray-400 d-flex">
                                                                    <i className="ph-fill ph-star" />
                                                                </span>
                                                                <span className="text-xs fw-medium text-gray-400 d-flex">
                                                                    <i className="ph-fill ph-star" />
                                                                </span>
                                                            </div>
                                                            <span className="text-gray-900 flex-shrink-0">5</span>
                                                        </div>
                                                        <div className="flex-align gap-8 mb-0">
                                                            <span className="text-gray-900 flex-shrink-0">1</span>
                                                            <div
                                                                className="progress w-100 bg-gray-100 rounded-pill h-8"
                                                                role="progressbar"
                                                                aria-label="Basic example"
                                                                aria-valuenow={5}
                                                                aria-valuemin={0}
                                                                aria-valuemax={100}
                                                            >
                                                                <div
                                                                    className="progress-bar bg-main-600 rounded-pill"
                                                                    style={{ width: "5%" }}
                                                                />
                                                            </div>
                                                            <div className="flex-align gap-4">
                                                                <span className="text-xs fw-medium text-warning-600 d-flex">
                                                                    <i className="ph-fill ph-star" />
                                                                </span>
                                                                <span className="text-xs fw-medium text-gray-400 d-flex">
                                                                    <i className="ph-fill ph-star" />
                                                                </span>
                                                                <span className="text-xs fw-medium text-gray-400 d-flex">
                                                                    <i className="ph-fill ph-star" />
                                                                </span>
                                                                <span className="text-xs fw-medium text-gray-400 d-flex">
                                                                    <i className="ph-fill ph-star" />
                                                                </span>
                                                                <span className="text-xs fw-medium text-gray-400 d-flex">
                                                                    <i className="ph-fill ph-star" />
                                                                </span>
                                                            </div>
                                                            <span className="text-gray-900 flex-shrink-0">2</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
      {/* NewArrivalTwo */}
      {/* <NewArrivalTwo /> */}

      {/* ShippingOne */}
      <ShippingOne />

      {/* NewsletterOne */}
      {/* <NewsletterOne /> */}

      {/* FooterTwo */}
      <FooterTwo />

      {/* BottomFooter */}
      <BottomFooter />


    </>
  );
};

export default ProductDetailsPageTwo;
