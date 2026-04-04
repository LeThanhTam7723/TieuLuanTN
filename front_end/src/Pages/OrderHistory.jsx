import { useContext, useEffect, useState } from "react";
import {FiChevronDown, FiShoppingBag, FiStar, FiInfo, FiChevronUp, FiX, FiPackage, FiTruck, FiCheckCircle, FiXCircle, FiCalendar, FiCreditCard,FiUpload,FiImage } from "react-icons/fi";
import { introspect } from "../API/AuthService";
import axiosClient from "../API/axiosClient";
import {useTranslation} from "react-i18next";
import ReviewService from "../API/ReviewService";
import { FavoriteContext } from "../contexts/FavoriteContext";
import OrderService from "../API/OrderService";
import { CurrencyContext } from "../contexts/CurrencyContext";

const OrderHistory = () => {
  const { session } = useContext(FavoriteContext);
  const { t , i18n  } = useTranslation();
  const { convertAndGetDisplayPrice, formatCurrency, currentCurrency, convertVndToUsdRealtime } = useContext(CurrencyContext);
  const displayBasePrice=(basePrice) => {
    return convertAndGetDisplayPrice(basePrice || 0);
  } 
  const cancelReasons = [
    t("order_history_page.cancel_modal.reasons.change_address"),
    t("order_history_page.cancel_modal.reasons.change_payment"),
    t("order_history_page.cancel_modal.reasons.found_better_price"),
    t("order_history_page.cancel_modal.reasons.changed_mind"),
    t("order_history_page.cancel_modal.reasons.other_reason")
  ];
  const refundReasons = [
    "Sản phẩm bị lỗi/hư hỏng",
    "Sản phẩm không đúng mô tả",
    "Sản phẩm không vừa size",
    "Giao nhầm sản phẩm",
    "Chất lượng không như mong đợi",
    "Lý do khác"
  ];

  const [expandedOrders, setExpandedOrders] = useState({});
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [orderList, setOrderList] = useState([]);
  const [orderItemId,setOrderItemId] = useState(null);
  const checkToken = async (token) => {
    try {
      const response = await introspect({token});
      console.log(response.data.result.valid);
      return response.data.result.valid;
    } catch (error) {
      console.error("Lỗi kiểm tra token:", error);
      return false;
    }
  };
  useEffect(() => {
    const check = async () => {
      const session = JSON.parse(localStorage.getItem("session"));
      if (session && session !== "undefined") {
        const isValid = await checkToken(session.token);
        console.log("Token valid:", isValid);
        if (isValid) {
          await axiosClient.get('/order/individual/'+session.currentUser.id,{
            headers: {
              Authorization: `Bearer ${session.token}`
            }
          })
              .then((res)=>{
                const { code, message, result } = res.data;
                setOrderList(result);
              })
        } else {
          // Assuming setCartItems is defined elsewhere or handled by context
          // setCartItems([]);
        }
      }
    };
    check();
  },[selectedStatus]);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showViewReviewModal, setShowViewReviewModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundReason, setRefundReason] = useState("");
  const [refundImages, setRefundImages] = useState([]);
  const [refundDescription, setRefundDescription] = useState("");

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "cancelled":
        return "bg-red-50 text-red-700 border-red-200";
      case "shipping":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "pending":
        return "bg-gray-200 text-gray-700 border-gray-300";
      case "confirmed":
        return "bg-green-100 text-green-700 border-green-300";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getPaymentColor = (status) => {
    switch (status) {
      case "VN PAY":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "COD":
        return "bg-orange-50 text-orange-700 border-orange-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <FiCheckCircle className="w-4 h-4" />;
      case "cancelled":
        return <FiXCircle className="w-4 h-4" />;
      case "shipping":
        return <FiTruck className="w-4 h-4" />;
      case "pending":
        return <FiInfo className="w-4 h-4" />; // New icon for pending
      case "confirmed":
        return <FiCheckCircle className="w-4 h-4" />; // New icon for confirmed
      default:
        return <FiPackage className="w-4 h-4" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "completed":
        return t("order_history_page.order_card.status.completed");
      case "cancelled":
        return t("order_history_page.order_card.status.cancelled");
      case "shipping":
        return t("order_history_page.order_card.status.shipping");
      case "processing":
        return t("order_history_page.order_card.status.processing");
      case "confirmed":
        return t("order_history_page.order_card.status.confirmed");
      default:
        return status;
    }
  };

  const filteredOrders = orderList.filter(order => {
    let matchesStatus = true;

    if (selectedStatus === "all") {
      matchesStatus = true;
    } 
    else if (selectedStatus === "pending_payment") {
      matchesStatus =
        order.paid === false && order.paymentMethodTypePayment != "COD" && order.statusName !== "cancelled"
    } 
    else {
      matchesStatus = order.statusName === selectedStatus;
    }

    return matchesStatus;
  });


  const toggleOrderExpand = (orderId) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  const handleCancelClick = (order) => {
    setSelectedOrder(order);
    setShowCancelModal(true);
  };

  const handleConfirmCancel = () => {
    OrderService.updateOrder(selectedOrder.order.idOrder,5,session.token);
    console.log("Order cancelled");
    setShowCancelModal(false);
    setSelectedOrder(null);
    setCancelReason("");
  };

  const handleReviewClick = (product,idOrderItem) => {
    setSelectedProduct(product);
    setShowReviewModal(true);
    setReviewRating(0);
    setReviewComment("");
    setOrderItemId(idOrderItem);
    console.log("id của orderItem đc chọn "+orderItemId);
  };

  const handleViewReviewClick = (product) => {
    setSelectedProduct(product);
    setShowViewReviewModal(true);
  };

  const handleSubmitReview = async() => {
    try {
      await ReviewService.addReview(selectedProduct.idProduct.id,session.currentUser.id,reviewRating,reviewComment,orderItemId);
      // Cập nhật orderList để đánh dấu sản phẩm đã có review
      setOrderList(prevOrders => 
        prevOrders.map(order => ({
          ...order,
          orderDetails: order.orderDetails.map(item => 
            item.id === orderItemId 
              ? { ...item, review: { rating: reviewRating, comment: reviewComment } }
              : item
          )
        }))
      );
      
      setShowReviewModal(false);
      setSelectedProduct(null);
      setReviewRating(0);
      setReviewComment("");
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  // Refund functions
  const handleRefundClick = (product, idOrderItem) => {
    setSelectedProduct(product);
    setOrderItemId(idOrderItem);
    setShowRefundModal(true);
    setRefundReason("");
    setRefundImages([]);
    setRefundDescription("");
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map(file => URL.createObjectURL(file));
    setRefundImages(prev => [...prev, ...imageUrls]);
  };

  const removeImage = (index) => {
    setRefundImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmitRefund = () => {
    console.log("Refund request submitted", {
      productId: selectedProduct.idProduct.id,
      orderItemId: orderItemId,
      reason: refundReason,
      description: refundDescription,
      images: refundImages
    });

    // TODO: Call API to submit refund request
    // RefundService.createRefund(...)

    setShowRefundModal(false);
    setSelectedProduct(null);
    setRefundReason("");
    setRefundImages([]);
    setRefundDescription("");
    setOrderItemId(null);
  };

  const calculateOrderTotal = (orderDetails) => {
    return orderDetails.reduce((total, item) => total + item.totalPrice, 0);
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold leading-snug bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
                {t("order_history_page.header.title")}
              </h1>
              <p className="text-gray-600">{t("order_history_page.header.description")}</p>
            </div>
            <div className="flex flex-wrap gap-1 bg-white">
              {[
                { key: "all", label: t("order_history_page.search_filter.all_statuses") },
                { key: "pending_payment", label: "Chờ thanh toán" },
                { key: "processing", label: t("order_history_page.search_filter.processing") },
                { key: "confirmed", label: t("order_history_page.search_filter.confirmed") },
                { key: "shipping", label: t("order_history_page.search_filter.shipping") },
                { key: "completed", label: t("order_history_page.search_filter.completed") },
                { key: "cancelled", label: t("order_history_page.search_filter.cancelled") },
              ].map(item => (
                <button
                  key={item.key}
                  onClick={() => setSelectedStatus(item.key)}
                  className={`px-3 py-3 text-sm font-medium transition
                    ${selectedStatus === item.key
                      ? "text-red-500 border-b-2 border-red-500"
                      : "text-gray-600 hover:text-red-400"}
                  `}
                >
                {item.label}
              </button>
              ))}
            </div>
          </div>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiShoppingBag className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t("order_history_page.no_orders_found.title")}</h3>
                <p className="text-gray-600">{t("order_history_page.no_orders_found.message")}</p>
              </div>
          ) : (
              <div className="space-y-6">
                {filteredOrders.map((order) => (
                    <div key={order.idOrder} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                      {/* Order Header */}
                      <div
                          className="p-6 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                          onClick={() => toggleOrderExpand(order.idOrder)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <FiCalendar className="w-5 h-5 text-gray-400" />
                              <span className="font-semibold text-gray-900">#{order.idOrder}</span>
                              <span className="text-gray-500">•</span>
                              <span className="text-gray-600">{order.dateOrder}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {expandedOrders[order.idOrder] ? (
                                  <FiChevronUp className="text-gray-400 w-5 h-5" />
                              ) : (
                                  <FiChevronDown className="text-gray-400 w-5 h-5" />
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium border ${getPaymentColor(order.paymentMethodTypePayment)}`}>
                              <FiCreditCard className="w-4 h-4" />
                              {order.paymentMethodTypePayment}
                            </div>
                            <div className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium border ${getStatusColor(order.statusName)}`}>
                              {getStatusIcon(order.statusName)}
                              {getStatusText(order.statusName)}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Order Details */}
                      {expandedOrders[order.idOrder] && (
                          <div className="divide-y divide-gray-100">
                            {/* Products */}
                            <div className="p-6">
                              <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <FiPackage className="w-5 h-5" />
                                {t("order_history_page.order_card.products_ordered")}
                              </h4>
                              <div className="space-y-4">
                                {order.orderDetails.map((product) => (
                                    <div key={product.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                                      <div className="relative">
                                        <img
                                            src={product.idProduct.images?.[0]?.imageUrl || product.idProduct.product.primaryImage.imageUrl}
                                            alt={product.idProduct.product.name}
                                            className="w-20 h-20 rounded-xl object-cover shadow-md"
                                        />
                                        <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                                          {product.quantity}
                                        </div>
                                      </div>
                                      <div className="flex-1">
                                        <h5 className="font-semibold text-gray-900 mb-1">{product.idProduct.product.name}</h5>
                                        <div className="flex items-center gap-4 text-sm text-gray-600">
                                          <span className="flex items-center gap-1">
                                            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                                            {product.idProduct.color.name}
                                          </span>
                                          <span>{t("order_history_page.order_card.size")}: {product.idProduct.size.name}</span>
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <div className="text-lg font-bold text-gray-900">{formatCurrency(displayBasePrice(product.totalPrice), currentCurrency)}</div>
                                        <div className="mt-2 flex flex-col items-end gap-2">
                                          
                                        </div>
                                        {(order.statusName === "completed" && product.review ===null) && (
                                            <button
                                                onClick={() => handleReviewClick(product,product.id)}
                                                className="mt-2 px-3 py-1 text-sm bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                                            >
                                              <FiStar className="w-4 h-4 inline mr-1" />
                                              {t("order_history_page.order_card.review")}
                                            </button>
                                        )}
                                        {(order.statusName === "completed" && product.review !==null) && (
                                            <button
                                                onClick={() => handleViewReviewClick(product)}
                                                className="mt-2 px-3 py-1 text-sm bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                                            >
                                              <FiStar className="w-4 h-4 inline mr-1" />
                                              Xem đánh giá
                                            </button>
                                        )}
                                        {(order.statusName === "completed" && product.refund === null) && (
                                            <button
                                                onClick={()=>handleRefundClick(product,product.id)}
                                                className="mt-2 px-3 py-1 text-sm bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-lg
                                                  hover:from-red-600 hover:to-rose-700 transition-all duration-200
                                                  shadow-md hover:shadow-lg transform hover:scale-105"
                                            >
                                              Trả hàng
                                            </button>
                                        )}
                                        {(order.statusName === "completed" && product.refund !== null) && (
                                            <button
                                                className="mt-2 px-3 py-1 text-sm bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-lg
                                                  hover:from-red-600 hover:to-rose-700 transition-all duration-200
                                                  shadow-md hover:shadow-lg transform hover:scale-105"
                                            >
                                              Xem yêu cầu trả hàng
                                            </button>
                                        )}
                                      </div>
                                    </div>
                                ))}
                              </div>
                            </div>

                            {/* Order Summary */}
                            <div className="p-6 bg-gradient-to-r from-gray-50 to-blue-50">
                              <div className="flex items-center justify-between mb-6">
                                <span className="text-lg font-semibold text-gray-700">{t("order_history_page.order_card.total_amount")}</span>
                                <span className="text-2xl font-bold text-gray-900">
                                  {formatCurrency(displayBasePrice(calculateOrderTotal(order.orderDetails)), currentCurrency)}
                                </span>
                              </div>

                              <div className="flex flex-wrap gap-3 justify-between items-center">
                                <div className="flex gap-3">
                                  {(order.statusName === "completed") &&(
                                    <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 font-medium">
                                      {t("order_history_page.order_card.buy_again")}
                                    </button>
                                  )}
                                  {(order.paid === false && order.paymentMethodTypePayment != "COD" && order.statusName !== "cancelled") && (
                                      <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 font-medium">
                                        Thanh toán ngay
                                      </button>
                                  )}
                                  <button className="px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium">
                                    {t("order_history_page.order_card.details")}
                                  </button>
                                </div>
                                {(order.statusName === "processing" || order.statusName === "confirm") && (
                                    <button
                                        className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 font-medium"
                                        onClick={() => handleCancelClick({order})}
                                    >
                                      <FiX className="w-4 h-4 inline mr-2" />
                                      {t("order_history_page.order_card.cancel_order")}
                                    </button>
                                )}
                              </div>
                            </div>
                          </div>
                      )}
                    </div>
                ))}
              </div>
          )}
        </div>

        {/* Cancel Modal */}
        {showCancelModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl transform animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">{t("order_history_page.cancel_modal.title")}</h3>
                  <button
                      onClick={() => setShowCancelModal(false)}
                      className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-2 transition-colors duration-200"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    {t("order_history_page.cancel_modal.reason_prompt")}
                  </label>
                  <select
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">{t("order_history_page.cancel_modal.select_reason")}</option>
                    {cancelReasons.map((reason, index) => (
                        <option key={index} value={reason}>{reason}</option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                      onClick={() => setShowCancelModal(false)}
                      className="px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium"
                  >
                    {t("order_history_page.cancel_modal.close")}
                  </button>
                  <button
                      onClick={handleConfirmCancel}
                      disabled={!cancelReason}
                      className={`px-6 py-3 rounded-xl text-white font-medium transition-all duration-200 ${
                          cancelReason
                              ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-md hover:shadow-lg transform hover:scale-105'
                              : 'bg-gray-400 cursor-not-allowed'
                      }`}
                  >
                    {t("order_history_page.cancel_modal.confirm_cancel")}
                  </button>
                </div>
              </div>
            </div>
        )}

        {/* Review Modal */}
        {showReviewModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl transform animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">{t("order_history_page.review_modal.title")}</h3>
                  <button
                      onClick={() => setShowReviewModal(false)}
                      className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-2 transition-colors duration-200"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>

                <div className="mb-6">
                  <p className="text-gray-700 mb-4 font-medium">{selectedProduct?.idProduct?.product?.name}</p>
                  <div className="flex items-center justify-center gap-2 mb-6">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            onClick={() => setReviewRating(star)}
                            className={`text-3xl transition-all duration-200 hover:scale-110 ${
                                star <= reviewRating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'
                            }`}
                        >
                          <FiStar className="w-8 h-8 fill-current" />
                        </button>
                    ))}
                  </div>
                  <textarea
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder={t("order_history_page.review_modal.share_experience_placeholder")}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                      rows="4"
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <button
                      onClick={() => setShowReviewModal(false)}
                      className="px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium"
                  >
                    {t("order_history_page.review_modal.cancel")}
                  </button>
                  <button
                      onClick={handleSubmitReview}
                      disabled={!reviewRating}
                      className={`px-6 py-3 rounded-xl text-white font-medium transition-all duration-200 ${
                          reviewRating
                              ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg transform hover:scale-105'
                              : 'bg-gray-400 cursor-not-allowed'
                      }`}
                  >
                    {t("order_history_page.review_modal.submit_review")}
                  </button>
                </div>
              </div>
            </div>
        )}
        {showViewReviewModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl transform animate-in fade-in zoom-in duration-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Đánh giá của bạn</h3>
                <button
                  onClick={() => setShowViewReviewModal(false)}
                  className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-2 transition-colors duration-200"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-gray-700 mb-4 font-medium">{selectedProduct?.idProduct?.product?.name}</p>
                
                {/* Display stars (read-only) */}
                <div className="flex items-center justify-center gap-2 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FiStar
                      key={star}
                      className={`w-8 h-8 ${
                        star <= selectedProduct?.review?.rating 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                
                {/* Display comment (read-only) */}
                <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {selectedProduct?.review?.comment || "Không có nhận xét"}
                  </p>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setShowViewReviewModal(false)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 font-medium"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}
        {showRefundModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl transform animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Yêu cầu hoàn tiền</h3>
                <button
                  onClick={() => setShowRefundModal(false)}
                  className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-2 transition-colors duration-200"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-gray-700 mb-4 font-medium">{selectedProduct?.idProduct?.product?.name}</p>
                
                {/* Reason Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Lý do hoàn tiền <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={refundReason}
                    onChange={(e) => setRefundReason(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Chọn lý do...</option>
                    {refundReasons.map((reason, index) => (
                      <option key={index} value={reason}>{reason}</option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Mô tả chi tiết
                  </label>
                  <textarea
                    value={refundDescription}
                    onChange={(e) => setRefundDescription(e.target.value)}
                    placeholder="Vui lòng mô tả chi tiết vấn đề của sản phẩm..."
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                    rows="3"
                  />
                </div>

                {/* Image Upload */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Hình ảnh minh chứng <span className="text-red-500">*</span>
                  </label>
                  
                  {/* Upload Button */}
                  <label className="flex items-center justify-center gap-2 w-full border-2 border-dashed border-gray-300 rounded-xl px-4 py-6 cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-all duration-200">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <FiUpload className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-600">Chọn ảnh từ thiết bị</span>
                  </label>

                  {/* Preview Images */}
                  {refundImages.length > 0 && (
                    <div className="grid grid-cols-3 gap-3 mt-4">
                      {refundImages.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                          />
                          <button
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                          >
                            <FiX className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <p className="text-xs text-gray-500 mt-2">
                    <FiImage className="inline w-3 h-3 mr-1" />
                    Tối đa 5 ảnh. Hỗ trợ JPG, PNG
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowRefundModal(false)}
                  className="px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSubmitRefund}
                  disabled={!refundReason || refundImages.length === 0}
                  className={`px-6 py-3 rounded-xl text-white font-medium transition-all duration-200 ${
                    refundReason && refundImages.length > 0
                      ? 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 shadow-md hover:shadow-lg transform hover:scale-105'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  Gửi yêu cầu
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
  );
};

export default OrderHistory;