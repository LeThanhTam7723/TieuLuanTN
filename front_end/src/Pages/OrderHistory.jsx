import React, { useContext, useEffect, useState } from "react";
import { FiSearch, FiChevronDown, FiShoppingBag, FiStar, FiInfo, FiChevronUp, FiX, FiPackage, FiTruck, FiCheckCircle, FiXCircle, FiClock, FiCalendar, FiCreditCard, FiMapPin } from "react-icons/fi";
import { introspect } from "../API/AuthService";
import axiosClient from "../API/axiosClient";
import {useTranslation} from "react-i18next";
import ReviewService from "../API/ReviewService";
import { FavoriteContext } from "../contexts/FavoriteContext";
import OrderService from "../API/OrderService";

const OrderHistory = () => {
  const { session } = useContext(FavoriteContext);
  const { t } = useTranslation();
  const cancelReasons = [
    t("order_history_page.cancel_modal.reasons.change_address"),
    t("order_history_page.cancel_modal.reasons.change_payment"),
    t("order_history_page.cancel_modal.reasons.found_better_price"),
    t("order_history_page.cancel_modal.reasons.changed_mind"),
    t("order_history_page.cancel_modal.reasons.other_reason")
  ];

  const [expandedOrders, setExpandedOrders] = useState({});
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [orderList, setOrderList] = useState([]);
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
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");

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
      case "pending":
        return t("order_history_page.order_card.status.pending");
      case "confirmed":
        return t("order_history_page.order_card.status.confirmed");
      default:
        return status;
    }
  };

  const filteredOrders = orderList.filter(order => {
    const matchesStatus = selectedStatus === "all" || order.statusName === selectedStatus;
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

  const handleReviewClick = (product) => {
    setSelectedProduct(product);
    setShowReviewModal(true);
    setReviewRating(0);
    setReviewComment("");
  };

  const handleSubmitReview = () => {
    console.log("Review submitted", {
      productId: selectedProduct.id,
      rating: reviewRating,
      comment: reviewComment
    });
    console.log(selectedProduct);
    ReviewService.addReview(selectedProduct.idProduct.id,session.currentUser.id,reviewRating,reviewComment,session.token);
    setShowReviewModal(false);
    setSelectedProduct(null);
    setReviewRating(0);
    setReviewComment("");
  };

  const calculateOrderTotal = (orderDetails) => {
    return orderDetails.reduce((total, item) => total + item.totalPrice, 0);
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
              {t("order_history_page.header.title")}
            </h1>
            <p className="text-gray-600">{t("order_history_page.header.description")}</p>
          </div>

          {/* Search and Filter */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder={t("order_history_page.search_filter.placeholder")}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="relative w-full lg:w-64">
                <select
                    className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all duration-200"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="all">{t("order_history_page.search_filter.all_statuses")}</option>
                  <option value="pending">{t("order_history_page.search_filter.pending")}</option>
                  <option value="confirmed">{t("order_history_page.search_filter.confirmed")}</option>
                  <option value="shipping">{t("order_history_page.search_filter.shipping")}</option>
                  <option value="completed">{t("order_history_page.search_filter.completed")}</option>
                  <option value="cancelled">{t("order_history_page.search_filter.cancelled")}</option>
                </select>
                <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
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
                                            src={product.idProduct.images?.[0]?.imageUrl || '/default-image.jpg'}
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
                                        <div className="text-lg font-bold text-gray-900">${product.totalPrice.toFixed(2)}</div>
                                        {order.statusName === "completed" && (
                                            <button
                                                onClick={() => handleReviewClick(product)}
                                                className="mt-2 px-3 py-1 text-sm bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                                            >
                                              <FiStar className="w-4 h-4 inline mr-1" />
                                              {t("order_history_page.order_card.review")}
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
                          ${calculateOrderTotal(order.orderDetails).toFixed(2)}
                        </span>
                              </div>

                              <div className="flex flex-wrap gap-3 justify-between items-center">
                                <div className="flex gap-3">
                                  <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 font-medium">
                                    {t("order_history_page.order_card.buy_again")}
                                  </button>
                                  <button className="px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium">
                                    {t("order_history_page.order_card.details")}
                                  </button>
                                </div>
                                {(order.statusName === "processing" || order.statusName === "confirmed") && (
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
      </div>
  );
};

export default OrderHistory;