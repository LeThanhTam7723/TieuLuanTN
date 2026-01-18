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
    },
    createDiscount: async (body) => {
        try {
            const response = await axiosClient.post('/discount/create', body);
            return response.data; // trả data trực tiếp
        } catch (error) {
            console.error('Lỗi khi thêm mã giảm giá:', error);
            throw error;
        }
    },
    updateDiscount: async (id,body) => {
        try {
            const response = await axiosClient.put(`/discount/${id}`,body);
            return response.data; // trả data trực tiếp
        } catch (error) {
            console.error('Lỗi khi chỉnh sửa mã giảm giá:', error);
            throw error;
        }
    }
};

export default DiscountService;