import React, {useEffect,useState} from 'react'
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import { ProductController } from '../../controller/productController.tsx';
import { CategoryController } from '../../controller/categoryController.tsx';
const BannerTwo = () => {
    const settings = {
        dots: true,

        infinite: true,
        speed: 1000,
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: 0,


    };
    const[datacategory,setdatacategory] = useState([]);
    const showdataCategory = async () => {
        const data = await CategoryController.fetchCategories();
        setdatacategory(data);
      }
    
      useEffect(() => {
        // showdataProduct();
        showdataCategory();
        console.log(datacategory);

      }, []);
    return (
        <div className="banner-two">
            <div className="container container-lg">
                <div className="banner-two-wrapper d-flex align-items-start">
                    <div className="w-265 d-lg-block d-none flex-shrink-0">
                        <div className="responsive-dropdown style-two common-dropdown nav-submenu p-0 submenus-submenu-wrapper shadow-none border border-gray-100 position-relative border-top-0">
                            <button
                                type="button"
                                className="close-responsive-dropdown rounded-circle text-xl position-absolute inset-inline-end-0 inset-block-start-0 mt-4 me-8 d-lg-none d-flex"
                            >
                                <i className="ph ph-x" />{" "}
                            </button>
                            <div className="logo px-16 d-lg-none d-block">
                                <Link to="/" className="link">
                                    <img src="assets/images/logo/logo.png" alt="Logo" />
                                </Link>
                            </div>
                            <ul className="responsive-dropdown__list scroll-sm p-0 py-8 overflow-y-auto ">
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
                    <div className="banner-item-two-wrapper rounded-24 overflow-hidden position-relative arrow-center flex-grow-1 mb-0">
    <div className="banner-item-two__slider">
        <Slider {...settings}>
            <div className="banner-item-two">
                <img
                    src="https://taozinsaigon.com/files_upload/weblink/slide-iphone-15-series-2005.jpg"
                    alt=""
                    className="banner-img position-absolute inset-block-start-0 inset-inline-start-0 w-100 h-100 z-n1 object-fit-cover rounded-24 banner-ims"
                />
            </div>
            <div className="banner-item-two">
                <img
                    src="https://taozinsaigon.com/files_upload/weblink/slide-iphone-15-series-2005.jpg"  // Thay đổi đường dẫn ảnh cho slide tiếp theo
                    alt=""
                    className="banner-img position-absolute inset-block-start-0 inset-inline-start-0 w-100 h-100 z-n1 object-fit-cover rounded-24"
                />
            </div>
            {/* Thêm các slide khác nếu cần */}
        </Slider>
    </div>
</div>

                </div>
            </div>
        </div>

    )
}

export default BannerTwo