import axiosClient from "./axiosClient";

const CheckOutService = {
    addOrder: async(body) => {
        try {
            const response = await axiosClient.post(`/order/add`,body);
            return response;
        } catch (error) {
            console.error(`Đặt hàng không thành công`);
            console.error(body.orderItems);
            throw error;
        }

    },
    vnPay: async (amount,orderId) => {
        try {
            const response = await axiosClient.get(`/payment/vnpay`,{params:{amount,orderId}});
            return response;
        } catch (error) {
            console.error(`Đặt hàng không thành công`);
            throw error;
        }
    }
}

export default CheckOutService;