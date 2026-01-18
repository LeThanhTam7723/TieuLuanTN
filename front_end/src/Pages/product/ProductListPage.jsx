import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductService from '../../API/ProductService';
import ColorFilter from '../../components/filters/ColorFilter';
import SizeFilter from '../../components/filters/SizeFilter';
import PriceFilter from '../../components/filters/PriceFilter';
import ProductCard from '../../components/product/ProductCard';
import Pagination from '../../components/common/Pagination';
import {useTranslation} from "react-i18next";

// Currency formatter
const formatCurrency = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price);
};

const ProductListPage = () => {
  const {t} = useTranslation();

  const navigate = useNavigate();
  const { categorySlug } = useParams();

  // States
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [pagination, setPagination] = useState({
    pageNo: 0,
    pageSize: 8,
    totalElements: 0,
    totalPages: 0,
    last: false
  });

  // Filter states
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('createdAt,desc');
  const [currentPage, setCurrentPage] = useState(0);

  // Load initial data
  useEffect(() => {
    loadColors();
    loadSizes();
  }, []);

  // Load products when filters change
  useEffect(() => {
    loadProducts();
  }, [categorySlug, selectedColors, selectedSizes, priceRange, sortBy, currentPage]);

  const loadColors = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/colors');
      const data = await response.json();
      setColors(data);
    } catch (error) {
      console.error('Error loading colors:', error);
    }
  };

  const loadSizes = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/sizes');
      const data = await response.json();
      setSizes(data);
    } catch (error) {
      console.error('Error loading sizes:', error);
    }
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      const filters = {
        page: currentPage,
        size: pagination.pageSize,
        sort: sortBy,
        colorIds: selectedColors,
        sizeIds: selectedSizes,
        minPrice: priceRange.min,
        maxPrice: priceRange.max
      };

      const response = await ProductService.getProductsByCategory(categorySlug, filters);
      const data = response.data;

      setProducts(data.content);
      setPagination({
        pageNo: data.pageNo,
        pageSize: data.pageSize,
        totalElements: data.totalElements,
        totalPages: data.totalPages,
        last: data.last
      });
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleColorFilter = (colorId) => {
    setSelectedColors(prev =>
      prev.includes(colorId)
        ? prev.filter(id => id !== colorId)
        : [...prev, colorId]
    );
    setCurrentPage(0);
  };

  const handleSizeFilter = (sizeId) => {
    setSelectedSizes(prev =>
      prev.includes(sizeId)
        ? prev.filter(id => id !== sizeId)
        : [...prev, sizeId]
    );
    setCurrentPage(0);
  };

  const handlePriceFilter = (min, max) => {
    setPriceRange({ min, max });
    setCurrentPage(0);
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
    setCurrentPage(0);
  };

  const handleProductClick = (slug) => {
    navigate(`/product/${slug}`);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* DashboardSidebar Filters */}
        <div className="w-full lg:w-1/4">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
            <ColorFilter
              colors={colors}
              selectedColors={selectedColors}
              onColorSelect={handleColorFilter}
            />
            <SizeFilter
              sizes={sizes}
              selectedSizes={selectedSizes}
              onSizeSelect={handleSizeFilter}
            />
            <PriceFilter
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              onPriceFilter={handlePriceFilter}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{t("product_list.product_heading")}</h1>
              <p className="text-gray-600">{pagination.totalElements} {t("product_list.product_subheading")}</p>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">{t("product_list.order_by")}</span>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-500"
              >
                <option value="createdAt,desc">{t("product_list.order_newest")}</option>
                <option value="basePrice,asc">{t("product_list.order_price_asc")}</option>
                <option value="basePrice,desc">{t("product_list.order_price_desc")}</option>
              </select>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
            </div>
          )}

          {/* Product Grid */}
          {!loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={handleProductClick}
                />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && products.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">{t("product_list.empty")}</p>
            </div>
          )}

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={pagination.totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;