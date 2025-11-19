import React, { useState, useEffect, useContext } from "react";
import { Lock, CreditCard, DollarSign, MapPin, Plus, Edit, Ticket } from "lucide-react";
import { FavoriteContext } from "../contexts/FavoriteContext";
import AddressModal from "../components/address/AddressModal";
import AddressService from "../API/AddressService";
import DiscountService from "../API/DiscountService";

const CheckoutPage = () => {
  const [checkoutItems, setCheckoutItems] = useState([]);
  useEffect(() => {
    const data = sessionStorage.getItem("checkoutItems");
    if (data) {
      setCheckoutItems(JSON.parse(data));
    }
  }, []);
  console.log(checkoutItems);

  const [selectedAddress, setSelectedAddress] = useState({});

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showAddressListModal, setShowAddressListModal] = useState(false);
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [voucherCode, setVoucherCode] = useState("");
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [savedAddresses ,setSavedAddresses] = useState([]);
  const [availableVouchers,setAvailableVouchers] = useState([]);
  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
    setShowAddressListModal(false);
  };
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await AddressService.getAllAddresses();
        const list = res.data.result; 
        // Nếu backend trả về dữ liệu nằm trong res.data
        setSavedAddresses(list);
        const defaultAddress = list.find(addr => addr.isDefault === true);
        console.log(defaultAddress);
        if (defaultAddress) {
          setSelectedAddress(defaultAddress);
        }
      } catch (error) {
        console.error("Lỗi khi load địa chỉ:", error);
      }
    };
    const fetchDiscounts = async () => {
      try {
        const res = await DiscountService.getAllDiscounts();
        const list = res.result; 
        setAvailableVouchers(list);
        console.log(list);
      } catch (error) {
        console.error("Lỗi khi load mã giảm giá:", error);
      }
    };

  fetchAddresses();
  fetchDiscounts();
  },[]);
  

  

  // Danh sách voucher mẫu
  

  const subtotal = checkoutItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = 15000;
  const tax = subtotal * 0.1;
  const discount = selectedVoucher
  ? selectedVoucher.discountType === "PERCENTAGE"
    ? (subtotal * selectedVoucher.discountValue)
    : selectedVoucher.discountValue
  : 0;

  const total = subtotal + shipping + tax - discount;

  const handleApplyVoucher = () => {
    const voucher = availableVouchers.find(v => v.code === voucherCode.toUpperCase());
    if (voucher) {
      setSelectedVoucher(voucher);
      alert("Áp dụng voucher thành công!");
    } else {
      alert("Mã voucher không hợp lệ!");
    }
  };

  const handleSubmit = async () => {
    if (!paymentMethod) {
      alert("Vui lòng chọn phương thức thanh toán!");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowSuccess(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Thanh toán</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Products & Address */}
          <div className="lg:col-span-2 space-y-6">
            {/* Products List */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">Sản phẩm ({checkoutItems.length})</h2>
              <div className="space-y-4">
                {checkoutItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 pb-4 border-b last:border-b-0">
                    <img
                      src={item.product.images?.[0]?.imageUrl || item.product.product.primaryImage.imageUrl}
                      alt={item.product.product.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.product.product.name}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <p className="text-sm text-gray-500">
                          Size: <span className="font-medium text-gray-700">{item.product.size.name}</span>
                        </p>
                        <span className="text-gray-300">|</span>
                        <p className="text-sm text-gray-500">
                          Màu: <span className="font-medium text-gray-700">{item.product.color.name}</span>
                        </p>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Số lượng: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-gray-900">
                      {(item.product.price * item.quantity).toLocaleString('vi-VN')}₫
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Address Information */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">Thông tin giao hàng</h2>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="flex items-start gap-3">
                  <MapPin className="text-red-500 mt-1" size={20} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold">{selectedAddress.receiver}</span>
                      <span className="text-gray-600">|</span>
                      <span className="text-gray-600">{selectedAddress.phone}</span>
                    </div>
                    <p className="text-gray-700 text-sm">
                      {/* {selectedAddress.address}, {selectedAddress.ward}, {selectedAddress.district}, {selectedAddress.province} */}
                      {selectedAddress.address}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setShowAddressModal(true)}
                  className="flex items-center justify-center gap-2 py-2 px-4 border-2 border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition"
                >
                  <Plus size={18} />
                  Thêm địa chỉ mới
                </button>
                <button
                  onClick={() => setShowAddressListModal(true)}
                  className="flex items-center justify-center gap-2 py-2 px-4 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  <Edit size={18} />
                  Chọn địa chỉ
                </button>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">Phương thức thanh toán</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <DollarSign className="text-green-500" size={24} />
                  <span className="font-medium">Thanh toán khi nhận hàng (COD)</span>
                </label>

                <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                  <input
                    type="radio"
                    name="payment"
                    value="vnpay"
                    checked={paymentMethod === "vnpay"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <CreditCard className="text-blue-500" size={24} />
                  <span className="font-medium">Thanh toán VNPay</span>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column - Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow sticky top-4">
              {/* Voucher Section */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Mã giảm giá</h3>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Nhập mã voucher"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleApplyVoucher}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                  >
                    Áp dụng
                  </button>
                </div>
                <button
                  onClick={() => setShowVoucherModal(true)}
                  className="text-blue-500 text-sm flex items-center gap-1 hover:underline"
                >
                  <Ticket size={16} />
                  Chọn mã giảm giá
                </button>
                {selectedVoucher && (
                  <div className="mt-2 p-2 bg-green-50 text-green-700 text-sm rounded">
                    ✓ Đã áp dụng: {selectedVoucher.description}
                  </div>
                )}
              </div>

              {/* Order Summary */}
              <div className="border-t pt-4 space-y-3">
                <h3 className="font-semibold text-lg mb-3">Chi tiết thanh toán</h3>
                
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính</span>
                  <span>{subtotal.toLocaleString('vi-VN')}₫</span>
                </div>
                
                <div className="flex justify-between text-gray-600">
                  <span>Phí vận chuyển</span>
                  <span>{shipping.toLocaleString('vi-VN')}₫</span>
                </div>
                
                <div className="flex justify-between text-gray-600">
                  <span>Thuế VAT (10%)</span>
                  <span>{tax.toLocaleString('vi-VN')}₫</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Giảm giá</span>
                    <span>-{discount.toLocaleString('vi-VN')}₫</span>
                  </div>
                )}
                
                <div className="border-t pt-3 flex justify-between text-lg font-bold">
                  <span>Tổng cộng</span>
                  <span className="text-red-600">{total.toLocaleString('vi-VN')}₫</span>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full mt-6 bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Đang xử lý..." : "Đặt hàng"}
              </button>

              <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-500">
                <Lock size={16} />
                <span>Thanh toán an toàn & bảo mật</span>
              </div>
            </div>
          </div>
        </div>
        {/* Address List Modal */}
        {showAddressListModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6 border-b">
                <h3 className="text-xl font-bold">Chọn địa chỉ giao hàng</h3>
              </div>
              <div className="p-6 space-y-3">
                {savedAddresses.map((address) => (
                  <div
                    key={address.id}
                    onClick={() => handleSelectAddress(address)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                      selectedAddress.id === address.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{address.receiver}</span>
                        <span className="text-gray-600">|</span>
                        <span className="text-gray-600">{address.phone}</span>
                      </div>
                      {address.isDefault && (
                        <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">Mặc định</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-700">
                      {address.address}, {address.ward}, {address.district}, {address.province}
                    </p>
                  </div>
                ))}
              </div>
              <div className="p-6 border-t flex justify-end">
                <button
                  onClick={() => setShowAddressListModal(false)}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Voucher Modal */}
        {showVoucherModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="p-6 border-b">
                <h3 className="text-xl font-bold">Chọn mã giảm giá</h3>
              </div>
              <div className="p-6 space-y-3">
                {availableVouchers.map((voucher) => (
                  <div
                    key={voucher.id}
                    onClick={() => {
                      if (voucher.minimumOrderAmount <= subtotal) {
                        setSelectedVoucher(voucher);
                        setVoucherCode(voucher.code);
                        setShowVoucherModal(false);
                      } else {
                        alert(`Đơn hàng của bạn chưa đủ ${voucher.minimumOrderAmount.toLocaleString('vi-VN')}₫ để sử dụng voucher này.`);
                      }
                    }}
                    className="p-4 border-2 rounded-lg cursor-pointer hover:border-blue-500 transition"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-blue-600">{voucher.code}</span>
                      {voucher.minimumOrderAmount <= subtotal ?<span className="font-bold text-green-600">Đủ điều kiện</span>:
                      <span className="font-bold text-red-600">Không đủ điều kiện</span>}
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-gray-600">{voucher.description}</p>
                      <span className="text-red-600 font-semibold">
                        {voucher.discountType === "PERCENTAGE" ? `-${(subtotal*voucher.discountValue).toLocaleString('vi-VN')}₫` 
    : `-${voucher.discountValue.toLocaleString('vi-VN')}₫`}
                        {/* -{voucher.discountValue.toLocaleString('vi-VN')}₫ */}
                      </span>
                    </div>
                    
                  </div>
                ))}
              </div>
              <div className="p-6 border-t flex justify-end">
                <button
                  onClick={() => setShowVoucherModal(false)}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success Modal */}
        {showSuccess && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg max-w-md">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Đặt hàng thành công!</h3>
                <p className="text-gray-600 mb-6">
                  Cảm ơn bạn đã mua hàng. Chúng tôi sẽ gửi email xác nhận cho bạn ngay.
                </p>
                <button
                  onClick={() => setShowSuccess(false)}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
                >
                  Tiếp tục mua sắm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Address Modal */}
      {showAddressModal && (
        <AddressModal setShowAddressModal={setShowAddressModal}/>
      )}
    </div>
  );
};

export default CheckoutPage;