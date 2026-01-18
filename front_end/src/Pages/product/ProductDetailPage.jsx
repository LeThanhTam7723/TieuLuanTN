import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader } from 'lucide-react';
import ProductService from '../../API/ProductService';
import ProductImageGallery from '../../components/product/ProductImageGallery';
import ProductInfo from '../../components/product/ProductInfo';
import ProductVariantSelector from '../../components/product/ProductVariantSelector';
import ProductActions from '../../components/product/ProductActions';
import RelatedProducts from '../../components/product/RelatedProducts';
import FacebookComment from '../../components/commentFB/FacebookComment';
import ReviewService from '../../API/ReviewService';
import {useTranslation} from "react-i18next";
import RecentlyViewedProducts from '../../components/product/RecentlyViewedProducts ';

const ProductDetailPage = () => {
  const { t , i18n  } = useTranslation();
  const isEn = i18n.language === 'en';
  const { slug } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews,setReview]= useState([]);

  useEffect(() => {
    if (slug) {
      fetchProductDetails();
    }
  }, [slug]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await ProductService.getProductBySlug(slug);
      console.log(response)

      if (response) {
        setProduct(response);

        // Auto-select first available variant if exists
        if (response.variants && response.variants.length > 0) {
          const firstVariant = response.variants[0];
          setSelectedVariant(firstVariant);
          setSelectedColor(firstVariant.name);
          setSelectedSize(firstVariant.size.name);
        }
        const result = await ReviewService.getReviews(response.id);
        console.log(result);
        setReview(result);
      }
    } catch (err) {
      console.error('Lỗi khi lấy chi tiết sản phẩm:', err);
      setError('Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleVariantChange = ({ color, size, variant }) => {
    setSelectedColor(color);
    setSelectedSize(size);
    setSelectedVariant(variant);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-600">
          <Loader className="animate-spin" size={24} />
          <span className="text-lg">Đang tải sản phẩm...</span>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl text-gray-400">😞</div>
          <h2 className="text-2xl font-bold text-gray-800">Oops!</h2>
          <p className="text-gray-600 max-w-md mx-auto">
            {error || 'Không tìm thấy sản phẩm này. Sản phẩm có thể đã bị xóa hoặc không tồn tại.'}
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleGoBack}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 
                       transition-colors duration-200"
            >
              Quay lại
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg 
                       hover:bg-gray-50 transition-colors duration-200"
            >
              Trang chủ
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with back button */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 py-4">
            <button
              onClick={handleGoBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 
                       transition-colors duration-200"
            >
              <ArrowLeft size={20} />
              <span className="font-medium">Quay lại</span>
            </button>
            <div className="h-6 w-px bg-gray-300"></div>
            <h1 className="text-lg font-semibold text-gray-800 truncate">
              {product.name}
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Left Column - Image Gallery */}
          <div className="space-y-4">
            <ProductImageGallery
              images={product.images || []}
              productName={product.name}
            />
          </div>

          {/* Right Column - Product Info & Actions */}
          <div className="space-y-6">
            {/* Product Info */}
            <ProductInfo product={product} />

            {/* Variant Selector */}
            {product.variants && product.variants.length > 0 && (
              <ProductVariantSelector
                variants={product.variants}
                selectedColor={selectedColor}
                selectedSize={selectedSize}
                onVariantChange={handleVariantChange}
              />
            )}
            {console.log(selectedVariant)}

            <ProductActions
              product={product}
              currentVariant={selectedVariant}
              disabled={!selectedVariant || selectedVariant.stockQuantity <= 0}
            />

          </div>
        </div>

        {/* Product Description */}
        {product.description && (
          <div className="mb-12">
            <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('product_detail.description')}</h2>
              {((isEn && product.descriptionEn) || (!isEn && product.description)) && (
                <p className="text-gray-700">
                  {isEn ? product.descriptionEn : product.description}
                </p>
              )}
            </div>
            <FacebookComment url={'https://your-public-url.com/product/'+product.id} />
            <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('product_detail.review')}</h2>
              <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
                {reviews.length === 0 ? (
                  <p className="text-gray-500">{t('product_detail.review_comment')}</p>
                ) : (
                  <div className="space-y-6">
                    {reviews.map((review, index) => (
                      <div key={index} className="flex items-start space-x-4">
                        {/* Avatar */}
                        <img
                          src={review.userResponse.imageUrl}
                          alt={review.userResponse.username}
                          className="w-12 h-12 rounded-full border object-cover"
                        />

                        {/* Nội dung đánh giá */}
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-gray-800">{review.userResponse.username}</h3>
                            <span className="text-sm text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                          </div>

                          {/* Số sao */}
                          <div className="flex items-center mt-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-5 h-5 ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.382 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.538 1.118l-3.382-2.455a1 1 0 00-1.175 0l-3.382 2.455c-.783.57-1.838-.197-1.538-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
                              </svg>
                            ))}
                          </div>

                          {/* Comment */}
                          <p className="text-gray-700">{review.comment}</p>
                          {review.adminReply && (
                            <div className="mt-3 ml-10 flex items-start space-x-3 bg-gray-50 border-l-4 border-blue-500 p-3 rounded-md">
                              {/* Avatar admin */}
                              <img
                                src={review.repliedBy.imageUrl}
                                alt="Admin"
                                className="w-8 h-8 rounded-full border object-cover"
                              />

                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-semibold text-blue-600">
                                    Phản hồi từ quản trị viên
                                  </span>
                                  <span className="text-xs text-gray-400">
                                    {new Date(review.repliedAt).toLocaleDateString()}
                                  </span>
                                </div>

                                <p className="text-sm text-gray-700 mt-1">
                                  {review.adminReply}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                </div>

            </div>
          </div>
        )}

        {/* Related Products */}
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
          <RelatedProducts productId={product.id} />
        </div>
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
          <RecentlyViewedProducts/>
        </div>
      </div>

      {/* Floating Actions for Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-20">
        <ProductActions
          product={product}
          currentVariant={selectedVariant}
          disabled={!selectedVariant || selectedVariant.stockQuantity <= 0}
        />
      </div>
    </div>
  );
};

export default ProductDetailPage;