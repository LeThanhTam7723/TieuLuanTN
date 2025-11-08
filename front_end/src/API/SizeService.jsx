import axiosClient from './axiosClient';

const SizeService = {
    // Lấy danh sách tất cả kích thước
    getAllSizes: async () => {
        try {
            const response = await axiosClient.get('/sizes');
            return response;
        } catch (error) {
            console.error('Lỗi khi lấy danh sách size:', error);
            throw error;
        }
    },

    // Lấy size theo ID
    getSizeById: async (id) => {
        try {
            const response = await axiosClient.get(`/sizes/${id}`);
            return response;
        } catch (error) {
            console.error(`Lỗi khi lấy size theo ID (${id}):`, error);
            throw error;
        }
    },

    // Lấy size theo tên
    getSizeByName: async (name) => {
        try {
            const response = await axiosClient.get(`/sizes/name/${name}`);
            return response;
        } catch (error) {
            console.error(`Lỗi khi lấy size theo tên (${name}):`, error);
            throw error;
        }
    }
};

export default SizeService;
