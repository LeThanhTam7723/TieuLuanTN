import axiosClient from './axiosClient';

const GenderService = {
  getAllGenders: async () => {
    try {
      const response = await axiosClient.get('/genders');
      return response;
    } catch (error) {
      console.error('Lỗi khi lấy danh sách giới tính:', error);
      throw error;
    }
  },

  getGenderById: async (id) => {
    try {
      const response = await axiosClient.get(`/genders/${id}`);
      return response;
    } catch (error) {
      console.error(`Lỗi khi lấy thông tin giới tính ${id}:`, error);
      throw error;
    }
  },

  getGenderBySlug: async (slug) => {
    try {
      const response = await axiosClient.get(`/genders/slug/${slug}`);
      return response;
    } catch (error) {
      console.error(`Lỗi khi lấy thông tin giới tính theo slug ${slug}:`, error);
      throw error;
    }
  },

  getCategoriesByGenderId: async (id) => {
    try {
      const response = await axiosClient.get(`/genders/${id}/categories`);
      return response;
    } catch (error) {
      console.error(`Lỗi khi lấy danh mục theo ID giới tính ${id}:`, error);
      throw error;
    }
  },

  getCategoriesByGenderSlug: async (slug) => {
    try {
      const response = await axiosClient.get(`/genders/slug/${slug}/categories`);
      return response;
    } catch (error) {
      console.error(`Lỗi khi lấy danh mục theo slug giới tính ${slug}:`, error);
      throw error;
    }
  }
};

export default GenderService; 