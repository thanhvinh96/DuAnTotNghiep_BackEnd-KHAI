import React from 'react';

export default function HistoryBuy() {
  const orderHistory = [
    {
      orderDate: '2024-09-01',
      totalAmount: 150.00,
      status: 'Đã giao',
      paymentStatus: 'Đã thanh toán',
      voucherId: 'V12345',
      totalDiscount: 10.00,
      codeOrder: 'CO123456',
      timeBuy: '14:30'
    },
    {
      orderDate: '2024-09-05',
      totalAmount: 200.00,
      status: 'Đang giao',
      paymentStatus: 'Chưa thanh toán',
      voucherId: 'V12346',
      totalDiscount: 20.00,
      codeOrder: 'CO123457',
      timeBuy: '10:15'
    },
    // Thêm các đơn hàng khác nếu cần
  ];

  return (
    <div className="account-card container mt-4">
      <p className="account-title text-center">Lịch sử mua hàng</p>
      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead className="thead-light">
            <tr>
              <th>Ngày đặt hàng</th>
              <th>Tổng số tiền</th>
              <th>Trạng thái</th>
              <th>Trạng thái thanh toán</th>
              <th>Mã voucher</th>
              <th>Tổng giảm giá</th>
              <th>Mã đơn hàng</th>
              <th>Thời gian mua</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {orderHistory.map((order, index) => (
              <tr key={index}>
                <td>{order.orderDate}</td>
                <td>{order.totalAmount.toFixed(2)} VNĐ</td>
                <td>{order.status}</td>
                <td>{order.paymentStatus}</td>
                <td>{order.voucherId}</td>
                <td>{order.totalDiscount.toFixed(2)} VNĐ</td>
                <td>{order.codeOrder}</td>
                <td>{order.timeBuy}</td>
                <td>
                  <button className="btn btn-primary" onClick={() => alert(`Xem chi tiết đơn hàng: ${order.codeOrder}`)}>Xem chi tiết</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
