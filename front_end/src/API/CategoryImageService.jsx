import axiosClient from './axiosClient';

const CategoryImageService = {
    // Lấy ảnh danh mục
    getCategoryImage: async (categoryId) => {
        try {
            const response = await axiosClient.get(`/categories/${categoryId}/image`);
            return response;
        } catch (error) {
            console.error(`Lỗi khi lấy ảnh danh mục ${categoryId}:`, error);
            throw error;
        }
    },

    // Tạo ảnh danh mục mới (multipart/form-data)
    createCategoryImage: async (categoryId, formData) => {
        try {
            const response = await axiosClient.post(`/categories/${categoryId}/image`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response;
        } catch (error) {
            console.error(`Lỗi khi tạo ảnh cho danh mục ${categoryId}:`, error);
            throw error;
        }
    },

    // Cập nhật ảnh danh mục (multipart/form-data)
    updateCategoryImage: async (categoryId, formData) => {
        try {
            const response = await axiosClient.put(`/categories/${categoryId}/image`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response;
        } catch (error) {
            console.error(`Lỗi khi cập nhật ảnh cho danh mục ${categoryId}:`, error);
            throw error;
        }
    },

    // Xoá ảnh danh mục
    deleteCategoryImage: async (categoryId) => {
        try {
            const response = await axiosClient.delete(`/categories/${categoryId}/image`);
            return response;
        } catch (error) {
            console.error(`Lỗi khi xoá ảnh danh mục ${categoryId}:`, error);
            throw error;
        }
    }
};

export default CategoryImageService;
