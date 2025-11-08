import axiosClient from './axiosClient';

const ProductService = {
  // Lấy tất cả sản phẩm có phân trang
  getAllProducts: async (params) => {
    try {
      const response = await axiosClient.get('/products', { params });
      return response;
    } catch (error) {
      console.error('Lỗi khi lấy danh sách sản phẩm:', error);
      throw error;
    }
  },

  // Lấy sản phẩm nổi bật có phân trang
  getFeaturedProducts: async (params) => {
    try {
      const response = await axiosClient.get('/products/featured', { params });
      return response;
    } catch (error) {
      console.error('Lỗi khi lấy sản phẩm nổi bật:', error);
      throw error;
    }
  },

  // Lấy thông tin chi tiết sản phẩm theo ID
  getProductById: async (id) => {
    try {
      const response = await axiosClient.get(`/products/${id}`);
      return response;
    } catch (error) {
      console.error(`Lỗi khi lấy thông tin sản phẩm ${id}:`, error);
      throw error;
    }
  },

  // Lấy thông tin chi tiết sản phẩm theo slug
  getProductBySlug: async (slug) => {
    try {
      const response = await axiosClient.get(`/products/slug/${slug}`);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi lấy thông tin sản phẩm ${slug}:`, error);
      throw error;
    }
  },

  getProductByBrandSlug: async (slug) => {
    try {
      const response = await axiosClient.get(`products/brand/slug/${slug}`);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi lấy thông tin sản phẩm ${slug}:`, error);
      throw error;
    }
  },

  // Kiểm tra slug đã tồn tại chưa
  checkSlugExists: async (slug) => {
    try {
      const response = await axiosClient.get('/products/check-slug', {
        params: { slug }
      });
      return response;
    } catch (error) {
      console.error(`Lỗi khi kiểm tra slug ${slug}:`, error);
      throw error;
    }
  },

  // Tìm kiếm sản phẩm theo từ khóa
  searchProducts: async (keyword, params) => {
    try {
      const response = await axiosClient.get('/products/search', {
        params: {
          keyword,
          ...params
        }
      });
      return response;
    } catch (error) {
      console.error(`Lỗi khi tìm kiếm sản phẩm với từ khóa ${keyword}:`, error);
      throw error;
    }
  },

  // Lấy sản phẩm theo thương hiệu
  getProductsByBrand: async (brandId) => {
    try {
      const response = await axiosClient.get(`/products/brand/${brandId}`);
      return response;
    } catch (error) {
      console.error(`Lỗi khi lấy sản phẩm theo thương hiệu ${brandId}:`, error);
      throw error;
    }
  },

  // Lấy sản phẩm theo danh mục
  getProductsByCategory: async (
    categorySlug,
    { colorIds, sizeIds, minPrice, maxPrice, page = 0, size = 12, sort = 'createdAt,desc' }
  ) => {
    try {
      const params = {
        page,
        size,
        sort,
      };
      if (colorIds?.length) params.colorIds = colorIds.join(',');
      if (sizeIds?.length) params.sizeIds = sizeIds.join(',');
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;

      const response = await axiosClient.get(`/products/category/slug/${categorySlug}`, { params });
      return response;
    } catch (error) {
      console.error(`Lỗi khi lấy sản phẩm theo danh mục ${categorySlug}:`, error);
      throw error;
    }
  },

  // Lấy sản phẩm theo giới tính
  getProductsByGender: async (genderName) => {
    try {
      const response = await axiosClient.get(`/products/gender/${genderName}`);
      return response;
    } catch (error) {
      console.error(`Lỗi khi lấy sản phẩm theo giới tính ${genderName}:`, error);
      throw error;
    }
  },

  // Lấy sản phẩm theo tên danh mục
  getProductsByCategoryName: async (categoryName, params) => {
    try {
      const response = await axiosClient.get(`/products/category/name/${encodeURIComponent(categoryName)}`, {
        params: {
          ...params
        }
      });
      return response;
    } catch (error) {
      console.error(`Lỗi khi lấy sản phẩm theo tên danh mục ${categoryName}:`, error);
      throw error;
    }
  },

  // Tạo sản phẩm mới
  createProduct: async (productData) => {
    try {
      const response = await axiosClient.post('/products', productData);
      return response;
    } catch (error) {
      console.error('Lỗi khi tạo sản phẩm mới:', error);
      throw error;
    }
  },

  // Cập nhật sản phẩm
  updateProduct: async (id, productData) => {
    try {
      const response = await axiosClient.put(`/products/${id}`, productData);
      return response;
    } catch (error) {
      console.error(`Lỗi khi cập nhật sản phẩm ${id}:`, error);
      throw error;
    }
  },

  // Xóa sản phẩm
  deleteProduct: async (id) => {
    try {
      const response = await axiosClient.delete(`/products/${id}`);
      return response;
    } catch (error) {
      console.error(`Lỗi khi xóa sản phẩm ${id}:`, error);
      throw error;
    }
  },

  // Chuyển đổi trạng thái sản phẩm
  toggleProductStatus: async (id) => {
    try {
      const response = await axiosClient.patch(`/products/${id}/toggle-status`);
      return response;
    } catch (error) {
      console.error(`Lỗi khi chuyển đổi trạng thái sản phẩm ${id}:`, error);
      throw error;
    }
  },

  // Chuyển đổi trạng thái nổi bật của sản phẩm
  toggleFeaturedStatus: async (id) => {
    try {
      const response = await axiosClient.patch(`/products/${id}/toggle-featured`);
      return response;
    } catch (error) {
      console.error(`Lỗi khi chuyển đổi trạng thái nổi bật của sản phẩm ${id}:`, error);
      throw error;
    }
  },


  // Lấy sản phẩm liên quan theo ID sản phẩm
  getRelatedProducts: async (productId, params = {}) => {
    try {
      const response = await axiosClient.get(`/products/${productId}/related`, {
        params,
      });
      return response;
    } catch (error) {
      console.error(`Lỗi khi lấy sản phẩm liên quan của sản phẩm ${productId}:`, error);
      throw error;
    }
  },
};

export default ProductService; 