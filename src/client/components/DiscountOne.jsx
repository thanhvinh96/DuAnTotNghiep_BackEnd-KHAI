import React from 'react'
import { Link } from 'react-router-dom'

const DiscountOne = () => {
    return (
        <section className="discount py-80">
            <div className="container container-lg">
            <div className="row gy-4">
    <div className="col-xl-6">
        <div className="discount-item rounded-16 overflow-hidden position-relative z-1" style={{ height: '300px' }}>
            <img
                src="https://namvietluat.vn/wp-content/uploads/2024/09/Co-nen-mo-cua-hang-kinh-doanh-thuc-pham-sach.jpg"
                alt=""
                className="position-absolute inset-block-start-0 inset-inline-start-0 w-100 h-100 z-n1"
                style={{ imageRendering: 'crisp-edges' }}  // Thêm thuộc tính này để hình ảnh sắc nét hơn
            />
        </div>
    </div>
    <div className="col-xl-6">
        <div className="discount-item rounded-16 overflow-hidden position-relative z-1" style={{ height: '300px' }}>
            <img
                src="https://thumb.danhsachcuahang.com/image/2020/10/20201010_19da4831efb6b23c43e56168cba646b3_1602315241.jpg"
                alt=""
                className="position-absolute inset-block-start-0 inset-inline-start-0 w-100 h-100 z-n1"
                style={{ imageRendering: 'crisp-edges' }}  // Thêm thuộc tính này để hình ảnh sắc nét hơn
            />
        </div>
    </div>
</div>

            </div>
        </section>

    )
}

export default DiscountOne