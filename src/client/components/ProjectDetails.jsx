import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2'; // Nhập SweetAlert2
import AddressInfo from './AddAdressProfile';
import HistoryBuy from './HistoryBuy';
import OrderDetailPage from './OrderDetailPage.jsx';
import {UserService} from '../../services/UserService.ts';
import { useNavigate ,useLocation} from 'react-router-dom'; // Import useNavigate thay vì useHistory

// Dummy components for different pages
const handleLogout = () => {
  // Xóa token từ localStorage
  localStorage.removeItem('tokenUser');

  // Hoặc xóa tất cả các mục trong localStorage (nếu cần)
  // localStorage.clear();

  // Điều hướng về trang đăng nhập hoặc trang chủ
  window.location.href = "/login";
};

const ProfileInfo = () => {
  const [userData, setUserData] = useState(null);
  const [postdata, setPostdata] = useState({
    email: '',
    tokenuser: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate(); // Khởi tạo useNavigate

  const tokenUser = localStorage.getItem('tokenUser');

  // Handle logout
  const handleLogout = () => {
    localStorage.clear();  // Xóa toàn bộ dữ liệu trong localStorage
    window.location.reload();  // Hoặc chuyển hướng tới trang đăng nhập
};


  const getInfo = () => {
    setLoading(true); // Set loading to true before making API call
    fetch('http://localhost:3000/api/user/checkdatauser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postdata),
    })
      .then(response => response.json())
      .then(data => {
        console.log(data.user.Role);
        if (data.status === true) {
          console.log(data.user.UserID);
          setEditData({ ...editData, UserID : data.user.UserID })
          setUserData(data.user); // Lưu dữ liệu người dùng vào state
        }
        setLoading(false); // Set loading to false after data is fetched
      })
      .catch(error => {
        console.error('Error:', error);
        setError('Đã xảy ra lỗi, vui lòng thử lại sau.');
        setLoading(false); // Set loading to false in case of error
      });
  };

  useEffect(() => {
    if (tokenUser) {
      const decodedToken = jwtDecode(tokenUser); // Giải mã token
      setPostdata({
        email: decodedToken['email'],
        tokenuser: decodedToken['tokenuser']
      });
    }
  }, [tokenUser]);

  useEffect(() => {
    if (postdata.email && postdata.tokenuser) {
      getInfo();
    }
  }, [postdata]);

  const handleAdminRedirect = () => {
    navigate('/admin'); // Chuyển hướng đến trang admin
  };
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({});
  
  const handleEdit = () => {
    setEditData({
      Username: userData?.Username || "",
      Email: userData?.Email || "",
      PhoneNumber: userData?.PhoneNumber || "",
      UserID : userData?.UserID  || "",
      Password: "",
    });
    setShowEditModal(true);
  };
  
  const handleCloseModal = () => {
    setShowEditModal(false);
  };
  
  const handleUpdate = async (e) => {
    e.preventDefault(); // Chỉ gọi preventDefault mà không cần tham số
    console.log(editData);

    try {
        const res = await UserService.updateUsers(editData); // Sử dụng await để lấy kết quả từ Promise
        console.log(res);

        // Kiểm tra trạng thái thành công
        Swal.fire({
            title: 'Thành công!',
            text: 'Người dùng đã được cập nhật thành công!',
            icon: 'success',
            confirmButtonText: 'OK'
        });
    } catch (error) {
        // Nếu có lỗi trong quá trình cập nhật
        Swal.fire({
            title: 'Thất bại!',
            text: 'Người dùng đã được cập nhật thất bại! ' + error.message,
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }

    // Đóng modal sau khi xử lý xong
    setShowEditModal(false);
};

  return (
    <div className="account-card">
      <div className="account-title">
        <p>Hồ sơ của bạn</p>
      </div>
      <div className="account-content">
        <div className="row">
          <div className="col-md-6 col-lg-12">
            <div className="form-group">
              <label className="form-label">Họ Và Tên</label>
              <input
                type="text"
                className="form-control"
                value={userData?.Username || (loading ? "Đang tải..." : "Không có dữ liệu")}
                readOnly
              />
            </div>
          </div>
          <div className="col-md-6 col-lg-12">
            <div className="form-group">
              <label className="form-label">Địa chỉ Email</label>
              <input
                type="email"
                className="form-control"
                value={userData?.Email || (loading ? "Đang tải..." : "Không có dữ liệu")}
                readOnly
              />
            </div>
          </div>
          <div className="col-md-6 col-lg-12">
            <div className="form-group">
              <label className="form-label">Số điện thoại</label>
              <input
                type="text"
                className="form-control"
                value={userData?.PhoneNumber || (loading ? "Đang tải..." : "Không có dữ liệu")}
                readOnly
              />
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-between">
  <div className="btn-spacing">
    <button className="btn btn-danger" onClick={handleLogout}>
      Đăng xuất
    </button>
  </div>
  <div className="btn-spacing">
    <button className="btn btn-warning" onClick={handleEdit}>
      Chỉnh sửa thông tin
    </button>
  </div>

  {/* Nút điều hướng đến trang quản trị nếu là Admin */}
  {userData?.Role === 'Admin' && (
    <div className="btn-spacing">
      <button className="btn btn-primary" onClick={handleAdminRedirect}>
        Đi đến trang quản trị
      </button>
    </div>
  )}
</div>



      </div>
      <div className={`modal fade ${showEditModal ? 'show' : ''}`} style={{ display: showEditModal ? 'block' : 'none' }} tabIndex="-1">
    <div className="modal-dialog modal-dialog-centered"> {/* Thêm lớp để căn giữa modal */}
        <div className="modal-content">
        <div className="modal-header" style={{ background: '#E15E00' }}>
    <p className="modal-title" >Chỉnh sửa thông tin</p>
    <button type="button" className="btn-close" onClick={handleCloseModal}></button>
</div>

            <div className="modal-body">
                <form onSubmit={handleUpdate}>
                    <div className="mb-3">
                        <label className="form-label">Họ Và Tên</label>
                        <input
                            type="text"
                            className="form-control"
                            value={editData.Username}
                            onChange={(e) => setEditData({ ...editData, Username: e.target.value })}
                            required // Đánh dấu trường này là bắt buộc
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Địa chỉ Email</label>
                        <input
                            type="email"
                            className="form-control"
                            value={editData.Email}
                            onChange={(e) => setEditData({ ...editData, Email: e.target.value })}
                            required // Đánh dấu trường này là bắt buộc
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Mật Khẩu</label>
                        <input
                            type="Password"
                            className="form-control"
                            // value={editData.Password}
                            onChange={(e) => setEditData({ ...editData, Password: e.target.value })}
                            required // Đánh dấu trường này là bắt buộc
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Số điện thoại</label>
                        <input
                            type="text"
                            className="form-control"
                            value={editData.PhoneNumber}
                            onChange={(e) => setEditData({ ...editData, PhoneNumber: e.target.value })}
                            required // Đánh dấu trường này là bắt buộc
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Cập nhật</button>
                </form>
            </div>
        </div>
    </div>
</div>


      {/* Nền tối khi mở modal */}
      {showEditModal && <div className="modal-backdrop fade show"></div>}
    </div>
    
  );
};


const SecuritySettings = () => (
  <div className="account-card">
    <div className="account-title">
      <p>Cài Đặt Bảo Mật</p>
    </div>
    <div className="account-content">
      {/* Add your security settings here */}
      <p>Thông tin bảo mật sẽ hiển thị tại đây.</p>
    </div>
  </div>
);

const Profile = () => {
  const location = useLocation();

  // State for modal visibility, form data, and active component
  const [activeComponent, setActiveComponent] = useState('profile');
  // const tokenUser = localStorage.getItem('tokenUser'); // Lấy token từ localStorage
  // const [userData, setUserData] = useState(null);
  // const [postdata, setPostdata] = useState({
  //   email: '',
  //   tokenuser: ''
  // });

  // const getInfo = () => {
  //   fetch('http://localhost:3000/api/user/checkdatauser', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(postdata),
  //   })
  //     .then(response => response.json())
  //     .then(data => {

  //       console.log(data.user);
  //       if (data.status === true) {
  //         setUserData(data.user); // Lưu dữ liệu người dùng vào state
  //       }
  //     })
  //     .catch(error => console.error('Error:', error));
  // };

  useEffect(() => {
    // Lấy giá trị query params từ URL
    const params = new URLSearchParams(location.search);
    const model = params.get('model');

    // Nếu model = 'orderdetail', cập nhật activeComponent
    if (model === 'orderdetail') {
      setActiveComponent('orderdetail'); // Hoặc một component nào đó mà bạn muốn render
    }
  }, [location.search]); // Phụ thuộc vào location.search để cập nhật khi URL thay đổi

  // Function to render the active component
  const renderComponent = () => {
    switch (activeComponent) {
      case 'profile':
        return <ProfileInfo />;
      case 'address':
        return <AddressInfo />;
      case 'security':
        return <SecuritySettings />;
      case 'historybuy':
        return <HistoryBuy />;
      case 'orderdetail':
          return <OrderDetailPage />;
      default:
        return <ProfileInfo />;
    }
  };

  return (
    <section className="py-5 inner-section profile-part">
      <div className="container">
        <div className="row">
          {/* Sidebar */}
          <div className="col-lg-3">
            <div className="profile-sidebar">
              <a
                className={`sidebar_profile ${activeComponent === 'profile' ? 'active' : ''}`}
                href="#"
                onClick={() => setActiveComponent('profile')}
              >
                <p><i className="fas fa-user"></i> <span>Thông tin cá nhân</span></p>
              </a>
              <a
                className={`sidebar_profile ${activeComponent === 'address' ? 'active' : ''}`}
                href="#"
                onClick={() => setActiveComponent('address')}
              >
                <p><i className="fa-solid fa-wallet"></i> <span>Địa Chỉ Nhận Hàng</span></p>
              </a>
             

              <a
                className={`sidebar_profile ${activeComponent === 'security' ? 'active' : ''}`}
                href="#"
                onClick={() => setActiveComponent('historybuy')}
              >
                <p><i className="fa-solid fa-shield-halved"></i> <span>Lịch Sứ Mua Hàng</span></p>
              </a>
            </div>
          </div>
  
          {/* Main Content */}
          <div className="col-lg-9">
            <div className="profile-content">
              {renderComponent()} {/* Renders the active component */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;
