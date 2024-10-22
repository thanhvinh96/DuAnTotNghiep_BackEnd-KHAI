import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { OrderService } from '../../services/OrderService.ts';

const formatCurrency = (amount) => {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + 'đ';
};

const formatDateToVN = (dateString) => {
  const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZone: 'Asia/Ho_Chi_Minh' };
  return new Date(dateString).toLocaleString('vi-VN', options);
};

const SearchForm = ({ onSubmit, clearFilters, formData, handleChange }) => {
  const renderInputField = (field) => (
    <input
      type={field === 'OrderDate' ? 'date' : 'text'}
      className="form-control mb-2"
      name={field}
      placeholder={field === 'codeorder' ? 'Mã đơn hàng' : 'Chọn ngày đặt hàng'}
      value={formData[field]}
      onChange={handleChange}
    />
  );

  const renderSelectField = (field) => (
    <select
      name={field}
      value={formData[field]}
      onChange={handleChange}
      className="form-select mb-2"
    >
      <option value="">{field === 'Status' ? 'Tất cả trạng thái' : 'Tất cả trạng thái thanh toán'}</option>
      {field === 'Status' ? (
        <>
          <option value="completed">Hoàn thành</option>
          <option value="pending">Đang chờ</option>
          <option value="canceled">Đã hủy</option>
        </>
      ) : (
        <>
          <option value="paid">Đã thanh toán</option>
          <option value="unpaid">Chưa thanh toán</option>
        </>
      )}
    </select>
  );

  return (
    <form onSubmit={onSubmit}>
      <div className="row">
        {['codeorder', 'OrderDate', 'Status', 'PaymentStatus'].map((field, index) => (
          <div className="col-lg col-md-4 col-6" key={index}>
            {field === 'Status' || field === 'PaymentStatus'
              ? renderSelectField(field)
              : renderInputField(field)}
          </div>
        ))}
        <div className="col-lg col-md-4 col-6">
          <button className="shop-widget-btn mb-2" type="submit">
            <i className="fas fa-search"></i><span>Tìm kiếm</span>
          </button>
        </div>
      </div>
    </form>
  );
};

const OrderTable = ({ orders, onViewDetails }) => (
  <div className="table-scroll table-wrapper" style={{ marginTop: '20px' }}>
    <table className="table fs-sm text-nowrap table-hover mb-0">
      <thead>
        <tr style={{ padding: '20px', color: 'white' }}>
          {['Mã đơn hàng', 'Thời gian', 'Tổng tiền', 'Trạng thái', 'Trạng thái thanh toán', 'Hành động'].map((header, index) => (
            <th key={index} className="text-center" style={{ padding: '20px', color: 'white' }}>
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {orders.length > 0 ? orders.map((order, index) => (
          <tr key={index} style={{ padding: '20px' }}>
            <td className="text-center" style={{ padding: '20px' }}>{order.codeorder}</td>
            <td className="text-center" style={{ padding: '20px' }}>{formatDateToVN(order.OrderDate)}</td>
            <td className="text-right" style={{ padding: '20px' }}>{formatCurrency(order.TotalAmount)}</td>
            <td className="text-center" style={{ padding: '20px' }}>{order.Status}</td>
            <td className="text-right" style={{ padding: '20px' }}>{order.PaymentStatus}</td>
            <td className="text-center" style={{ padding: '20px' }}>
              <button className="btn btn-info btn-sm" onClick={() => onViewDetails(order)} style={{ padding: '20px' }}>
                Xem chi tiết
              </button>
            </td>
          </tr>
        )) : (
          <tr>
            <td colSpan="6" className="text-center">Không có đơn hàng nào</td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

export default function HistoryBuy() {
  const [formData, setFormData] = useState({
    codeorder: '',
    OrderDate: '',
    limit: '10',
    Status: '',
    PaymentStatus: '',
    voucherId: '',
  });

  const [orders, setOrders] = useState([]);
  const [postdata, setPostdata] = useState({});

  const tokenUser = localStorage.getItem('tokenUser');

  useEffect(() => {
    if (tokenUser) {
      const decodedToken = jwtDecode(tokenUser);
      setPostdata({ userId: decodedToken['userId'] });
    }
  }, [tokenUser]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (postdata.userId) {
        try {
          const res = await OrderService.getOrdersByUserId(postdata);
          setOrders(res);
        } catch (error) {
          console.error('Error fetching orders:', error);
        }
      }
    };
    fetchOrders();
  }, [postdata]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await OrderService.searchorder(formData);
      console.log(res);
      setOrders(res); // Cập nhật orders với dữ liệu tìm kiếm
    } catch (error) {
      console.error('Error searching orders:', error);
    }
  };

  const handleClearFilters = () => {
    setFormData({
      codeorder: '',
      OrderDate: '',
      limit: '1',
      Status: '',
      PaymentStatus: '',
      voucherId: '',
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleViewDetails = (order) => {
    const orderID = order.OrderID; // Lấy OrderID từ đối tượng đơn hàng
    const newUrl = `http://localhost:3001/profile?model=orderdetail&id=${orderID}&codeorder=${order.codeorder}&address=${encodeURIComponent(order.address)}`; 
    // Thêm codeorder và address vào đường dẫn, sử dụng encodeURIComponent để đảm bảo địa chỉ được mã hóa đúng
    window.location.href = newUrl; // Chuyển hướng đến đường dẫn mới
  };
  
  return (
    <div className="account-card" style={{ padding: '20px' }}>
      <SearchForm
        onSubmit={handleSubmit}
        clearFilters={handleClearFilters}
        formData={formData}
        handleChange={handleChange}
      />
      <OrderTable orders={orders} onViewDetails={handleViewDetails} />
      <div className="bottom-paginate">
        <p className="page-info">Showing {orders.length} Results</p>
        <div className="pagination">
          {/* Add pagination logic here */}
        </div>
      </div>
    </div>
  );
}
