// src/API/ProductImageService.jsx
import axiosClient from './axiosClient';

const ProductImageService = {
    // Tạo hình ảnh mới cho sản phẩm.
    createImage: async (productId, formData) => {
        try {
            const response = await axiosClient.post(
                `/products/${productId}/images`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            return response;
        } catch (error) {
            console.error(`Lỗi khi tạo hình ảnh cho sản phẩm ${productId}:`, error);
            throw error;
        }
    },

    // Cập nhật thông tin hình ảnh hoặc thay thế file ảnh.
    updateImage: async (productId, imageId, formData) => {
        try {
            const response = await axiosClient.put(
                `/products/${productId}/images/${imageId}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            return response;
        } catch (error) {
            console.error(`Lỗi khi cập nhật hình ảnh ${imageId} cho sản phẩm ${productId}:`, error);
            throw error;
        }
    },

    // Xóa hình ảnh theo ID.
    deleteImage: async (productId, imageId) => {
        try {
            const response = await axiosClient.delete(`/products/${productId}/images/${imageId}`);
            return response;
        } catch (error) {
            console.error(`Lỗi khi xóa hình ảnh ${imageId} của sản phẩm ${productId}:`, error);
            throw error;
        }
    },

    // Lấy thông tin chi tiết hình ảnh theo ID.
    getImageById: async (productId, imageId) => {
        try {
            const response = await axiosClient.get(`/products/${productId}/images/${imageId}`);
            return response;
        } catch (error) {
            console.error(`Lỗi khi lấy thông tin hình ảnh ${imageId} của sản phẩm ${productId}:`, error);
            throw error;
        }
    },

    // Lấy danh sách hình ảnh của một sản phẩm cụ thể.
    getImagesByProduct: async (productId) => {
        try {
            const response = await axiosClient.get(`/products/${productId}/images`);
            return response; // Trả về toàn bộ response Axios, component sẽ truy cập .data
        } catch (error) {
            console.error(`Lỗi khi lấy danh sách hình ảnh của sản phẩm ${productId}:`, error);
            throw error;
        }
    },

    // Chuyển đổi trạng thái hoạt động của hình ảnh.
    toggleImageStatus: async (productId, imageId) => {
        try {
            const response = await axiosClient.patch(`/products/${productId}/images/${imageId}/toggle`);
            return response;
        } catch (error) {
            console.error(`Lỗi khi chuyển đổi trạng thái hình ảnh ${imageId} của sản phẩm ${productId}:`, error);
            throw error;
        }
    },

    // Đặt hình ảnh làm ảnh chính cho sản phẩm của nó.
    setPrimaryImage: async (productId, imageId) => {
        try {
            const response = await axiosClient.patch(`/products/${productId}/images/${imageId}/set-primary`);
            return response;
        } catch (error) {
            console.error(`Lỗi khi đặt hình ảnh ${imageId} làm ảnh chính cho sản phẩm ${productId}:`, error);
            throw error;
        }
    },

    // Xóa tất cả hình ảnh của sản phẩm.
    deleteImagesByProduct: async (productId) => {
        try {
            const response = await axiosClient.delete(`/products/${productId}/images`);
            return response;
        } catch (error) {
            console.error(`Lỗi khi xóa tất cả hình ảnh của sản phẩm ${productId}:`, error);
            throw error;
        }
    },

    // Lấy danh sách hình ảnh liên kết với một biến thể cụ thể.
    getImagesByVariantId: async (productId, variantId) => {
        try {
            const response = await axiosClient.get(`/products/${productId}/images/variant/${variantId}`);
            return response.data;
        } catch (error) {
            console.error(`Lỗi khi lấy hình ảnh theo biến thể ${variantId} của sản phẩm ${productId}:`, error);
            throw error;
        }
    }
};

export default ProductImageService;
