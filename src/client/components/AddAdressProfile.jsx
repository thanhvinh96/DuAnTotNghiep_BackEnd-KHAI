import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2'; // Nhập SweetAlert2
const AddressInfo = () => {
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [addressData, setAddressData] = useState({
      name: '',
      phone: '',
      addressType: 'Nhà riêng',
      city: '',
      province: '',
      district: '',
      ward: '',
      id_address :'null',
      userId:''
    });
  
    const [dataprovince, setdataprovince] = useState([]);
    const [datadistrict, setdistrict] = useState([]);
    const [dataward, setward] = useState([]);
  
    const handleInputChange = (e) => {
      const { id, value } = e.target;
      setAddressData((prevData) => ({
        ...prevData,
        [id]: value
      }));
    };
  
    const handleRadioChange = (e) => {
      setAddressData((prevData) => ({
        ...prevData,
        addressType: e.target.value
      }));
    };
  
    const handleSaveAddress = () => {
      console.log('Address saved:', addressData);
      fetch('http://localhost:3000/api/address/add',{
        method:'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body:JSON.stringify(addressData)
      }).then(response => response.json())
      .then(data => {
        Swal.fire({
          title: 'Thành Công',
          text: 'Thêm Thành Công!',
          icon: 'success',
          confirmButtonText: 'Đóng',
      })
        console.log(data);
        
      })
      .catch(error => {
        Swal.fire({ // Sử dụng SweetAlert2 để hiển thị thông báo lỗi
          title: 'Thêm Thất Bại',
          text: 'Thêm thất bại! Vui lòng thử lại.',
          icon: 'error',
          confirmButtonText: 'Đóng',
      });   
      });
    //   setIsFormVisible(false); // Ẩn form sau khi lưu
    };
  
    const selectprovince = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/location/province', {
          method: 'GET',
        });
  
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
  
        const json = await response.json();
        const tokenUser = localStorage.getItem('tokenUser');
        const decodedToken = jwtDecode(tokenUser); // Giải mã token
        console.log('giá trị id '+decodedToken.userId)
        setAddressData((prevData) => ({
          ...prevData,
          userId:decodedToken.userId
        }));
        setdataprovince(json);  // Lưu dữ liệu tỉnh/thành phố vào state
      } catch (error) {
        console.error('Error fetching provinces:', error);
      }
    };
  
    const showdatadistrict = async (id) => {
      try {
        const response = await fetch(`http://localhost:3000/api/location/district?id=${id}`, {
          method: 'GET',
        });
  
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
  
        const json = await response.json();
        setdistrict(json);  // Lưu dữ liệu quận/huyện vào state
      } catch (error) {
        console.error('Error fetching districts:', error);
      }
    };
  
    const showdatawards = async (id) => {
      try {
        const response = await fetch(`http://localhost:3000/api/location/wards?id=${id}`, {
          method: 'GET',
        });
  
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
  
        const json = await response.json();
        setward(json);  // Lưu dữ liệu phường/xã vào state
      } catch (error) {
        console.error('Error fetching wards:', error);
      }
    };
  
    const handleClickProvince = (event) => {
      const selectedProvinceId = event.target.value;
      const selectedProvinceText = event.target.options[event.target.selectedIndex]?.text || ""; // Lấy text
    
      showdatadistrict(selectedProvinceId);
      setAddressData((prevData) => ({
        ...prevData,
        province: selectedProvinceId,
        provinceText: selectedProvinceText, // Lưu lại text của tỉnh
        address: `${selectedProvinceText}-${prevData.districtText || ""}/${prevData.wardText || ""}/${prevData.city || ""}` // Cập nhật địa chỉ bằng text
      }));
    };
    const handleDeleteClick = async (id)=>{
        console.log(id);
        try {
            // Gửi request GET đến API để lấy thông tin địa chỉ
            const response = await fetch(`http://localhost:3000/api/address/delete?idAddress=${id}`);
        
            if (!response.ok) {
              throw new Error('Failed to fetch address data');
            }
        
            const data = await response.json();
            console.log(data.status);
            if (data.status === 'true' || data.status === true) {
                Swal.fire({
                    title: 'Thành Công',
                    text: 'Xóa Thành Công!',
                    icon: 'success',
                    confirmButtonText: 'Đóng',
                });
                showDataAddress();
            } else {
                Swal.fire({
                    title: 'Thất Bại',
                    text: 'Xóa Thất Bại!',
                    icon: 'error',
                    confirmButtonText: 'Đóng',
                });
            }
            
        } catch (error) {
            console.error('Error:', error);
          } 
    };
