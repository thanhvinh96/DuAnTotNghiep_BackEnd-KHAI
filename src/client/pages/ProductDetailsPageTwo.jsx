import React, { useEffect, useState } from "react";
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
import { jwtDecode } from 'jwt-decode';
import { ReviewService } from '../../services/ReviewService.ts';
const ProductDetailsPageTwo = () => {
    const [activeTab, setActiveTab] = useState("description");

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };
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

    useEffect(() => {
        showdataProduct(id);
        console.log(id);
    }, [])
    const [timeLeft, setTimeLeft] = useState(getCountdown());

    const getDataProductById = async () => {
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


    const [rating, setRating] = useState(0); // Trạng thái cho đánh giá
    const [comment, setComment] = useState(''); // Trạng thái cho bình luận
    const [postDataReview, setPostDataReview] = useState({
        UserID: '',
        ProductID: '',
        Rating: '',
        Comment: ''
    });
    const handleStarClick = (value) => {
        setPostDataReview((postDataReview) => ({
            ...postDataReview,
            Rating: value,
            ProductID: id
        }));

        setRating(value); // Cập nhật mức độ đánh giá khi người dùng nhấp vào sao
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Đánh giá:', postDataReview);
        try {
            const res = await ReviewService.addReview(postDataReview); // Sử dụng await
            console.log(res);
            if (res.status === true) {
                Swal.fire({
                    icon: 'success',
                    title: 'Thêm Đánh Giá !',
                    text: `Cảm Ơn Bạn Đã Thêm Đánh Giá Sản Phẩm`,
                    confirmButtonText: 'OK'
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Thêm Đánh Giá!',
                    text: `Thêm Đánh Giá Thất Bại Bạn Phải Mua Sản Phẩm.`,
                    confirmButtonText: 'OK'
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Thêm Đánh Giá!',
                text: `Thêm Đánh Giá Thất Bại Bạn Phải Mua Sản Phẩm.`,
                confirmButtonText: 'OK'
            });
        }
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
    const [datareview, setdatareview] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [ratingCount, setRatingCount] = useState({});
    const showreviewdata = async () => {
        try {
            const res = await ReviewService.getReviewByProduct(id); // Sử dụng await để chờ dữ liệu

            // Tính tổng số sao và số lượng đánh giá
            const totalRatings = res.length;
            const totalStars = res.reduce((sum, review) => sum + review.Rating, 0);
            const averageRating = totalStars / totalRatings;

            // Đếm số lượng đánh giá từ 1 đến 5 sao
            const ratingCount = {
                oneStar: res.filter(review => review.Rating === 1).length,
                twoStars: res.filter(review => review.Rating === 2).length,
                threeStars: res.filter(review => review.Rating === 3).length,
                fourStars: res.filter(review => review.Rating === 4).length,
                fiveStars: res.filter(review => review.Rating === 5).length
            };

            // Lưu kết quả vào state
            setAverageRating(averageRating);
            setRatingCount(ratingCount);

            setdatareview(res); // Lưu dữ liệu đánh giá vào state
        } catch (error) {
            console.error('Error fetching reviews:', error); // Xử lý lỗi (nếu có)
        }
    };

    useEffect(() => {
        const tokenclient = localStorage.getItem('tokenUser');

        // Kiểm thử token trước khi giải mã
        if (!tokenclient || typeof tokenclient !== 'string' || tokenclient.trim() === '') {
            console.error('Invalid token:', tokenclient);
            return; // Dừng lại nếu token không hợp lệ
        }

        try {
            const decodedToken = jwtDecode(tokenclient);
            const userId = decodedToken['userId'];

            if (!userId) {
                console.error('User ID not found in token:', decodedToken);
                return; // Dừng lại nếu không tìm thấy userId
            }

            console.log('User ID:', userId);

            // Cập nhật postDataReview với UserID
            setPostDataReview((postDataReview) => ({
                ...postDataReview,
                UserID: userId
            }));

            // Gọi hàm hiển thị dữ liệu review
            showreviewdata();

        } catch (error) {
            console.error('Error decoding token:', error);
        }
    }, []);

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
            <section className=" container-lg product-details py-80">
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
                                                            <div key={index} style={{ width: '100%', textAlign: 'center' }}>
                                                                <img
                                                                    src={`http://localhost:3000/uploads/${image}`}
                                                                    alt={`Other product view ${index + 1}`}
                                                                    onClick={() => setMainImage(image)}
                                                                    style={{ maxWidth: '100%', height: 'auto' }}
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
                                <ul className="nav common-tab nav-pills mb-3" id="pills-tab" role="tablist">
                                    <li className="nav-item" role="presentation">
                                        <button
                                            className={`nav-link ${activeTab === "description" ? "active" : ""}`}
                                            onClick={() => handleTabChange("description")}
                                            type="button"
                                            role="tab"
                                            aria-selected={activeTab === "description"}
                                        >
                                            Mô Tả Sản Phẩm
                                        </button>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <button
                                            className={`nav-link ${activeTab === "reviews" ? "active" : ""}`}
                                            onClick={() => handleTabChange("reviews")}
                                            type="button"
                                            role="tab"
                                            aria-selected={activeTab === "reviews"}
                                        >
                                            Đánh Giá Sản Phẩm
                                        </button>
                                    </li>
                                </ul>
                                <Link
                                    to="#"
                                    className="btn bg-color-one rounded-16 flex-align gap-8 text-main-600 hover-bg-main-600 hover-text-white"
                                >
                                    <img src="assets/images/icon/satisfaction-icon.png" alt="" />
                                    100% Sản Phẩm Đúng Mô Tả
                                </Link>
                            </div>
                            <div className="product-dContent__box">
                                <div className="tab-content" id="pills-tabContent">
                                    {activeTab === "description" && (
                                        <div
                                            className="tab-pane fade show active"
                                            role="tabpanel"
                                            tabIndex={0}
                                        >
                                            <div className="mb-40">
                                                <p dangerouslySetInnerHTML={{ __html: product.Description }} />
                                            </div>
                                        </div>
                                    )}
                                    {activeTab === "reviews" && (
                                        <div
                                            className="tab-pane fade show active"
                                            role="tabpanel"
                                            tabIndex={0}
                                        >
                                            <div className="row g-4">
                                                <div className="col-lg-6">
                                                    <h6 className="mb-24">Đánh Giá Sản Phẩm</h6>
                                                    {/* Nội dung đánh giá sản phẩm ở đây */}

                                                    {/* Ví dụ một đánh giá: */}
                                                    <div>
                                                        {datareview.length > 0 ? (
                                                            datareview.map((review, index) => (
                                                                <div key={index} className="d-flex align-items-start gap-24 pb-44 border-bottom border-gray-100 mb-44">
                                                                    <img
                                                                        src="https://i.pinimg.com/736x/78/79/0d/78790d2f4f1c3747eb988c70b0ae3c3c.jpg" // Bạn có thể thay đổi theo dữ liệu avatar nếu có
                                                                        alt=""
                                                                        className="w-52 h-52 object-fit-cover rounded-circle flex-shrink-0"
                                                                    />
                                                                    <div className="flex-grow-1">
                                                                        <h6 className="mb-12 text-md">{review.Username || "Anonymous"}</h6>
                                                                        <div className="flex-align gap-8">
                                                                            {[...Array(review.Rating)].map((_, starIndex) => (
                                                                                <span key={starIndex} className="text-15 fw-medium text-warning-600 d-flex">
                                                                                    <i className="ph-fill ph-star" />
                                                                                </span>
                                                                            ))}
                                                                        </div>
                                                                        <p className="text-gray-700 mt-24">{review.Comment}</p>
                                                                        <p className="text-gray-700">
                                                                            {/* Bạn có thể chèn thêm mô tả sản phẩm hoặc nội dung khác */}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <p>Không có đánh giá nào.</p>
                                                        )}
                                                    </div>
                                                    {/* Thêm phần viết đánh giá ở đây */}
                                                    <div className="mt-56">
                                                        <h6 className="mb-24">Đánh Giá Chất Lượng Sản Phẩm </h6>
                                                        <form onSubmit={handleSubmit}>
                                                            <div className="mb-32">
                                                                <label className="text-neutral-600 mb-8">Đánh Giá Sao</label>
                                                                <div className="stars">
                                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                                        <span
                                                                            key={star}
                                                                            className={`star ${rating >= star ? 'filled' : ''}`}
                                                                            onClick={() => handleStarClick(star)} // Cập nhật đánh giá khi nhấp vào sao
                                                                            style={{
                                                                                cursor: 'pointer',
                                                                                fontSize: '24px', // Kích thước sao
                                                                                color: rating >= star ? 'gold' : 'gray', // Màu sắc sao
                                                                            }}
                                                                        >
                                                                            ★
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                            <div className="mb-32">
                                                                <label htmlFor="desc" className="text-neutral-600 mb-8">Nội Dung Đánh Giá</label>
                                                                <textarea
                                                                    className="common-input rounded-8"
                                                                    id="desc"
                                                                    value={comment}
                                                                    onChange={(e) => {
                                                                        const newComment = e.target.value; // Get the new comment value

                                                                        // Update the comment state
                                                                        setComment(newComment);

                                                                        // Update the postDataReview state
                                                                        setPostDataReview((postDataReview) => ({
                                                                            ...postDataReview,
                                                                            Comment: newComment, // Assuming you want to store the comment as the rating
                                                                        }));
                                                                    }} // Cập nhật bình luận
                                                                    placeholder="Nhập nội dung đánh giá của bạn..."
                                                                    required
                                                                />

                                                                <button
                                                                    type="submit"
                                                                    className="btn btn-main rounded-pill mt-48"
                                                                >
                                                                    Đánh Giá
                                                                </button>
                                                            </div>


                                                        </form>
                                                    </div>
                                                </div>
                                                <div className="col-lg-6">
                                                    <div className="ms-xxl-5">
                                                        <h6 className="mb-24">Thống Kê Đánh Giá</h6>
                                                        <div className="d-flex flex-wrap gap-44">
                                                            <div className="border border-gray-100 rounded-8 px-40 py-52 flex-center flex-column flex-shrink-0 text-center">
                                                                <h2 className="mb-6 text-main-600">{averageRating}</h2>
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
                                                                    Trung Bình Đánh Giá
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
                                                                        {ratingCount.fiveStars}
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
                                                                        <span className="text-xs fw-medium text-warning-600 d-flex">
                                                                            <i className="ph-fill ph-star" />
                                                                        </span>
                                                                    </div>
                                                                    <span className="text-gray-900 flex-shrink-0">
                                                                        {ratingCount.fourStars}                                                            </span>
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
                                                                        <span className="text-xs fw-medium text-warning-600 d-flex">
                                                                            <i className="ph-fill ph-star" />
                                                                        </span>
                                                                        <span className="text-xs fw-medium text-warning-600 d-flex">
                                                                            <i className="ph-fill ph-star" />
                                                                        </span>
                                                                    </div>
                                                                    <span className="text-gray-900 flex-shrink-0">
                                                                        {ratingCount.threeStars}
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
                                                                    <span className="text-gray-900 flex-shrink-0">{ratingCount.twoStars}</span>
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
                                                                    <span className="text-gray-900 flex-shrink-0">{ratingCount.oneStar}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>

                                    )}

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
