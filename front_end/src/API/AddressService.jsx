import axiosClient from "./axiosClient";

const AddressService = {
    getAllAddresses: async () => {
        try {
            const response = await axiosClient.get('/address/my');
            return response;
        } catch (error) {
            console.error('Lỗi khi lấy thương hiệu:', error);
            throw error;
        }
    },

};
export default AddressService;