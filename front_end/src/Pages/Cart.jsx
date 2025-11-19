import React, {useContext,useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {useTranslation} from "react-i18next";
import {CurrencyContext} from "../contexts/CurrencyContext";
import {introspect} from "../API/AuthService";
import {CartService} from "../API/CartService";
import axiosClient from "../API/axiosClient";
import {useNavigate} from "react-router-dom";
import { FavoriteContext } from "../contexts/FavoriteContext";

// Icons as simple SVG components
const ShoppingCartIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const MinusIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
  </svg>
);

const PlusIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
  </svg>
);

const TagIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
  </svg>
);

const Cart = () => {
  const { cartItems,setCartItems } = useContext(FavoriteContext);
  const [selectedItems, setSelectedItems] = useState(new Set([]));
  const [removingItem, setRemovingItem] = useState(null);

  const tax = 0.1;

  const toggleItemSelection = (itemId) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedItems.size === cartItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(cartItems.map(item => item.id)));
    }
  };

  const updateQuantity = async (id,idCartItem, newQuantity, action) => {
    setCartItems(items =>
        items.map(item =>
            item.id === id ? {...item, quantity: Math.max(1, newQuantity)} : item
        )
    );
    await CartService.updateCartItem({
      action: action,
      idCartItem: idCartItem,
      amount: 1
    });
  };

  const removeItem = async (id) => {
    setRemovingItem(id);
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
    setTimeout(() => {
      setCartItems(items => items.filter(item => item.id !== id));
      setRemovingItem(null);
    }, 300);
    await CartService.deleteCartItem(id);
  };

  const clearCart = () => {
    setCartItems([]);
    setSelectedItems(new Set());
  };

  const selectedCartItems = cartItems.filter(item => selectedItems.has(item.id));
  const subtotal = selectedCartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const taxAmount = subtotal * tax;
  const total = subtotal + taxAmount;
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (selectedItems.size === 0) {
      alert("Please select at least one item to checkout");
      return;
    }
    // alert(`Proceeding to checkout with ${selectedItems.size} items!\nTotal: $${total.toFixed(2)}`);
    console.log(selectedItems);
    const selectedItemObjects = cartItems.filter(item => 
    selectedItems.has(item.id));
    sessionStorage.setItem("checkoutItems", JSON.stringify(selectedItemObjects));
    navigate('/payment');
  };
  const checkToken = async (token) => {
    try {
      const response = await introspect({token});
      console.log(response.data.result.valid);
      return response.data.result.valid;
    } catch (error) {
      console.error("Lỗi kiểm tra token:", error);
      return false; // Nếu có lỗi thì coi token không hợp lệ
    }
  };
  const {
    convertAndGetDisplayPrice,
    formatCurrency
  } = useContext(CurrencyContext);
  // useEffect(() => {
  //   const check = async () => {
  //     const session = JSON.parse(localStorage.getItem("session"));
  //     if (session && session !== "undefined") {
  //       const isValid = await checkToken(session.token);
  //       console.log("Token valid:", isValid);
  //       if (isValid) {
  //         await listCartItem({userId: session.currentUser.id, token: session.token})
  //             .then((res) => {
  //               const {code, message, result} = res.data;
  //               console.log(res.data);
  //               setCartItems(result);
  //             })
  //       } else {
  //         setCartItems([]);
  //       }
  //     }
  //   };
  //   check();
  // }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2"
          >
            Shopping Cart
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-600"
          >
            {selectedItems.size} of {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} selected
          </motion.p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="lg:w-2/3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
            >
              {/* Cart Header */}
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                        <ShoppingCartIcon />
                      </div>
                      Your Items
                    </h2>
                    {cartItems.length > 0 && (
                      <button
                        onClick={toggleSelectAll}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
                      >
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                          selectedItems.size === cartItems.length 
                            ? 'bg-blue-500 border-blue-500' 
                            : 'border-gray-300'
                        }`}>
                          {selectedItems.size === cartItems.length && <CheckIcon />}
                        </div>
                        Select All
                      </button>
                    )}
                  </div>
                  {cartItems.length > 0 && (
                    <button
                      onClick={clearCart}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 px-4 py-2 rounded-xl transition-all duration-200 flex items-center gap-2 font-medium"
                    >
                      <TrashIcon />
                      Clear Cart
                    </button>
                  )}
                </div>
              </div>

              {/* Cart Items List */}
              <div className="divide-y divide-gray-100">
                <AnimatePresence>
                  {cartItems.map((item, index) => {
                    const isSelected = selectedItems.has(item.id);
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{
                          opacity: removingItem === item.id ? 0 : 1,
                          x: removingItem === item.id ? -100 : 0,
                          scale: removingItem === item.id ? 0.9 : 1
                        }}
                        exit={{ opacity: 0, x: -100, scale: 0.9 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                        className={`p-6 transition-all duration-200 ${
                          isSelected ? 'bg-blue-50/50' : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex gap-6">
                          {/* Checkbox */}
                          <div className="flex items-start pt-2">
                            <button
                              onClick={() => toggleItemSelection(item.id)}
                              className="group"
                            >
                              <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
                                isSelected 
                                  ? 'bg-blue-500 border-blue-500 scale-110' 
                                  : 'border-gray-300 group-hover:border-blue-400'
                              }`}>
                                {isSelected && <CheckIcon />}
                              </div>
                            </button>
                          </div>

                          {/* Product Image */}
                          <div className="relative">
                            <img
                              src={item.product.images?.[0]?.imageUrl || item.product.product.primaryImage.imageUrl}
                              alt={item.product.product.name}
                              className="w-24 h-24 object-cover rounded-xl shadow-md"
                            />
                            <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                              {item.quantity}
                            </div>
                          </div>

                          {/* Product Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-bold text-gray-900 text-lg truncate pr-4">
                                {item.product.product.name}
                              </h3>
                              <button
                                onClick={() => removeItem(item.id)}
                                className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all duration-200 flex-shrink-0"
                              >
                                <TrashIcon />
                              </button>
                            </div>

                            <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                              <span className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                                Color: {item.product.color.name}
                              </span>
                              <span>Size: {item.product.size.name}</span>
                            </div>

                            {/* Quantity and Price */}
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-3">
                                <div className="flex items-center bg-gray-100 rounded-xl overflow-hidden">
                                  <button
                                    onClick={() => updateQuantity(item.id, item.id, item.quantity - 1, false)}
                                    disabled={item.quantity <= 1}
                                    className="p-3 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                  >
                                    <MinusIcon />
                                  </button>
                                  <span className="px-4 py-3 font-semibold min-w-[3rem] text-center">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() => updateQuantity(item.id, item.id, item.quantity + 1, true)}
                                    className="p-3 hover:bg-gray-200 transition-colors duration-200"
                                  >
                                    <PlusIcon />
                                  </button>
                                </div>
                              </div>

                              <div className="text-right">
                                <div className="text-xl font-bold text-gray-900">
                                  ${(item.product.price * item.quantity).toFixed(2)}
                                </div>
                                <div className="text-sm text-gray-500">
                                  ${item.product.price.toFixed(2)} each
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="sticky top-8"
            >
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                {/* Summary Header */}
                <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                      <TagIcon />
                    </div>
                    Order Summary
                  </h3>
                  <p className="text-sm text-gray-600 mt-2">
                    {selectedItems.size} {selectedItems.size === 1 ? 'item' : 'items'} selected
                  </p>
                </div>

                <div className="p-6 space-y-6">
                  {/* Price Breakdown */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-semibold">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Tax (10%)</span>
                      <span className="font-semibold">${taxAmount.toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-900">Total</span>
                        <span className="text-2xl font-bold text-gray-900">${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={handleCheckout}
                    disabled={selectedItems.size === 0}
                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                      selectedItems.size > 0
                        ? 'bg-gradient-to-r from-gray-900 to-gray-700 hover:from-gray-800 hover:to-gray-600 text-white'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed hover:scale-100 hover:shadow-lg'
                    }`}
                  >
                    {selectedItems.size > 0 
                      ? `Proceed to Checkout (${selectedItems.size} ${selectedItems.size === 1 ? 'item' : 'items'})` 
                      : 'Select Items to Checkout'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;