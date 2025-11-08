import React, { useState, useEffect, useContext } from "react";
import { FaLock, FaCreditCard, FaMoneyBillWave, FaWallet } from "react-icons/fa";
import ProvinceSelect from "../API/Location.jsx";
import { listCartItem } from "../API/CartService.jsx";
import { addOrder, vnPay } from "../API/CheckoutService.jsx";
import useQueryParam from "../utils/useQueryParam.jsx";
import axiosClient from "../API/axiosClient.jsx";
import { FavoriteContext } from "../contexts/FavoriteContext.jsx";
import { useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const success = useQueryParam("success");
  const session = JSON.parse(localStorage.getItem("session"));
  const {  clearCart } = useContext(FavoriteContext);
  const [formData, setFormData] = useState({
    fullName: session.currentUser.fullname,
    phoneNumber: session.currentUser.phone,
    province: "",
    provinceId: "",
    district: "",
    districtId: "",
    ward: "",
    address: "",
    deliveryNotes: "",
    shippingMethod: "standard",
    paymentMethod: "",
    cardNumber: "",
    cvv: "",
    expiryDate: "",
    discountCode: ""
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const total = JSON.parse(localStorage.getItem("total"));
  const [cartItems, setCartItems] = useState([]);
  const fetchCartItems = async () => {
    try {
      const res = await listCartItem({
        userId: session.currentUser.id,
        token: session.token
      });
      const { result } = res.data;
  
      // ép kiểu rõ ràng là mảng, nếu không phải thì trả về []
      if (Array.isArray(result)) {
        setCartItems(result);
      } else {
        console.warn('Kết quả không phải mảng:', result);
        setCartItems([]);
      }
  
    } catch (error) {
      console.error('Lỗi khi lấy cart items:', error);
      setCartItems([]); // fallback
    }
  };
  useEffect(() => {
    fetchCartItems();
    if (success) {
      setShowSuccess(success);
      // xử lý logic khi có email ở đây
    }
  }, []);
    

  const shippingMethods = {
    standard: { price: 0, time: "3-5 business days" },
    express: { price: 15, time: "1-2 business days" },
    economy: { price: 5, time: "5-7 business days" }
  };

  const validateForm = () => {
    const newErrors = {};
    if (formData.fullName.length < 2 || /\d/.test(formData.fullName)) {
      newErrors.fullName = "Name must be at least 2 characters and contain no numbers";
    }
    if (!/^0\d{9,10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must start with 0 and be 10-11 digits";
    }
    if (!formData.province) newErrors.province = "Province is required";
    if (!formData.district) newErrors.district = "District is required";
    if (!formData.ward) newErrors.ward = "Ward is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.paymentMethod) newErrors.paymentMethod = "Hãy chọn phương thức thanh toán";

    if (formData.paymentMethod === "card") {
      if (!/^\d{16}$/.test(formData.cardNumber)) {
        newErrors.cardNumber = "Invalid card number";
      }
      if (!/^\d{3}$/.test(formData.cvv)) {
        newErrors.cvv = "Invalid CVV";
      }
      if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
        newErrors.expiryDate = "Invalid expiry date";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateTotal = () => {
    // const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = 15;
    return (total + shipping).toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsLoading(true);
      try {
        // Simulated API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        const session = JSON.parse(localStorage.getItem("session"));
        console.log(formData.fullName,formData.phoneNumber,formData.province + ","+ formData.ward+","+formData.district+","+formData.address);
        if(formData.paymentMethod === "1"){
          await addOrder({
            idUser: session.currentUser.id,
            receiver: formData.fullName,
            phone: formData.phoneNumber,
            idPaymentMethod: 1,
            address: formData.province + ","+ formData.ward+","+formData.district+","+formData.address,
            idStatus: 1,
            total:calculateTotal()
          }
            ,session.token
          );
          setShowSuccess(true);
          clearCart();
          
        } else{
          if(formData.paymentMethod === "2"){
            await addOrder({
              idUser: session.currentUser.id,
              receiver: formData.fullName,
              phone: formData.phoneNumber,
              idPaymentMethod: 2,
              address: formData.province + ","+ formData.ward+","+formData.district+","+formData.address,
              idStatus: 1,
              total:calculateTotal()
            }
              ,session.token
            );
            const response= await vnPay(Math.floor(calculateTotal()));
            const {code,result,message} = response.data;
            console.log(result);
            window.location.href = result;
          }
          setShowSuccess(true);
          clearCart();
        }
      } catch (error) {
        console.error("Order submission failed:", error);
      } finally {
        setIsLoading(false);
      }
       console.log(formData);
    }
    
  };


  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-6">Shipping Information</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    className={`mt-1 block w-full rounded-md border ${errors.fullName ? 'border-red-500' : 'border-gray-300'} px-3 py-2`}
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  />
                  {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    type="tel"
                    className={`mt-1 block w-full rounded-md border ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'} px-3 py-2`}
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                    onKeyDown={(e)=> {
                      if (e.ctrlKey || e.metaKey ||
                        ["Backspace", "ArrowLeft", "ArrowRight", "Delete", "Tab"].includes(e.key)
                      ) {
                        return;
                      }
                      if(!/[0-9]/.test(e.key)){
                        e.preventDefault();
                      }
                    }}
                  />
                  {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
                </div>
                

                {/* Address Fields */}
                <ProvinceSelect formData={formData} setFormData={setFormData} errors={errors}/>
                

                <div>
                  <label className="block text-sm font-medium text-gray-700">House's address</label>
                  <input
                    type="tel"
                    className={`mt-1 block w-full rounded-md border ${errors.address ? 'border-red-500' : 'border-gray-300'} px-3 py-2`}
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                  />
                  {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                </div>

                

                {/* Payment Method */}
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="cod"
                        name="payment"
                        value="1"
                        checked={formData.paymentMethod === "1"}
                        onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                        className="h-4 w-4 text-blue-600"
                      />
                      <label htmlFor="cod" className="ml-3 flex items-center">
                        <FaMoneyBillWave className="text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-900">COD(Cash on Delivery)</span>
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="card"
                        name="payment"
                        value="2"
                        checked={formData.paymentMethod === "2"}
                        onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                        className="h-4 w-4 text-blue-600"
                      />
                      <label htmlFor="card" className="ml-3 flex items-center">
                        <FaCreditCard className="text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-900">VnPay</span>
                      </label>
                    </div>
                    {errors.paymentMethod && <p className="text-red-500 text-sm mt-1">{errors.paymentMethod}</p>}

                    {/* {formData.paymentMethod === "card" && (
                      <div className="ml-7 space-y-4">
                        <input
                          type="text"
                          placeholder="Card Number"
                          className="block w-full rounded-md border border-gray-300 px-3 py-2"
                          value={formData.cardNumber}
                          onChange={(e) => setFormData({...formData, cardNumber: e.target.value})}
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <input
                            type="text"
                            placeholder="MM/YY"
                            className="block w-full rounded-md border border-gray-300 px-3 py-2"
                            value={formData.expiryDate}
                            onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                          />
                          <input
                            type="text"
                            placeholder="CVV"
                            className="block w-full rounded-md border border-gray-300 px-3 py-2"
                            value={formData.cvv}
                            onChange={(e) => setFormData({...formData, cvv: e.target.value})}
                          />
                        </div>
                      </div>
                    )} */}
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <img
                      src={item.product.images?.[0]?.imageUrl || '/default-image.jpg'}
                      alt={item.product.product.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{item.product.product.name}</h3>
                      <p className="text-sm text-gray-500">
                        Size: 200 | Color: trắng
                      </p>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}

                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between mb-2">
                    <span>Subtotal</span>
                    <span>${total}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Shipping</span>
                    <span>${15}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${calculateTotal()}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-red-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                  disabled={isLoading}
                  onClick={handleSubmit}
                >
                  {isLoading ? "Processing..." : "Check out"}
                </button>

                <div className="flex items-center justify-center text-sm text-gray-500">
                  <FaLock className="mr-2" />
                  Secure Checkout
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Success Modal */}
        {showSuccess && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg max-w-md">
              <h3 className="text-2xl font-bold text-green-600 mb-4">Order Placed Successfully!</h3>
              <p className="text-gray-600 mb-6">Thank you for your purchase. We'll send you a confirmation email shortly.</p>
              <button
                onClick={() => {setShowSuccess(false),navigate('/');}}
                className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
