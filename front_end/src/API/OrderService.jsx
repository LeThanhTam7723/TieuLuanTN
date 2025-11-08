import {update} from "lodash";
import axiosClient from "./axiosClient";

const OrderService = {
    updateOrder: async (orderId, statusId, token) => {
        return axiosClient.put('/order/update', {orderId, statusId},
            {headers: {Authorization: `Bearer ${token}`}}
        );
    },

    // Lấy danh sách đơn hàng có phân trang cho Admin (endpoint hiện có)
    getAllOrdersForAdmin: async (page = 0, size = 10, token) => {
        try {
            const response = await axiosClient.get(`/order`, {
                params: {page, size},
                headers: {Authorization: `Bearer ${token}`}
            });
            return response.data; // Trả về data ( ApiResponse<PageResponse<OrderResponse>> )
        } catch (error) {
            console.error("Error fetching all orders for admin:", error);
            throw error;
        }
    },

    // Tìm kiếm và lọc đơn hàng cho Admin
    searchAndFilterOrders: async ({ keyword, statusId, startDate, endDate, page, size }) => {
        try {
            const params = {
                keyword: keyword || '',
                statusId: statusId || '',
                startDate: startDate || '',
                endDate: endDate || '',
                page: page,
                size: size
            };
            const response = await axiosClient.get('/order/admin/search', { params });
            return response.data; // ApiResponse
        } catch (error) {
            console.error("Error searching orders:", error);
            throw error;
        }
    },

    // Lấy chi tiết một đơn hàng cho Admin
    getOrderById: async (orderId) => {
        try {
            const response = await axiosClient.get(`/order/admin/${orderId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching order ${orderId}:`, error);
            throw error;
        }
    },

    // Cập nhật trạng thái đơn hàng (sử dụng lại endpoint đã có nhưng cần token)
    updateOrderStatus: async (orderId, newStatusId) => {
        try {
            const response = await axiosClient.put(`/order/${orderId}/status?statusId=${newStatusId}`);
            return response; // ApiResponse
        } catch (error) {
            console.error(`Error updating status for order ${orderId}:`, error);
            throw error;
        }
    }
}
export default OrderService;