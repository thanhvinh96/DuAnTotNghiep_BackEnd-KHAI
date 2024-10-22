import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { OrderService } from '../../services/OrderService.ts';

const OrderDetailPage = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get('id');
    const codeorder = queryParams.get('codeorder');
    const address = queryParams.get('address');

    const [orderDetails, setOrderDetails] = useState([]); // Khởi tạo mảng trống
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const orderData = await OrderService.showorderdetail(id);
                console.log("Giá trị:", JSON.stringify(orderData, null, 2)); // In ra orderData dưới dạng JSON
                setOrderDetails(orderData.Products || []); // Cập nhật orderDetails với mảng sản phẩm
            } catch (error) {
                console.error('Error fetching order details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [id]);

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (!orderDetails || orderDetails.length === 0) {
        return <div>Không có dữ liệu cho đơn hàng này.</div>;
    }

    return (
        <div className="container mt-5">
            <div className="card account-card">
                <div className="card-body">
                    <h2 className="card-title">Chi tiết đơn hàng: {codeorder}</h2>
                    <p className="card-text">Địa chỉ giao hàng: {address}</p>
                    <div className="table-scroll table-wrapper" style={{ marginTop: '20px' }}>
                        <table className="table fs-sm text-nowrap table-hover mb-0">
                            <thead>
                                <tr style={{ padding: '20px', color: 'white' }}>
                                    <th style={{ padding: '20px', color: 'white' }}>Tên sản phẩm</th>
                                    <th style={{ padding: '20px', color: 'white' }}>Loại sản phẩm</th>
                                    <th style={{ padding: '20px', color: 'white' }}>Số lượng</th>
                                    <th style={{ padding: '20px', color: 'white' }}>Giá</th>
                                    <th style={{ padding: '20px', color: 'white' }}>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orderDetails.map((item, index) => (
                                    <tr key={index} style={{ padding: '20px' }}>
                                        <td style={{ padding: '20px' }}>{item.ProductName}</td>
                                        <td style={{ padding: '20px' }}>{item.ProductType || 'Chưa xác định'}</td> {/* Cập nhật đúng thuộc tính */}
                                        <td style={{ padding: '20px' }}>{item.Quantity}</td>
                                        <td style={{ padding: '20px' }}>{item.Price} VNĐ</td>
                                        <td style={{ padding: '20px' }}>
                                            <button className="btn btn-info btn-sm">Xem Sản Phẩm</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailPage;
