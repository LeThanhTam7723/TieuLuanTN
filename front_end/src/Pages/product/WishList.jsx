import React, {useContext, useState} from "react";
import {FaHeart, FaRegHeart, FaShoppingCart, FaTrash, FaStar} from "react-icons/fa";
import {FavoriteContext} from "../../contexts/FavoriteContext";
import {useTranslation} from "react-i18next";
import {CurrencyContext} from "../../contexts/CurrencyContext";
import ProductCard from "../../components/product/ProductCard";

const WishList = () => {
  const {t} = useTranslation(); // Initialize useTranslation hook
  const {wishlistItems, setWishlistItems} = useContext(FavoriteContext);
  const [removingItems, setRemovingItems] = useState(new Set());
  const {convertAndGetDisplayPrice, formatCurrency} = useContext(CurrencyContext);
  const handleProductClick = (slug) => {
    navigate(`/product/${slug}`);
  };

  const removeFromWishlist = (id) => {
    setRemovingItems(prev => new Set(prev).add(id));
    setTimeout(() => {
      setWishlistItems(prev => prev.filter(item => item.id !== id));
      setRemovingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }, 300);
  };

  const addToCart = (id) => {
    console.log(`Added item ${id} to cart`);
  };

  const getDiscountPercentage = (original, current) => {
    return Math.round(((original - current) / original) * 100);
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Header Section */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  {t("wishlist.title")}
                </h1>
                <p className="text-gray-600 mt-2">
                  {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} {t("wishlist.heading")}
                </p>
              </div>
              <div className="hidden sm:flex items-center space-x-4">
                <div
                    className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30">
                  <FaHeart className="text-red-500 h-4 w-4"/>
                  <span
                      className="text-sm font-medium text-gray-700">{wishlistItems.length} {t("wishlist.favorite")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {wishlistItems.length === 0 ? (
              <div className="text-center py-16">
                <div className="relative">
                  <div
                      className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                  <FaHeart className="relative mx-auto h-20 w-20 text-gray-300 mb-6"/>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{t("wishlist.empty_text")}</h3>
                <p className="text-gray-500 text-lg">{t("wishlist.empty_subtext")}</p>
                <button
                    className="mt-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
                  {t("wishlist.shopping_button")}
                </button>
              </div>
          ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {wishlistItems.map((product, index) => (
                    <ProductCard
                      key={index}
                      product={product}
                      onClick={handleProductClick}
                    />
                ))}
              </div>
          )}
        </div>

        {/* Floating Action Button */}
        {wishlistItems.length > 0 && (
            <div className="fixed bottom-8 right-8">
              <button
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-full shadow-lg hover:shadow-2xl transform hover:scale-110 transition-all duration-200">
                <FaShoppingCart className="h-6 w-6"/>
              </button>
            </div>
        )}
      </div>
  );
};

export default WishList;