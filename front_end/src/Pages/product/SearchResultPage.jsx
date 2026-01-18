import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ProductService from '../../API/ProductService';

const formatCurrency = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price);
};

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('keyword') || '';

  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    pageNo: 0,
    pageSize: 12,
    totalElements: 0,
    totalPages: 0,
    last: false
  });
  const [sortBy, setSortBy] = useState('createdAt,desc');
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (keyword.trim() !== '') {
      fetchResults();
    }
  }, [keyword, sortBy, currentPage]);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const response = await ProductService.searchProducts(keyword, {
        page: currentPage,
        size: pagination.pageSize,
        sort: sortBy
      });

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
      console.error('Error fetching search results:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
    setCurrentPage(0);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleProductClick = (slug) => {
    navigate(`/product/${slug}`);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Kết quả cho: “{keyword}”</h1>
          <p className="text-gray-600">{pagination.totalElements} sản phẩm</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Sắp xếp theo:</span>
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded text-sm"
          >
            <option value="createdAt,desc">Mới nhất</option>
            <option value="basePrice,asc">Giá tăng dần</option>
            <option value="basePrice,desc">Giá giảm dần</option>
          </select>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
        </div>
      )}

      {/* Product Grid */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              onClick={() => handleProductClick(product.slug)}
              className="bg-white rounded-lg shadow-sm hover:shadow-md cursor-pointer transition-shadow"
            >
              <div className="relative aspect-square">
                <img
                  src={product.primaryImage?.imageUrl || 'https://via.placeholder.com/300x300?text=No+Image'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{product.brandName}</p>
                <p className="font-bold text-gray-900">{formatCurrency(product.basePrice)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Không tìm thấy sản phẩm nào phù hợp</p>
        </div>
      )}

      {/* Pagination */}
      {!loading && pagination.totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
              className="px-3 py-2 border border-gray-300 rounded text-sm disabled:opacity-50"
            >
              Trước
            </button>
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              const page = currentPage <= 2 ? i : currentPage - 2 + i;
              if (page >= pagination.totalPages) return null;
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-2 text-sm border rounded ${
                    currentPage === page
                      ? 'bg-gray-800 text-white'
                      : 'border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {page + 1}
                </button>
              );
            })}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={pagination.last}
              className="px-3 py-2 border border-gray-300 rounded text-sm disabled:opacity-50"
            >
              Sau
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;
