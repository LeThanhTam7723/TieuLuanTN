import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, X } from 'lucide-react';

const ProductImageGallery = ({ images, productName }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [processedImages, setProcessedImages] = useState([]);

  useEffect(() => {
    if (images && images.length > 0) {
      // Process images to get proper structure
      const imgList = images.map(img => ({
        id: img.id,
        url: img.imageUrl,
        alt: img.altText || productName || 'Product image',
        isPrimary: img.primary || false
      }));
      
      // Sort images: primary first, then by id
      imgList.sort((a, b) => {
        if (a.isPrimary && !b.isPrimary) return -1;
        if (!a.isPrimary && b.isPrimary) return 1;
        return a.id - b.id;
      });

      setProcessedImages(imgList);
      setCurrentIndex(0);
    }
  }, [images, productName]);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % processedImages.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + processedImages.length) % processedImages.length);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleThumbnailClick = (index) => {
    setCurrentIndex(index);
  };

  const handleImageError = (e) => {
    e.target.src = '/api/placeholder/600/800';
  };

  if (!processedImages || processedImages.length === 0) {
    return (
      <div className="w-full aspect-[3/4] bg-gray-200 rounded-lg flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-2">📷</div>
          <p>Không có hình ảnh</p>
        </div>
      </div>
    );
  }

  const currentImage = processedImages[currentIndex];

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative group bg-white rounded-lg overflow-hidden shadow-lg">
        <div className="aspect-[3/4] relative">
          <img
            src={currentImage.url}
            alt={currentImage.alt}
            className="w-full h-full object-cover cursor-zoom-in transition-transform duration-300 group-hover:scale-105"
            onClick={openModal}
            onError={handleImageError}
          />
          
          {/* Zoom indicator */}
          <div className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <ZoomIn size={20} />
          </div>

          {/* Navigation Arrows */}
          {processedImages.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-all duration-200 opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-all duration-200 opacity-0 group-hover:opacity-100"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}

          {/* Image Counter */}
          {processedImages.length > 1 && (
            <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {currentIndex + 1} / {processedImages.length}
            </div>
          )}
        </div>
      </div>

      {/* Thumbnails */}
      {processedImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {processedImages.map((image, index) => (
            <button
              key={image.id}
              onClick={() => handleThumbnailClick(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                index === currentIndex
                  ? 'border-gray-800 ring-2 ring-gray-300'
                  : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              <img
                src={image.url}
                alt={image.alt}
                className="w-full h-full object-cover"
                onError={handleImageError}
              />
            </button>
          ))}
        </div>
      )}

      {/* Modal for zoomed view */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X size={32} />
            </button>

            {/* Modal Image */}
            <img
              src={currentImage.url}
              alt={currentImage.alt}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
              onError={handleImageError}
            />

            {/* Modal Navigation */}
            {processedImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 text-white p-3 rounded-full hover:bg-white/30 transition-all duration-200"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 text-white p-3 rounded-full hover:bg-white/30 transition-all duration-200"
                >
                  <ChevronRight size={24} />
                </button>

                {/* Modal Counter */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full">
                  {currentIndex + 1} / {processedImages.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;