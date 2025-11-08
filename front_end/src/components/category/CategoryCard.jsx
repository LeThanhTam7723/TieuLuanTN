import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowUpRight, FiShoppingBag } from 'react-icons/fi';

const PLACEHOLDER_IMAGE_URL = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=600&fit=crop&crop=center';

const CategoryCard = ({ category, genderSlug }) => {
  const imageUrl = category?.categoryImage?.imageUrl || PLACEHOLDER_IMAGE_URL;
  const imageAltText = category?.categoryImage?.altText || category?.name || 'Fashion Category';

  return (
      <Link
          to={`/collections/${category.slug}`}
          className="group relative block overflow-hidden bg-white transition-all duration-500 hover:shadow-2xl hover:-translate-y-1"
      >
        {/* Image Container với gradient overlay */}
        <div className="relative aspect-[3/4] overflow-hidden">
          <img
              src={imageUrl}
              alt={imageAltText}
              className="h-full w-full object-cover transition-all duration-700 group-hover:scale-105"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Floating Action Button */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white hover:scale-110 transition-all duration-200">
              <FiArrowUpRight className="h-5 w-5 text-gray-900" />
            </div>
          </div>

          {/* Product Count Badge */}
          {category?.productCount > 0 && (
              <div className="absolute top-4 left-4">
                <div className="flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-sm px-3 py-1.5 shadow-lg">
                  <FiShoppingBag className="h-3.5 w-3.5 text-gray-700" />
                  <span className="text-xs font-medium text-gray-900">
                {category.productCount}
              </span>
                </div>
              </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-6">
          {/* Category Name */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1 group-hover:text-black transition-colors duration-200">
            {category?.name || 'Fashion Category'}
          </h3>

          {/* Description */}
          {category?.description && (
              <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                {category.description}
              </p>
          )}

          {/* Hover Effect Underline */}
          <div className="mt-4 flex items-center text-sm font-medium text-gray-900 group-hover:text-black">
            <span>Khám phá</span>
            <div className="ml-2 h-px flex-1 bg-gray-200 group-hover:bg-gray-900 transition-colors duration-300" />
          </div>
        </div>
      </Link>
  );
};

export default CategoryCard;