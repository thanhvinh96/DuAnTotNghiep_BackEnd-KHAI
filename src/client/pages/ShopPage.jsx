import React, { useState, useEffect } from 'react'

import Preloader from "../helper/Preloader";
import HeaderTwo from "../components/HeaderTwo";
import Breadcrumb from "../components/Breadcrumb";
import ShopSection from "../components/ShopSection";
import ShippingTwo from "../components/ShippingTwo";
import FooterTwo from "../components/FooterTwo";
import ColorInit from "../helper/ColorInit";
import ScrollToTop from "react-scroll-to-top";
import { ProductController } from '../../controller/productController.tsx';
import { CategoryController } from '../../controller/categoryController.tsx';
import { Link, useLocation } from 'react-router-dom';
import ReactSlider from 'react-slider';

const ShopPage = () => {
    const location = useLocation();

    // Sử dụng URLSearchParams để lấy giá trị của 'category'
    const searchParams = new URLSearchParams(location.search);
    const categoryFromURL = searchParams.get('category');
    const productFromURL = searchParams.get('productname');
    const [dataProduct, setDataProduct] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(10);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [priceRange, setPriceRange] = useState([0, 100000000000]); // Khởi tạo giá trị mặc định
    const [searchTerm, setSearchTerm] = useState(''); // State cho từ khóa tìm kiếm
    const [grid, setGrid] = useState(false);
    const [active, setActive] = useState(false);
    useEffect(() => {
        if (categoryFromURL) {
            setSelectedCategory(parseInt(categoryFromURL)); // Chuyển category từ URL thành số nếu cần
        } else {
            setSelectedCategory(null); // Nếu không có category trong URL, hiển thị tất cả
        }
    }, [categoryFromURL]);
    // Hàm lấy dữ liệu sản phẩm
    const showdataProduct = async () => {
        const data = await ProductController.fetchProducts();
        console.log("Products fetched:", data); // Console log dữ liệu sản phẩm
        setDataProduct(data);
    }

    // Hàm lấy dữ liệu danh mục
    const showdataCategory = async () => {
        const data = await CategoryController.fetchCategories();
        console.log("Categories fetched:", data); // Console log dữ liệu danh mục
        setCategories(data);
    }

    useEffect(() => {
        showdataProduct();
        showdataCategory();
    }, []);

    // Tính toán số lượng sản phẩm cho từng danh mục
    const productCountByCategory = categories.map(category => {
        const productCount = dataProduct.filter(product => product.CategoryID === category.CategoryID).length;
        console.log(`Category: ${category.CategoryName}, Product Count: ${productCount}`); // Console log số lượng sản phẩm theo danh mục
        return {
            ...category,
            ProductCount: productCount
        };
    });

    // Lọc sản phẩm theo danh mục và khoảng giá
    // const filteredProducts = dataProduct.filter(product => {
    //     console.log(product.ProductID); // In ra ProductID của sản phẩm
    //     console.log(product.CategoryID ); // In ra ProductID của sản phẩm
    //     console.log('selectedCategory'+selectedCategory)
    //     return (
    //         (selectedCategory ? product.CategoryID === selectedCategory : true) &&
    //         (product.Price >= priceRange[0] && product.Price <= priceRange[1]) && // Lọc theo giá VND
    //         (product.ProductName.toLowerCase().includes(searchTerm.toLowerCase())) // Lọc theo tên sản phẩm
    //     );
    // });
    const filteredProducts = dataProduct.filter(product => {
        console.log(product.ProductID); // In ra ProductID của sản phẩm
        console.log(product.CategoryID); // In ra CategoryID của sản phẩm
        console.log('selectedCategory: ' + selectedCategory);
        console.log('searchTerm: ' + searchTerm);
        console.log('priceRange: ', priceRange); // In ra khoảng giá hiện tại
    
        // Điều kiện lọc theo danh mục, tên sản phẩm và khoảng giá
        return (
            (selectedCategory ? product.CategoryID === selectedCategory : true) &&
                (productFromURL ? product.ProductName.toLowerCase().includes(productFromURL.toLowerCase()) : true) && // Lọc theo productname từ URL
                product.ProductName.toLowerCase().includes(searchTerm.toLowerCase()) && // Lọc theo tên sản phẩm từ searchTerm
                product.Price >= priceRange[0] && product.Price <= priceRange[1] // Lọc theo khoảng giá
        );
    });
    
    console.log("Filtered products:", filteredProducts); // Console log sản phẩm đã lọc

    // Tính toán các chỉ số cho phân trang
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    console.log("Current products:", currentProducts); // Console log sản phẩm hiện tại

    // Hàm điều khiển sidebar
    const sidebarController = () => {
        setActive(!active);
        console.log(`Sidebar is now ${!active ? 'open' : 'closed'}`); // Console log trạng thái sidebar
    };


    return (
        <>
            {/* ColorInit */}
            <ColorInit color={true} />

            {/* ScrollToTop */}
            <ScrollToTop smooth color="#FA6400" />

            {/* Preloader */}
            <Preloader />

            {/* HeaderOne */}
            <HeaderTwo category={true} />

            {/* Breadcrumb */}
            <Breadcrumb title={"Shop"} />

            {/* ShopSection */}
            <section className="shop py-80">
                <div className={`side-overlay ${active && "show"}`}></div>
                <div className="container container-lg">
                    <div className="row">
                        {/* Sidebar Start */}
                        <div className="col-lg-3">
                            <div className={`shop-sidebar ${active && "active"}`}>
                                <button onClick={sidebarController}
                                    type="button"
                                    className="shop-sidebar__close d-lg-none d-flex w-32 h-32 flex-center border border-gray-100 rounded-circle hover-bg-main-600 position-absolute inset-inline-end-0 me-10 mt-8 hover-text-white hover-border-main-600"
                                >
                                    <i className="ph ph-x" />
                                </button>
                                <div className="shop-sidebar__box border border-gray-100 rounded-8 p-32 mb-32">
                                    <h6 className="text-xl border-bottom border-gray-100 pb-24 mb-24">
                                        Sản Phẩm Theo Danh Mục
                                    </h6>
                                    <ul className="max-h-540 overflow-y-auto scroll-sm">
                                        {productCountByCategory.map((category) => (
                                            <li
                                                className="mb-24"
                                                key={category.CategoryID}
                                                onClick={() => setSelectedCategory(category.CategoryID)} // Khi nhấn vào danh mục, đặt danh mục được chọn
                                                style={{ cursor: 'pointer', fontWeight: selectedCategory === category.CategoryID ? 'bold' : 'normal' }} // Tô đậm danh mục được chọn
                                            >
                                                {category.CategoryName} ({category.ProductCount}) {/* Hiển thị tên danh mục và số lượng sản phẩm */}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="shop-sidebar__box border border-gray-100 rounded-8 p-32 mb-32">
                                    <h6 className="text-xl border-bottom border-gray-100 pb-24 mb-24">
                                        Sản Phẩm Theo Tên
                                    </h6>
                                    <input
                                        type="text"
                                        placeholder="Search by product name..."
                                        className="border rounded h-40 p-8 w-full"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)} // Cập nhật từ khóa tìm kiếm
                                    />
                                </div>
                                <div className="shop-sidebar__box border border-gray-100 rounded-8 p-32 mb-32">

                                <div className="custom--range">
    <h6 className="text-xl border-bottom border-gray-100 pb-24 mb-24">
        Lọc Về Giá
    </h6>
    <ReactSlider
        className="horizontal-slider"
        thumbClassName="example-thumb"
        trackClassName="example-track"
        value={priceRange} // Giá trị hiện tại của slider
        onChange={setPriceRange} // Cập nhật giá trị khoảng giá khi kéo
        ariaLabel={['Lower thumb', 'Upper thumb']}
        pearling
        min={0} // Giá trị tối thiểu
        max={100000000000} // Giá trị tối đa
        minDistance={100000} // Khoảng cách tối thiểu giữa hai thumb (100,000 VND)
    />
    <div className="price-range-labels">
        <span className="price-range-labels-price">
            Giá: {priceRange[0].toLocaleString('vi-VN')}₫ - {priceRange[1].toLocaleString('vi-VN')}₫
        </span>
    </div>
    <br />
</div>


                                </div>





                            </div>
                        </div>
                        {/* Sidebar End */}
                        {/* Content Start */}
                        <div className="col-lg-9">
                            {/* Top Start */}
                            <div className="flex-between gap-16 flex-wrap mb-40 ">
                                <span className="text-gray-900">Hiển thị 1-20 của 85 kết quả
</span>
                                <div className="position-relative flex-align gap-16 flex-wrap">
                                    <div className="list-grid-btns flex-align gap-16">
                                        <button onClick={() => setGrid(true)}
                                            type="button"
                                            className={`w-44 h-44 flex-center border rounded-6 text-2xl list-btn border-gray-100 ${grid === true && "border-main-600 text-white bg-main-600"}`}
                                        >
                                            <i className="ph-bold ph-list-dashes" />
                                        </button>
                                        <button onClick={() => setGrid(false)}
                                            type="button"
                                            className={`w-44 h-44 flex-center border rounded-6 text-2xl grid-btn border-gray-100 ${grid === false && "border-main-600 text-white bg-main-600"}`}
                                        >
                                            <i className="ph ph-squares-four" />
                                        </button>
                                    </div>
                                  
                                    <button onClick={sidebarController}
                                        type="button"
                                        className="w-44 h-44 d-lg-none d-flex flex-center border border-gray-100 rounded-6 text-2xl sidebar-btn"
                                    >
                                        <i className="ph-bold ph-funnel" />
                                    </button>
                                </div>
                            </div>
                            {/* Top End */}
                            <div className={`list-grid-wrapper ${grid && "list-view"}`}>
                                {currentProducts.map(product => (
                                    <div key={product.ProductID} className="product-card h-100 p-16 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
                                        <Link
                                            to={`/product-details?id=${product.ProductID}`} // Thay đổi đường dẫn phù hợp
                                            className="product-card__thumb flex-center rounded-8 bg-gray-50 position-relative"
                                        >
                                            <div className="product-card__thumb flex-center rounded-8 bg-gray-50 position-relative">
                                                <img
                                                    src={`http://localhost:3000/uploads/${product.OtherImages[0]}`} // Hiển thị ảnh đầu tiên trong OtherImages
                                                    alt={product.ProductName}
                                                    className="w-auto max-w-unset" // Có thể bỏ nếu bạn đã định nghĩa CSS ở trên
                                                />
                                            </div>

                                            {/* <span className="product-card__badge bg-primary-600 px-8 py-4 text-sm text-white position-absolute inset-inline-start-0 inset-block-start-0">
                            Best Sale{" "}
                        </span> */}
                                        </Link>
                                        <div className="product-card__content mt-16">
                                            <h6 className="title text-lg fw-semibold mt-12 mb-8">
                                                <Link
                                                    to={`/product-details/${product.ProductID}`} // Thay đổi đường dẫn phù hợp
                                                    className="link text-line-2"
                                                    tabIndex={0}
                                                >
                                                    {product.ProductName}
                                                </Link>
                                            </h6>
                                            <div className="product-card__price my-20">
                                                <span className="text-heading text-md fw-semibold ">
                                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.Price)} <span className="text-gray-500 fw-normal">/Sản Phẩm</span>
                                                </span>
                                            </div>
                                            <Link to={`/product-details?id=${product.ProductID}`}

                                                className="product-card__cart btn bg-gray-50 text-heading hover-bg-main-600 hover-text-white py-11 px-24 rounded-8 flex-center gap-8 fw-medium"
                                                tabIndex={0}
                                            >
                                                Thêm Vào Giỏ Hàng<i className="ph ph-shopping-cart" />
                                            </Link>
                                        </div>
                                    </div>
                                ))}

                            </div>
                            {/* Pagination Start */}
                            <ul className="pagination flex-center flex-wrap gap-16">
                                <li className="page-item">
                                    <Link className="page-link" to="#" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>
                                        <i className="ph-bold ph-arrow-left" />
                                    </Link>
                                </li>
                                {[...Array(Math.ceil(dataProduct.length / productsPerPage)).keys()].map(page => (
                                    <li className={`page-item ${currentPage === page + 1 ? 'active' : ''}`} key={page}>
                                        <Link className="page-link" to="#" onClick={() => setCurrentPage(page + 1)}>
                                            {page + 1}
                                        </Link>
                                    </li>
                                ))}
                                <li className="page-item">
                                    <Link className="page-link" to="#" onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(dataProduct.length / productsPerPage)))}>
                                        <i className="ph-bold ph-arrow-right" />
                                    </Link>
                                </li>
                            </ul>
                            {/* Pagination End */}
                        </div>
                        {/* Content End */}
                    </div>
                </div>
            </section>
            {/* ShippingTwo */}
            <ShippingTwo />

            {/* FooterTwo */}
            <FooterTwo />


        </>
    );
};

export default ShopPage;
