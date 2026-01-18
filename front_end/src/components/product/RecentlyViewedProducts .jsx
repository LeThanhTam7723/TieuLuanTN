import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard'; // sử dụng ProductCard chung
import { getRecentlyViewed } from '../../utils/RecentlyViewedProducts';

const RecentlyViewedProducts  = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const itemsPerSlide = 4;
  const maxSlides = Math.ceil(products.length / itemsPerSlide);

    useEffect(() => {
        setProducts(getRecentlyViewed());
        setLoading(false);
    }, []);

  const nextSlide = () => {
    setCurrentSlide(prev => Math.min(prev + 1, maxSlides - 1));
  };
  const prevSlide = () => {
    setCurrentSlide(prev => Math.max(prev - 1, 0));
  };

  if (loading) {
    return <p>Đang tải sản phẩm xem gần đây...</p>;
  }
  if (error || !products.length) {
    return <p className="text-center text-gray-500">{error || 'Không có sản phẩm mới xem gần đây'}</p>;
  }

  return (
    // Thêm max-w và mx-auto để giới hạn độ rộng
    <div className="space-y-6 max-w-1xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Sản phẩm đã xem gần đây</h2>
        {maxSlides > 1 && (
          <div className="flex gap-2">
            <button
              onClick={prevSlide}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
              disabled={currentSlide === 0}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextSlide}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
              disabled={currentSlide === maxSlides - 1}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>

      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {Array.from({ length: maxSlides }).map((_, slideIndex) => (
            <div key={slideIndex} className="w-full flex-shrink-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {products
                  .slice(slideIndex * itemsPerSlide, (slideIndex + 1) * itemsPerSlide)
                  .map(prod => (
                    <ProductCard key={prod.id} product={prod} />
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {maxSlides > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: maxSlides }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-3 h-3 rounded-full transition-colors duration-200 ${idx === currentSlide ? 'bg-red-600' : 'bg-gray-300'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentlyViewedProducts;