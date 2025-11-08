import axiosClient from "./axiosClient";

const StatusService = {
    getAllStatuses: async () => {
        try {
            const response = await axiosClient.get("/status/all");
            return response.data;
        } catch (error) {
            console.error("Error fetching statuses:", error);
            throw error;
        }
    }
};

export default StatusService;