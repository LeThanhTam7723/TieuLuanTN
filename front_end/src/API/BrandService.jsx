import axiosClient from './axiosClient';

const BrandService = {
    // Lấy tất cả thuong hiệu
    getAllBrands: async (params) => {
        try {
            const response = await axiosClient.get('/brands', { params });
            return response;
        } catch (error) {
            console.error('Lỗi khi lấy thương hiệu:', error);
            throw error;
        }
    },

    // Lấy thuong hiệu theo ID
    getBrandById: async (brandId) => {
        try {
            const response = await axiosClient.get(`/categories/${brandId}`);
            return response;
        } catch (error) {
            console.error(`Lỗi khi lấy thuong hiệu theo ID ${brandId}:`, error);
            throw error;
        }
    },

    // Lấy thuong hiệu theo tên
    getBrandByName: async (name) => {
        try {
            const response = await axiosClient.get(`/brands/name/${name}`);
            return response;
        } catch (error) {
            console.error(`Lỗi khi lấy thuong hiệu theo tên ${name}:`, error);
            throw error;
        }
    },
};

export default BrandService;