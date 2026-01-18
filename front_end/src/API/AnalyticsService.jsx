import axiosClient from "./axiosClient";

const AnalyticsService = {
    getAnalytics: async () => {
        try {
            const response = await axiosClient.get('/analytics/admin');
            return response.data;
        } catch (error) {
            console.error('Lỗi khi lấy số liệu thống kê:', error);
            throw error;
        }
    },
    getRevenueLast6Months: async () => {
        try {
            const response = await axiosClient.get('/analytics/revenue-6-months');
            return response.data;
        } catch (error) {
            console.error('Lỗi khi lấy doanh thu trong 6 tháng:', error);
            throw error;
        }
    },
    getTopSellingVariants: async () => {
        try {
            const response = await axiosClient.get('/analytics/topBestSeller');
            return response.data;
        } catch (error) {
            console.error('Lỗi khi lấy best seller:', error);
            throw error;
        }
    }

};
export  {AnalyticsService};