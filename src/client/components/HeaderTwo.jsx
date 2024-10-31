import React, { useEffect, useState } from 'react'
import query from 'jquery';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { CategoryController } from '../../controller/categoryController.tsx';
import Logo from 'F.png'

const HeaderTwo = ({ category }) => {
    const [scroll, setScroll] = useState(false)
    useEffect(() => {
        window.onscroll = () => {
            if (window.pageYOffset < 150) {
                setScroll(false);
            } else if (window.pageYOffset > 150) {
                setScroll(true);
            }
            return () => (window.onscroll = null);
        };
        const selectElement = query('.js-example-basic-single');
        selectElement.select2();

        return () => {
            if (selectElement.data('select2')) {
                selectElement.select2('destroy');
            }
        };
    }, []);
    const tokenUser = localStorage.getItem('tokenUser'); // Lấy token từ localStorage
    // Set the default language
    const [selectedLanguage, setSelectedLanguage] = useState("Eng");
    const handleLanguageChange = (language) => {
        setSelectedLanguage(language);
    };
    // Set the default currency
    const [selectedCurrency, setSelectedCurrency] = useState("USD");
    const handleCurrencyChange = (currency) => {
        setSelectedCurrency(currency);
    };
    // Mobile menu support
    const [menuActive, setMenuActive] = useState(false)
    const [activeIndex, setActiveIndex] = useState(null);
    const handleMenuClick = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };
    const handleMenuToggle = () => {
        setMenuActive(!menuActive);
    };
    // Search control support
    const [activeSearch, setActiveSearch] = useState(false)
    const handleSearchToggle = () => {
        setActiveSearch(!activeSearch);
    };
    // category control support
    const [activeCategory, setActiveCategory] = useState(false)
    const handleCategoryToggle = () => {
        setActiveCategory(!activeCategory);
    };
    const [activeIndexCat, setActiveIndexCat] = useState(null);
    const handleCatClick = (index) => {
        setActiveIndexCat(activeIndexCat === index ? null : index);
    };
    const [datacategory, setdatacategory] = useState([]);
    const showdataCategory = async () => {
        try {
            const data = await CategoryController.fetchCategories();
            const sortedData = data.sort((a, b) => a.location - b.location);
            setdatacategory(sortedData);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };
    useEffect(() => {
        // showdataProduct();
        showdataCategory();
        console.log(datacategory);

    }, []);
    const [searchTerm, setSearchTerm] = useState(''); // State để lưu giá trị tìm kiếm
    const navigate = useNavigate(); // Hook để điều hướng

    const handleSearch = (e) => {
        e.preventDefault(); // Ngăn chặn form submit mặc định
        if (searchTerm) {
            navigate(`/shop?productname=${searchTerm}`); // Điều hướng đến trang /shop với query productname
        }
    };
    return (
        <>
            <div className="overlay " />
            <div className={`side-overlay ${(menuActive || activeCategory) && "show"}`} />
            {/* ==================== Search Box Start Here ==================== */}
            <form action="#" className={`search-box ${activeSearch && "active"}`}>
                <button onClick={handleSearchToggle}
                    type="button"
                    className="search-box__close position-absolute inset-block-start-0 inset-inline-end-0 m-16 w-48 h-48 border border-gray-100 rounded-circle flex-center text-white hover-text-gray-800 hover-bg-white text-2xl transition-1"
                >
                    <i className="ph ph-x" />
                </button>
                <div className="container">
                    <div className="position-relative">
                        <input
                            type="text"
                            className="form-control py-16 px-24 text-xl rounded-pill pe-64"
                            placeholder="Search for a product or brand"
                        />
                        <button
                            type="submit"
                            className="w-48 h-48 bg-main-600 rounded-circle flex-center text-xl text-white position-absolute top-50 translate-middle-y inset-inline-end-0 me-8"
                        >
                            <i className="ph ph-magnifying-glass" />
                        </button>
                    </div>
                </div>
            </form>
            {/* ==================== Search Box End Here ==================== */}
            {/* ==================== Mobile Menu Start Here ==================== */}
            <div className={`mobile-menu scroll-sm d-lg-none d-block ${menuActive && "active"}`}>
                <button onClick={() => { handleMenuToggle(); setActiveIndex(null) }} type="button" className="close-button">
                    <i className="ph ph-x" />{" "}
                </button>
                <div className="mobile-menu__inner">
                    <Link to="/" className="mobile-menu__logo">
                        <img src="assets/images/logo/F.png" alt="Logo" />
                    </Link>
                    <div className="mobile-menu__menu">
                        {/* Nav Menu Start */}
                        <ul className="nav-menu flex-align nav-menu--mobile">

                            <li className="nav-menu__item">
                                <Link to="/" className="nav-menu__link">
                                    Trang Chủ
                                </Link>
                            </li>
                            <li className="nav-menu__item">
                                <Link to="/shop" className="nav-menu__link">
                                    Cửa Hàng
                                </Link>
                            </li>
                            <li className="nav-menu__item">
                                <Link to="/contact" className="nav-menu__link">
                                    Liên Hệ
                                </Link>
                            </li>
                        </ul>
                        {/* Nav Menu End */}
                    </div>
                </div>
            </div>
            <div
                className="header-top flex-between"
                style={{ backgroundColor: 'green' }}
            >
                <div className="container container-lg">
                    <div className="flex-between flex-wrap gap-8">
                        <ul className="flex-align flex-wrap d-none d-md-flex" style={{ marginLeft: '90px' }}>
                            <li className="border-right-item text-white text-sm hover-text-decoration-underline py-8 flex-align gap-6" >
                                <i className="ph ph-phone" />
                                0879594661
                            </li>
                            <li className="border-right-item text-white text-sm hover-text-decoration-underline py-8 flex-align gap-6" >
                                <i className="ph ph-envelope" />
                                khaidmps34940@fpt.edu.vn
                            </li>
                        </ul>
                        <ul className="header-top__right flex-align flex-wrap">
                            <li className="border-right-item text-white text-sm hover-text-decoration-underline py-8 flex-align gap-6" >
                                <i className="ph ph-map-pin" />
                                Công Viên Phần Mền Quang Trung - Quận 12 - TP.HCM
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            {/* ======================= Middle Header Two Start ========================= */}
            <header
                className="header-middle style-two border"
                style={{ backgroundColor: "white" }}
            >
                <div className="container container-lg">
                    <nav className="header-inner flex-between">
                        {/* Logo Start */}
                        <div className="logo">
                            <Link to="/" className="link">
                                <img src={Logo} alt="Logo" />
                            </Link>
                        </div>
                        <form
                            action="#"
                            className="flex-align flex-wrap form-location-wrapper"
                            onSubmit={handleSearch}
                        >
                            <div className="search-category d-flex h-48 select-border-end-0 radius-end-0 search-form d-sm-flex d-none">
                                <div className="search-form__wrapper position-relative">
                                    <input
                                        type="text"
                                        className="search-form__input common-input py-13 ps-16 pe-18 rounded-end-pill pe-44"
                                        placeholder="Tìm Sản Phẩm Theo Yêu Cầu"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)} // Cập nhật giá trị tìm kiếm
                                    />
                                    <button
                                        type="submit"
                                        style={{ backgroundColor: 'green' }}
                                        className="w-32 h-32 rounded-circle flex-center text-xl text-white position-absolute top-50 translate-middle-y inset-inline-end-0 me-8"
                                    >
                                        <i className="ph ph-magnifying-glass" />
                                    </button>
                                </div>
                            </div>

                        </form>
                        {/* form Category start */}
                        {/* Header Middle Right start */}
                        <div className="header-right flex-align d-lg-block d-none">
                            {tokenUser ? (
                                <div className="header-two-activities flex-align flex-wrap gap-32">
                                    <button
                                        type="button"
                                        className="flex-align search-icon d-lg-none d-flex gap-4 item-hover-two"
                                    >
                                        <span className="text-2xl text-white d-flex position-relative item-hover__text">
                                            <i className="ph ph-magnifying-glass" />
                                        </span>
                                    </button>
                                    <Link
                                        to="/profile"
                                        className="flex-align flex-column gap-8 item-hover-two"
                                    >
                                        <span className="text-2xl text-success d-flex position-relative item-hover__text">
                                            <i className="ph ph-user" />
                                        </span>
                                        <span className="text-md text-success item-hover__text d-none d-lg-flex">
                                            Tài Khoản
                                        </span>
                                    </Link>
                                    <Link
                                        to="/cart"
                                        className="flex-align flex-column gap-8 item-hover-two"
                                    >
                                        <span className="text-2xl text-success d-flex position-relative item-hover__text">
                                            <i className="ph ph-shopping-cart-simple" />
                                        </span>
                                        <span className="text-md text-success item-hover__text d-none d-lg-flex">
                                            Giỏ Hàng
                                        </span>
                                    </Link>
                                </div>
                            ) : (
                                <div className="auth-buttons flex-align gap-32">
                                    <Link to="/login" className="btn btn-main flex-center gap-8 rounded-8 py-16 fw-normal ">
                                        Đăng Nhập Tài Khoản
                                    </Link>

                                </div>
                            )}
                        </div>
                        {/* Header Middle Right End  */}
                    </nav>
                </div>
            </header>
            {/* ==================== Header Two Start Here ==================== */}
            <header className={`header bg-white border-bottom border-gray-100 ${scroll && "fixed-header"}`}>
                <div className="container container-lg">
                    <nav className="header-inner d-flex justify-content-between gap-8">
                        <div className="flex-align menu-category-wrapper">
                            {/* Category Dropdown Start */}
                            <div className={`category-two ${category === false ? "d-block" : "d-none"} `}>
                                <button onClick={handleCategoryToggle}
                                    type="button"
                                    style={{ backgroundColor: 'green' }}
                                    className="category__button flex-align gap-8 fw-medium p-16 text-white"
                                >
                                    <span className="icon text-2xl d-xs-flex d-none">
                                        <i className="ph ph-dots-nine" />
                                    </span>
                                    <span className="d-sm-flex d-none">Danh Mục Sản Phẩm</span>

                                </button>
                                <div className={`responsive-dropdown cat common-dropdown d-lg-none d-block nav-submenu p-0 submenus-submenu-wrapper shadow-none border border-gray-100 ${activeCategory && "active"}`}>
                                    <button onClick={() => { handleCategoryToggle(); setActiveIndexCat(null) }}
                                        type="button"
                                        className="close-responsive-dropdown rounded-circle text-xl position-absolute inset-inline-end-0 inset-block-start-0 mt-4 me-8 d-lg-none d-flex"
                                    >
                                        <i className="ph ph-x" />{" "}
                                    </button>
                                    <div className="logo px-16 d-lg-none d-block">
                                        <Link to="/" className="link">
                                            <img src={Logo} alt="Logo" />
                                        </Link>
                                    </div>
                                    <ul className="scroll-sm p-0 py-8 w-300 max-h-400 overflow-y-auto">
                                        {datacategory.length > 0 ? (
                                            datacategory.map((category) => (
                                                <li className="has-submenus-submenu" key={category.CategoryID}>
                                                    <Link
                                                        to={`/shop/?category=${category.CategoryID}`} // Thay đường dẫn nếu cần
                                                        className="text-gray-500 text-15 py-12 px-16 flex-align gap-8 rounded-0"
                                                    >
                                                        <span>{category.CategoryName}</span>
                                                        <span className="icon text-md d-flex ms-auto">
                                                            <i className="ph ph-caret-right" />
                                                        </span>
                                                    </Link>
                                                </li>
                                            ))
                                        ) : (
                                            <li>No categories available</li>
                                        )}

                                    </ul>
                                </div>
                            </div>
                            <div className={`category main  on-hover-item text-white ${category === true ? "d-block" : "d-none"}`} style={{ backgroundColor: 'green' }}>
                                <button
                                    type="button"
                                    className="category__button flex-align gap-8 fw-medium p-16 border-end border-start border-gray-100 text-white"
                                >
                                    <span className="icon text-2xl d-xs-flex d-none">
                                        <i className="ph ph-dots-nine" />
                                    </span>
                                    <span className="d-sm-flex d-none">Danh Mục</span>
                                    <span className="arrow-icon text-xl d-flex">
                                        <i className="ph ph-caret-down" />
                                    </span>
                                </button>
                                <div className="responsive-dropdown on-hover-dropdown common-dropdown nav-submenu p-0 submenus-submenu-wrapper">
                                    <button
                                        type="button"
                                        className="close-responsive-dropdown rounded-circle text-xl position-absolute inset-inline-end-0 inset-block-start-0 mt-4 me-8 d-lg-none d-flex"
                                    >
                                        <i className="ph ph-x" />{" "}
                                    </button>
                                    <div className="logo px-16 d-lg-none d-block">
                                        <Link to="/" className="link">
                                            <img src={Logo} alt="Logo" />
                                        </Link>
                                    </div>
                                    <ul className="scroll-sm p-0 py-8 w-300 max-h-400 overflow-y-auto">
                                        {datacategory.length > 0 ? (
                                            datacategory.map((category) => (
                                                <li className="has-submenus-submenu" key={category.CategoryID}>
                                                    <Link
                                                        to={`/shop/?category=${category.CategoryID}`} // Thay đường dẫn nếu cần
                                                        className="text-gray-500 text-15 py-12 px-16 flex-align gap-8 rounded-0"
                                                    >
                                                        <span>{category.CategoryName}</span>
                                                        <span className="icon text-md d-flex ms-auto">
                                                            <i className="ph ph-caret-right" />
                                                        </span>
                                                    </Link>
                                                </li>
                                            ))
                                        ) : (
                                            <li>No categories available</li>
                                        )}

                                    </ul>

                                </div>
                            </div>
                            {/* Category Dropdown End  */}
                            {/* Menu Start  */}
                            <div className="header-menu d-lg-block d-none">
                                {/* Nav Menu Start */}
                                <ul className="nav-menu flex-align ">
                                    <li className="nav-menu__item">
                                        <Link to="/" className="nav-menu__link">
                                            Trang chủ
                                        </Link>

                                    </li>
                                    <li className="nav-menu__item">
                                        <Link to="/shop" className="nav-menu__link">
                                            Cửa Hàng
                                        </Link>

                                    </li>
                                    <li className="nav-menu__item">
                                        <NavLink to="/contact" className={(navData) =>
                                            navData.isActive ? "nav-menu__link activePage" : "nav-menu__link"
                                        }>
                                            Liên Hệ
                                        </NavLink>
                                    </li>
                                </ul>
                                {/* Nav Menu End */}
                            </div>
                            {/* Menu End  */}
                        </div>
                        {/* Header Right start */}
                        <div className="header-right flex-align">
                            <div className="select-dropdown-for-home-two d-lg-block d-none">
                                {/* Dropdown Select Start */}

                                {/* Dropdown Select End */}
                            </div>
                            <div className="me-8 d-lg-none d-block">
                                <div className="header-two-activities flex-align flex-wrap gap-32">
                                    <button onClick={handleSearchToggle}
                                        type="button"
                                        className="flex-align search-icon d-lg-none d-flex gap-4 item-hover-two"
                                    >
                                        <span className="text-2xl text-white d-flex position-relative item-hover__text">
                                            <i className="ph ph-magnifying-glass" />
                                        </span>
                                    </button>
                                    <Link
                                        to="/account"
                                        className="flex-align flex-column gap-8 item-hover-two"
                                    >
                                        <span className="text-2xl text-white d-flex position-relative item-hover__text">
                                            <i className="ph ph-user" />
                                        </span>
                                        <span className="text-md text-white item-hover__text d-none d-lg-flex">
                                            Profile
                                        </span>
                                    </Link>
                                    <Link
                                        to="/cart"
                                        className="flex-align flex-column gap-8 item-hover-two"
                                    >
                                        <span className="text-2xl text-white d-flex position-relative me-6 mt-6 item-hover__text">
                                            <i className="ph ph-heart" />
                                            <span className="w-16 h-16 flex-center rounded-circle bg-main-two-600 text-white text-xs position-absolute top-n6 end-n4">
                                                2
                                            </span>
                                        </span>
                                        <span className="text-md text-white item-hover__text d-none d-lg-flex">
                                            Wishlist
                                        </span>
                                    </Link>
                                    <Link
                                        to="/cart"
                                        className="flex-align flex-column gap-8 item-hover-two"
                                    >
                                        <span className="text-2xl text-white d-flex position-relative me-6 mt-6 item-hover__text">
                                            <i className="ph-fill ph-shuffle" />
                                            <span className="w-16 h-16 flex-center rounded-circle bg-main-two-600 text-white text-xs position-absolute top-n6 end-n4">
                                                2
                                            </span>
                                        </span>
                                        <span className="text-md text-white item-hover__text d-none d-lg-flex">
                                            Compare
                                        </span>
                                    </Link>
                                    <Link
                                        to="/cart"
                                        className="flex-align flex-column gap-8 item-hover-two"
                                    >
                                        <span className="text-2xl text-white d-flex position-relative me-6 mt-6 item-hover__text">
                                            <i className="ph ph-shopping-cart-simple" />
                                            <span className="w-16 h-16 flex-center rounded-circle bg-main-two-600 text-white text-xs position-absolute top-n6 end-n4">
                                                2
                                            </span>
                                        </span>
                                        <span className="text-md text-white item-hover__text d-none d-lg-flex">
                                            Cart
                                        </span>
                                    </Link>
                                </div>
                            </div>
                            <button onClick={handleMenuToggle}
                                type="button"
                                className="toggle-mobileMenu d-lg-none ms-3n text-gray-800 text-4xl d-flex"
                            >
                                {" "}
                                <i className="ph ph-list" />{" "}
                            </button>
                        </div>
                        {/* Header Right End  */}
                    </nav>
                </div>
            </header>
            {/* ==================== Header End Here ==================== */}
        </>

    )
}

export default HeaderTwo