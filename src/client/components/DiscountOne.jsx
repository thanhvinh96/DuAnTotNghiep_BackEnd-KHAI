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
                src="https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:90/plain/https://dashboard.cellphones.com.vn/storage/apple-chinh-hang-home.jpg"
                alt=""
                className="position-absolute inset-block-start-0 inset-inline-start-0 w-100 h-100 z-n1"
                style={{ imageRendering: 'crisp-edges' }}  // Thêm thuộc tính này để hình ảnh sắc nét hơn
            />
        </div>
    </div>
    <div className="col-xl-6">
        <div className="discount-item rounded-16 overflow-hidden position-relative z-1" style={{ height: '300px' }}>
            <img
                src="https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:90/plain/https://dashboard.cellphones.com.vn/storage/xiaomi.png"
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