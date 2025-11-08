import axiosClient from './axiosClient';

const ColorService = {
    // Lấy danh sách tất cả màu
    getAllColors: async () => {
        try {
            const response = await axiosClient.get('/colors');
            return response;
        } catch (error) {
            console.error('Lỗi khi lấy danh sách màu:', error);
            throw error;
        }
    },

    // Lấy màu theo ID
    getColorById: async (id) => {
        try {
            const response = await axiosClient.get(`/colors/${id}`);
            return response;
        } catch (error) {
            console.error(`Lỗi khi lấy màu theo ID (${id}):`, error);
            throw error;
        }
    },

    // Lấy màu theo tên
    getColorByName: async (name) => {
        try {
            const response = await axiosClient.get(`/colors/name/${name}`);
            return response;
        } catch (error) {
            console.error(`Lỗi khi lấy màu theo tên (${name}):`, error);
            throw error;
        }
    }
};

export default ColorService;
