import React from 'react';
import { Star, Shield, Truck, RotateCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next'; // Import useTranslation

const ProductInfo = ({ product, reviewsCount }) => {
  const { t } = useTranslation(); 

  if (!product) return null;

  const renderStars = (rating = 0) => {
    return Array.from({ length: 5 }, (_, index) => (
        <Star
            key={index}
            size={16}
            className={index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
        />
    ));
  };

  const formatPrice = (price) => {
    // Sử dụng t() cho "Liên hệ"
    return price?.toLocaleString('vi-VN') + '₫' || t('product_info.contact_for_price');
  };

  // Determine stock status based on selectedVariant or product overall
  const isInStock = product.variants && product.variants.some(v => v.stock > 0);

  return (
      <div className="space-y-6">
        {/* Brand */}
        {product.brand && (
            <div className="flex items-center gap-3">
              {product.brand.logoUrl && (
                  <img
                      src={product.brand.logoUrl}
                      alt={product.brand.name}
                      className="w-8 h-8 object-contain"
                      onError={(e) => { e.target.style.display = 'none'; }}
                  />
              )}
              <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
            {product.brand.name}
          </span>
            </div>
        )}

        {/* Product Name */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
          {product.name}
        </h1>

        {/* Ratings & Reviews */}
        <div className="flex items-center gap-3">
          <div className="flex items-center">
            {renderStars(product.averageRating)}
          </div>
          <span className="text-sm font-medium text-gray-600">
          {/* Sử dụng t() cho số lượng đánh giá */}
            {t('product_info.reviews_count', { count: reviewsCount })}
        </span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-3">
        <span className="text-4xl font-bold text-amber-600">
          {formatPrice(product.basePrice)}
        </span>
          {product.discountedPrice && product.discountedPrice < product.basePrice && (
              <span className="text-xl text-gray-500 line-through">
            {formatPrice(product.basePrice)}
          </span>
          )}
        </div>

        {/* Short Description */}
        {product.shortDescription && (
            <p className="text-gray-700 leading-relaxed max-w-lg">
              {product.shortDescription}
            </p>
        )}

        {/* Stock Status */}
        <div className={`text-sm font-semibold py-1 px-3 rounded-full inline-block ${
            isInStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {isInStock ? t('product_info.stock_status.in_stock') : t('product_info.stock_status.out_of_stock')} 
        </div>

        {/* Shipping, Return & Guarantees */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Truck className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-800">{t('product_info.shipping_return_guarantees.free_shipping_title')}</p> 
              <p className="text-sm text-gray-500">{t('product_info.shipping_return_guarantees.free_shipping_description')}</p> 
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <RotateCcw className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-800">{t('product_info.shipping_return_guarantees.easy_returns_title')}</p> 
              <p className="text-sm text-gray-500">{t('product_info.shipping_return_guarantees.easy_returns_description')}</p> 
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="font-medium text-gray-800">{t('product_info.shipping_return_guarantees.genuine_warranty_title')}</p> 
              <p className="text-sm text-gray-500">{t('product_info.shipping_return_guarantees.genuine_warranty_description')}</p> 
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="font-medium text-gray-800">{t('product_info.shipping_return_guarantees.secure_payment_title')}</p> 
              <p className="text-sm text-gray-500">{t('product_info.shipping_return_guarantees.secure_payment_description')}</p> 
            </div>
          </div>
        </div>
      </div>
  );
};

export default ProductInfo;