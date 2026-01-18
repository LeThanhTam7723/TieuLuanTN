import axiosClient from './axiosClient';

const ProductVariantService = {
  // Lấy tất cả biến thể của một sản phẩm
  getVariantsByProductId: async (productId) => {
    try {
      const response = await axiosClient.get(`/products/${productId}/variants`);
      // Controller trả về List<ProductVariantSummary> trực tiếp, nên dữ liệu nằm trong response.data
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi lấy biến thể cho sản phẩm ${productId}:`, error);
      throw error;
    }
  },

  // Tạo một biến thể mới cho sản phẩm
  createVariant: async (productId, variantData) => {
    try {
      const response = await axiosClient.post(`/products/${productId}/variants`, variantData);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi tạo biến thể cho sản phẩm ${productId}:`, error);
      throw error;
    }
  },

  // Cập nhật một biến thể hiện có
  updateVariant: async (variantId, variantData) => {
    try {
      const response = await axiosClient.put(`/products/${variantId}/variants/${variantId}`, variantData);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi cập nhật biến thể ${variantId}:`, error);
      throw error;
    }
  },

  // Xóa một biến thể
  deleteVariant: async (variantId) => {
    try {
      await axiosClient.delete(`/products/any-product-id/variants/${variantId}`); // productId có thể là bất kỳ giá trị nào vì nó không được dùng trong backend cho endpoint này
    } catch (error) {
      console.error(`Lỗi khi xóa biến thể ${variantId}:`, error);
      throw error;
    }
  },

  // Phương thức để lấy biến thể theo ID (nếu cần)
  getVariantById: async (variantId) => {
    try {
      const response = await axiosClient.get(`/products/any-product-id/variants/${variantId}`);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi lấy biến thể theo ID ${variantId}:`, error);
      throw error;
    }
  }
};

export default ProductVariantService;
