import { useEffect, useState } from "react";
import axios from "axios";
import AddressService from "../../API/AddressService";

const AddressModal = ({ onSuccess,setShowAddressModal }) => {
  const [newAddress, setNewAddress] = useState({
    fullName: "",
    phoneNumber: "",
    province: "",
    ward: "",
    address: "",
    isDefault: false,
  });
  const [addressErrors, setAddressErrors] = useState({});

  const [provinceList, setProvinceList] = useState([]);
  const [wardList, setWardList] = useState([]);

  const [provinceSuggestions, setProvinceSuggestions] = useState([]);
  const [wardSuggestions, setWardSuggestions] = useState([]);

  // Load tỉnh/thành từ API
  useEffect(() => {
    axios
      .get("https://34tinhthanh.com/api/provinces")
      .then((res) => setProvinceList(res.data))
      .catch((err) => console.log(err));
  }, []);

  // Khi chọn tỉnh → load danh sách phường/xã
  const loadWards = (provinceCode) => {
    axios
      .get(`https://34tinhthanh.com/api/wards?province_code=${provinceCode}`)
      .then((res) => {
        console.log("WARD API:", res.data);
        setWardList(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => console.log(err));
  };

  // Autocomplete tỉnh/thành
  const handleProvinceInput = (value) => {
    setNewAddress({ ...newAddress, province: value });

    if (!value.trim()) return setProvinceSuggestions([]);

    const filtered = provinceList.filter((p) =>
      p.name.toLowerCase().includes(value.toLowerCase())
    );

    setProvinceSuggestions(filtered);
  };

  const selectProvince = (province) => {
    setNewAddress({
      ...newAddress,
      province: province.name,
      ward: "",
    });

    setProvinceSuggestions([]);
    console.log(province);
    loadWards(province.province_code);
  };

  // Autocomplete phường/xã
  const handleWardInput = (value) => {
    setNewAddress({ ...newAddress, ward: value });

    if (!value.trim() || !Array.isArray(wardList)) {
      return setWardSuggestions([]);
    }

    const filtered = wardList.filter((w) =>
      w.ward_name.toLowerCase().includes(value.toLowerCase())
    );

    setWardSuggestions(filtered);
  };

  const selectWard = (ward) => {
    setNewAddress({ ...newAddress, ward: ward.ward_name });
    setWardSuggestions([]);
  };
  const validateAddressForm = () => {
    const errors = {};
    
    if (!newAddress.fullName.trim()) {
      errors.fullName = "Vui lòng nhập tên người nhận";
    } else if (newAddress.fullName.trim().length < 2) {
      errors.fullName = "Tên phải có ít nhất 2 ký tự";
    }

    if (!newAddress.phoneNumber.trim()) {
      errors.phoneNumber = "Vui lòng nhập số điện thoại";
    } else if (!/^0\d{9}$/.test(newAddress.phoneNumber)) {
      errors.phoneNumber = "Số điện thoại phải bắt đầu bằng 0 và có đúng 10 số";
    }

    if (!newAddress.province) {
      errors.province = "Vui lòng chọn Tỉnh/Thành phố";
    }

    if (!newAddress.ward) {
      errors.ward = "Vui lòng chọn Phường/Xã";
    }

    if (!newAddress.address.trim()) {
      errors.address = "Vui lòng nhập địa chỉ nhà";
    }

    setAddressErrors(errors);
    return Object.keys(errors).length === 0;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 relative">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Thêm địa chỉ mới</h2>

        {/* Họ tên */}
        <label className="block font-medium text-gray-700">Họ tên</label>
        <input
          type="text"
          className="w-full border rounded-lg px-3 py-2 mt-1 mb-3"
          value={newAddress.fullName}
          onChange={(e) =>
            setNewAddress({ ...newAddress, fullName: e.target.value })
          }
        />
        {addressErrors.fullName && (
        <p className="text-red-500 text-sm mt-1">{addressErrors.fullName}</p>
        )}

        {/* Số điện thoại */}
        <label className="block font-medium text-gray-700">Số điện thoại</label>
        <input
          type="text"
          className="w-full border rounded-lg px-3 py-2 mt-1 mb-3"
          value={newAddress.phoneNumber}
          onChange={(e) =>
            setNewAddress({ ...newAddress, phoneNumber: e.target.value })
          }
        />
        {addressErrors.phoneNumber && (
        <p className="text-red-500 text-sm mt-1">{addressErrors.phoneNumber}</p>
        )}

        {/* Tỉnh / Thành phố */}
        <label className="block font-medium text-gray-700">Tỉnh / Thành phố</label>
        <input
          type="text"
          placeholder="Nhập tỉnh..."
          className="w-full border rounded-lg px-3 py-2 mt-1"
          value={newAddress.province}
          onChange={(e) => handleProvinceInput(e.target.value)}
        />
        {addressErrors.province && (
        <p className="text-red-500 text-sm mt-1">{addressErrors.province}</p>
        )}

        {provinceSuggestions.length > 0 && (
          <div className="border rounded-lg bg-white mt-1 max-h-48 overflow-y-auto shadow">
            {provinceSuggestions.map((item) => (
              <div
                key={item.code}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => selectProvince(item)}
              >
                {item.name}
              </div>
            ))}
          </div>
        )}

        {/* Phường / Xã */}
        <label className="block font-medium text-gray-700 mt-3">Phường / Xã</label>
        <input
          type="text"
          placeholder="Nhập phường/xã..."
          className="w-full border rounded-lg px-3 py-2 mt-1"
          value={newAddress.ward}
          onChange={(e) => handleWardInput(e.target.value)}
        />
        {addressErrors.ward && (
        <p className="text-red-500 text-sm mt-1">{addressErrors.ward}</p>
        )}
        

        {wardSuggestions.length > 0 && (
          <div className="border rounded-lg bg-white mt-1 max-h-48 overflow-y-auto shadow">
            {wardSuggestions.map((item) => (
              <div
                key={item.code}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => selectWard(item)}
              >
                {item.ward_name}
              </div>
            ))}
          </div>
        )}

        {/* Địa chỉ chi tiết */}
        <label className="block font-medium text-gray-700 mt-3">Địa chỉ chi tiết</label>
        <input
          type="text"
          className="w-full border rounded-lg px-3 py-2 mt-1 mb-3"
          value={newAddress.address}
          onChange={(e) =>
            setNewAddress({ ...newAddress, address: e.target.value })
          }
        />
        {addressErrors.address && (
        <p className="text-red-500 text-sm mt-1">{addressErrors.address}</p>
        )}

        {/* Checkbox mặc định */}
        <label className="flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            checked={newAddress.isDefault}
            onChange={(e) =>
              setNewAddress({ ...newAddress, isDefault: e.target.checked })
            }
          />
          <span className="text-gray-700">Đặt địa chỉ làm mặc định</span>
        </label>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            className="px-4 py-2 bg-gray-300 rounded-lg"
            onClick={() => setShowAddressModal(false)}
          >
            Hủy
          </button>

          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            onClick={async() => {
              if(!validateAddressForm()){
                return;
              }
              console.log("Saved:", newAddress);
              const response = await AddressService.createAddresses({"receiver":newAddress.fullName,
                "phone":newAddress.phoneNumber,
                "address":"Tỉnh "+newAddress.province+","+ newAddress.ward+","+ newAddress.address,
                "isDefault": newAddress.isDefault});
              onSuccess(response.result);
              // response.result.isDefault ? set
              setShowAddressModal(false);
            }}
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddressModal;