const handleUpdateClick = async (id) => {
  try {
    // Gửi request GET đến API để lấy thông tin địa chỉ
    const response = await fetch(`http://localhost:3000/api/address/getid?idAddress=${id}`);

    if (!response.ok) {
      throw new Error('Failed to fetch address data');
    }

    const data = await response.json();

    // Kiểm tra nếu có dữ liệu trả về
    if (data && data.result) {
        const addressData = data.result[0]; // Lấy phần tử đầu tiên của mảng
        console.log('Address data:', addressData.id_address);

      // Cập nhật state với dữ liệu trả về
      setAddressData({
        name: addressData.name,
        phone:addressData.phone,
        addressType:addressData.addressType,
        city: addressData.address,
        province: addressData.province,
        district: addressData.district,
        ward: addressData.ward,
        id_address:addressData.id_address
      });

      // Đảm bảo rằng form được hiển thị
      setIsFormVisible(true); // Hiển thị form khi có dữ liệu
    } else {
      console.log('No address found');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

    const handleClickDistrict = (event) => {
      const selectedDistrictId = event.target.value;
      const selectedDistrictText = event.target.options[event.target.selectedIndex]?.text || ""; // Lấy text
    
      showdatawards(selectedDistrictId);
      setAddressData((prevData) => ({
        ...prevData,
        district: selectedDistrictId,
        districtText: selectedDistrictText, // Lưu lại text của huyện
        address: `${prevData.provinceText || ""}/${selectedDistrictText}/${prevData.wardText || ""}/${prevData.city || ""}` // Cập nhật địa chỉ bằng text
      }));
    };
    
    const handleClickWard = (event) => {
      const selectedWardId = event.target.value;
      const selectedWardText = event.target.options[event.target.selectedIndex]?.text || ""; // Lấy text
    
      setAddressData((prevData) => ({
        ...prevData,
        ward: selectedWardId,
        wardText: selectedWardText, // Lưu lại text của xã
        address: `${prevData.provinceText || ""}/${prevData.districtText || ""}/${selectedWardText}/${prevData.city || ""}` // Cập nhật địa chỉ bằng text
      }));
    };
    const[dataAdress,setdataAdress] = useState([]);
  
    const showDataAddress = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/address');
        
        // Kiểm tra nếu phản hồi thành công
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
    
        // Chuyển đổi dữ liệu nhận được thành JSON
        const data = await response.json();
        setdataAdress(data);
        // Hiển thị dữ liệu (ví dụ: in ra console)
        console.log(dataAdress);
    
        // Xử lý dữ liệu tùy thuộc vào logic ứng dụng của bạn
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
      }
    };
  
    useEffect(() => {
      selectprovince();
   
      showDataAddress();

    }, []);
  
    return (
      <div className="account-card">
        <div className="account-title">
          <p>Địa Chỉ Nhận Hàng</p>
          <button
            onClick={() => setIsFormVisible(!isFormVisible)}
            style={{ color: 'white' ,backgroundColor:'green' }}
          >
            {isFormVisible ? 'Hủy' : 'Thêm địa chỉ'}
          </button>
        </div>
        <div className="account-content">
          {isFormVisible ? (
            <form>
              <div className="col-sm-12 col-md-6 col-lg-12">
                <div className="form-group">
                  <label htmlFor="name" className="col-form-label">Họ Và Tên<span>*</span></label>
                  <div className="field_DH1C">
                    <input
                      id="name"
                      type="text"
                      placeholder="Họ Và Tên"
                      maxLength="30"
                      className="form-control"
                      value={addressData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
  
                <div className="form-group">
                  <label htmlFor="address" className="col-form-label">Địa chỉ <span>*</span></label>
                  <div className="field_DH1C">
                    <input
                      id="city"
                      type="text"
                      placeholder="Địa chỉ"
                      maxLength="256"
                      className="form-control"
                      value={addressData.city}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
  
                <div className="form-group">
                  <label htmlFor="province" className="col-form-label">Tỉnh/Thành <span>*</span></label>
                  <div className="field_DH1C">
                    <select id="province" className="form-control" onChange={handleClickProvince}>
                      <option value="-1">--Chọn Tỉnh/Thành--</option>
                      {dataprovince.map((province, index) => (
                        <option key={index} value={province.province_id}>
                          {province.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
  
                <div className="form-group">
                  <label htmlFor="district" className="col-form-label">Quận/Huyện <span>*</span></label>
                  <div className="field_DH1C">
                    <select id="district" className="form-control" onChange={handleClickDistrict}>
                      <option value="-1">--Chọn Quận/Huyện--</option>
                      {datadistrict.map((district, index) => (
                        <option key={index} value={district.district_id}>
                          {district.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
  
                <div className="form-group">
                  <label htmlFor="ward" className="col-form-label">Phường/Xã <span>*</span></label>
                  <div className="field_DH1C">
                    <select id="ward" className="form-control" onChange={handleClickWard}>
                      <option value="-1">--Chọn Phường/Xã--</option>
                      {dataward.map((ward, index) => (
                        <option key={index} value={ward.wards_id}>
                          {ward.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
  
                <div className="form-group">
                  <label htmlFor="phone" className="col-form-label">Số điện thoại <span>*</span></label>
                  <div className="field_DH1C">
                    <input
                      id="phone"
                      type="text"
                      placeholder="Số điện thoại"
                      maxLength="10"
                      className="form-control"
                      value={addressData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
  
                <div className="form-group">
                  <label htmlFor="type" className="col-form-label">Loại địa chỉ</label>
                  <div className="field_DH1C">
                    <div className="form-check form-check-inline">
                      <input
                        type="radio"
                        name="type"
                        className="cus-radio"
                        id="home-radio"
                        value="Nhà riêng"
                        checked={addressData.addressType === 'Nhà riêng'}
                        onChange={handleRadioChange}
                      />
                      <label className="form-check-label" htmlFor="home-radio">Nhà riêng</label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        type="radio"
                        name="type"
                        className="cus-radio"
                        id="company-radio"
                        value="Công ty"
                        checked={addressData.addressType === 'Công ty'}
                        onChange={handleRadioChange}
                      />
                      <label className="form-check-label" htmlFor="company-radio">Công ty</label>
                    </div>
                  </div>
                </div>
  
                <button type="button" className="form-btn" style={{ color: 'white' }} onClick={handleSaveAddress}>
                  Lưu địa chỉ
                </button>
              </div>
            </form>
          ) : (
            <div className="table-responsive">
    <table className="table table-bordered" >
    <thead>
    <tr style={{ color: 'white' }}>
    <th style={{ padding: '20px',color: 'white',backgroundColor:'green' }}>Họ và Tên</th>
    <th style={{ padding: '20px',color: 'white',backgroundColor:'green' }}>Địa chỉ</th>
    <th style={{ padding: '20px',color: 'white',backgroundColor:'green' }}>Số điện thoại</th>
    <th style={{ padding: '20px',color: 'white',backgroundColor:'green' }}>Loại địa chỉ</th>
    <th style={{ padding: '20px',color: 'white',backgroundColor:'green' }}>Hành Động</th>
  </tr>
  
              </thead>
              <tbody>
              {dataAdress.map((item, index) => {
    return (
      <tr key={index}>
        <td>{item.name}</td>
        <td>{item.address}</td>
        <td>{item.phone}</td>
        <td>{item.addressType}</td>
        <td>
          <button type="button" class="btn btn-primary"             onClick={() => handleUpdateClick (item.id_address)}
          >Cập Nhật</button>
          <button type="button" class="btn btn-danger" onClick={() => handleDeleteClick (item.id_address)}>Xóa</button>
  
  
        </td>
  
      </tr>
    );
  })}
  
              </tbody>
            </table>   
            </div>
         
          )}
        </div>
      </div>
    );
  };
  export default AddressInfo;
