import { create } from "lodash";
import axiosClient from "./axiosClient";

const AddressService = {
    getAllAddresses: async () => {
        try {
            const response = await axiosClient.get('/address/my');
            return response;
        } catch (error) {
            console.error('Lỗi khi lấy ds địa chỉ:', error);
            throw error;
        }
    },
    createAddresses: async(body)=> {
        try {
            const response = await axiosClient.post('/address/create',body);
            return response.data;
        } catch (error) {
            console.error('Lỗi khi thêm địa mới:', error);
            throw error;
        }
    }

};
export default AddressService;