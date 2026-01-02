// src/components/ProductCard.jsx
import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiHeart, FiShoppingBag, FiEye, FiStar } from 'react-icons/fi';
import { FaStarHalfAlt } from "react-icons/fa";
import {CartService } from '../../API/CartService';
import { FavoriteContext } from '../../contexts/FavoriteContext.jsx';
import { CurrencyContext } from '../../contexts/CurrencyContext.jsx'; // Import CurrencyContext
import WishlistService from '../../API/WishlistService';
import {useTranslation} from "react-i18next";
import { saveRecentlyViewed } from '../../utils/RecentlyViewedProducts.js';

const PLACEHOLDER_IMAGE_URL = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=600&fit=crop&crop=center';

const ProductCard = ({ product, onClick }) => {
  const { t , i18n  } = useTranslation();
  const isEn = i18n.language === 'en';
  const session = JSON.parse(localStorage.getItem("session"));
  const { addToWishlist, removeFromWishlist } = useContext(FavoriteContext);
  // Lấy hàm convertAndGetDisplayPrice và formatCurrency từ CurrencyContext
  const { convertAndGetDisplayPrice, formatCurrency, currentCurrency } = useContext(CurrencyContext);

  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // console.log("Giá trị session hiện tại:", session)
    const checkFavoriteStatus = async () => {
      if (session?.currentUser?.id && product?.id) {
        try {
          const isFav = await WishlistService.checkFavorite(
              session.currentUser.id,
              product.id,
              session.token
          );
          setIsFavorite(isFav);
        } catch (error) {
          console.error('Lỗi kiểm tra trạng thái yêu thích:', error);
        }
      }
    };
    checkFavoriteStatus();
  }, []);

  const handleProductClick = () => {
    if (product?.id) {
      navigate(`/product/${product.slug}`);
      saveRecentlyViewed(product);
    }
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (session?.currentUser?.id) {
      setIsLoading(true);
      try {
        await CartService.addCart({ idProduct: currentVariant.id, amount: quantity});
        window.dispatchEvent(new CustomEvent('cartUpdated'));
      } catch (error) {
        console.error('Lỗi thêm vào giỏ hàng:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      navigate('/auth/login');
    }
  };

  const handleToggleWishlist = async (e) => {
    e.stopPropagation();
    if (!session?.currentUser?.id) {
      navigate('/auth/login');
      return;
    }

    try {
      if (isFavorite) {
        await removeFromWishlist(product.id);
        setIsFavorite(false);
      } else {
        await addToWishlist(product.id);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Lỗi xử lý yêu thích:', error);
    }
  };

  const handleQuickView = (e) => {
    e.stopPropagation();
    handleProductClick();
  };

  // const rating = Math.floor(Math.random() * 2) + 4;
  const rating = product.rating;
  const reviewCount = Math.floor(Math.random() * 100) + 10;
  // Sử dụng hàm convertAndGetDisplayPrice với giá gốc từ database (VND)
  const displayBasePrice = convertAndGetDisplayPrice(product?.basePrice || 0);
  const displayOriginalPrice = convertAndGetDisplayPrice(product?.originalPrice || 0);

  return (
      <div className="group relative bg-white rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 cursor-pointer" onClick={handleProductClick}>
        {/* Product Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden">
          <img
              src={product?.primaryImage?.imageUrl || PLACEHOLDER_IMAGE_URL}
              alt={product?.primaryImage?.altText || product?.name || 'Product Image'}
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
              onClick={handleProductClick}
          />

          {/* Gradient Overlay */}
         <div className="absolute inset-0 bg-gradient-to-t from-black/70  via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
          {/* Wishlist Button */}
          <button
              onClick={handleToggleWishlist}
              className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-sm shadow-lg transition-all duration-300 ${
                  isFavorite
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-white/90 text-gray-700 hover:bg-white hover:text-red-500'
              } hover:scale-110`}
              aria-label={isFavorite ? t("product_card.remove_from_wishlist") : t("product_card.add_to_wishlist")}
          >
            <FiHeart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>

          {/* Sale Badge */}
          {product?.discount && (
              <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                -{product.discount}%
              </div>
          )}

          {/* Action Buttons Overlay */}
          <div className="absolute bottom-4 inset-x-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
            
              {/* Brand */}
              {product?.brandName && (
                  <p className="text-xs font-medium text-white uppercase tracking-wider mb-2">
                    {product.brandName}
                  </p>
              )}

              {/* Product Name */}
              <h3
                  className="text-lg font-semibold text-gray-700 mb-3 line-clamp-1 group-hover:text-white transition-colors duration-200"
                  onClick={handleProductClick}
              >
                {isEn ? product.nameEn : product.name}
              </h3>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => {
                    const starValue = i + 1;

                    if (starValue <= rating) {
                      return <FiStar key={i} className="w-4 h-4 text-yellow-400 fill-current" />;
                    } else if (starValue - rating <= 0.5) {
                      return <FaStarHalfAlt key={i} className="w-4 h-4 text-yellow-400 fill-current" />;
                    } else {
                      return <FiStar key={i} className="w-4 h-4 text-gray-300" />;
                    }
                  })}
                </div>
                <span className="text-xs text-white">({reviewCount}) {t("product_card.review_count")}</span>
              </div>

              {/* Price */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-white">
                  {/* Sử dụng formatCurrency với giá đã chuyển đổi và currentCurrency */}
                  {formatCurrency(displayBasePrice, currentCurrency)}
                </span>
                  {product?.originalPrice && product.originalPrice > product.basePrice && (
                      <span className="text-sm text-white line-through">
                    {formatCurrency(displayOriginalPrice, currentCurrency)}
                  </span>
                  )}
                </div>

                {/* Stock Status */}
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-xs text-white">{t("product_card.in_stock")}</span>
                </div>
              </div>
            
          </div>
        </div>

        {/* Product Info */}
        

        {/* Hover Border Effect */}
        <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-gray-200 transition-all duration-300 pointer-events-none"></div>
      </div>
  );
};

export default ProductCard;