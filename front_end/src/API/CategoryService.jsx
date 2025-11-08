import axiosClient from './axiosClient';

const CategoryService = {
    // Lấy tất cả danh mục
    getAllCategories: async (params) => {
        try {
            const response = await axiosClient.get('/categories', { params });
            return response;
        } catch (error) {
            console.error('Lỗi khi lấy danh mục:', error);
            throw error;
        }
    },

    // Lấy danh mục con theo ID danh mục cha
    getSubCategoriesByParentId: async (parentId) => {
        try {
            const response = await axiosClient.get(`/categories/${parentId}/subcategories`);
            return response;
        } catch (error) {
            console.error(`Lỗi khi lấy danh mục con cho ID ${parentId}:`, error);
            throw error;
        }
    },

    // Lấy danh mục theo tên
    getCategoryByName: async (name) => {
        try {
            const response = await axiosClient.get(`/categories/name/${name}`);
            return response;
        } catch (error) {
            console.error(`Lỗi khi lấy danh mục theo tên ${name}:`, error);
            throw error;
        }
    },

    // Lấy danh mục theo slug
    getCategoryBySlug: async (slug) => {
        try {
            const response = await axiosClient.get(`/categories/slug/${slug}`);
            return response;
        } catch (error) {
            console.error(`Lỗi khi lấy danh mục theo slug ${slug}:`, error);
            throw error;
        }
    },

    // Kiểm tra slug đã tồn tại chưa
    checkSlugExists: async (slug) => {
        try {
            const response = await axiosClient.get('/categories/check-slug', {
                params: { slug }
            });
            return response;
        } catch (error) {
            console.error(`Lỗi khi kiểm tra slug ${slug}:`, error);
            throw error;
        }
    },

    // Lấy danh mục theo ID giới tính
    getCategoriesByGender: async (genderId) => {
        try {
            const response = await axiosClient.get(`/categories/gender/${genderId}`);
            return response;
        } catch (error) {
            console.error(`Lỗi khi lấy danh mục theo ID giới tính ${genderId}:`, error);
            throw error;
        }
    },

    // Lấy danh mục theo slug giới tính
    getCategoriesByGenderSlug: async (genderSlug) => {
        try {
            const response = await axiosClient.get(`/categories/gender/slug/${genderSlug}`);
            return response;
        } catch (error) {
            console.error(`Lỗi khi lấy danh mục theo slug giới tính ${genderSlug}:`, error);
            throw error;
        }
    },

    // Lấy danh mục con theo slug giới tính
    getSubCategoriesByGenderSlug: async (genderSlug) => {
        try {
            const response = await axiosClient.get(`/categories/gender/slug/${genderSlug}/subcategories`);
            return response;
        } catch (error) {
            console.error(`Lỗi khi lấy danh mục con theo slug giới tính ${genderSlug}:`, error);
            throw error;
        }
    },

    // Tạo danh mục mới
    createCategory: async (categoryData) => {
        try {
            const response = await axiosClient.post('/categories', categoryData);
            return response;
        } catch (error) {
            console.error('Lỗi khi tạo danh mục:', error);
            throw error;
        }
    },

    // Cập nhật danh mục
    updateCategory: async (id, categoryData) => {
        try {
            const response = await axiosClient.put(`/categories/${id}`, categoryData);
            return response;
        } catch (error) {
            console.error(`Lỗi khi cập nhật danh mục ${id}:`, error);
            throw error;
        }
    },

    // Xóa danh mục
    deleteCategory: async (id) => {
        try {
            const response = await axiosClient.delete(`/categories/${id}`);
            return response;
        } catch (error) {
            console.error(`Lỗi khi xóa danh mục ${id}:`, error);
            throw error;
        }
    },

    // Lấy danh mục theo ID
    getCategoryById: async (id) => {
        try {
            const response = await axiosClient.get(`/categories/${id}`);
            return response;
        } catch (error) {
            console.error(`Lỗi khi lấy danh mục ${id}:`, error);
            throw error;
        }
    },

    // Tìm kiếm sản phẩm theo từ khóa
    searchCategories: async (keyword, params) => {
        try {
            const response = await axiosClient.get('/categories/search', {
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

    // Chuyển đổi trạng thái danh mục
    toggleCategoryStatus: async (id) => {
        try {
            const response = await axiosClient.patch(`/categories/${id}/toggle`);
            return response;
        } catch (error) {
            console.error(`Lỗi khi chuyển đổi trạng thái danh mục ${id}:`, error);
            throw error;
        }
    }
};

export default CategoryService; 