import axiosClient from './axiosClient';

const RoleService = {
    getAllRoles: async () => {
        try {
            const response = await axiosClient.get('/roles');
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default RoleService;