import axiosClient from './axiosClient';

const DiscountService = {
    getAllDiscounts: async () => {
        try {
            const response = await axiosClient.get('/discount');
            return response.data; // trả data trực tiếp
        } catch (error) {
            console.error('Lỗi khi lấy danh sách mã giảm giá:', error);
            throw error;
        }
    }
};

export default DiscountService;