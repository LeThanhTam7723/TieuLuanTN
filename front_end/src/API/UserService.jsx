import axiosClient from './axiosClient';

const UserService = {
    // Lấy thông tin profile của user hiện tại
    getUserProfile: async () => {
        try {
            const response = await axiosClient.get('/users/me');
            return response;
        } catch (error) {
            throw error;
        }
    },

    // Cập nhật thông tin profile
    updateUserProfile: async (data) => {
        try {
            const response = await axiosClient.put('/users/me', data);
            return response;
        } catch (error) {
            throw error;
        }
    },

    // Đổi mật khẩu
    changePassword: async (data) => {
        try {
            const response = await axiosClient.put('/users/me/password', data, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return response;
        } catch (error) {
            throw error;
        }
    },

    // Cập nhật avatar
    updateAvatar: async (file) => {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await axiosClient.put('/users/me/avatar', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response;
        } catch (error) {
            throw error;
        }
    },

    // Xóa mềm người dùng (chỉ dành cho admin)
    deleteUser: async (userId) => {
        try {
            const response = await axiosClient.delete(`/users/${userId}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    // --- Các phương thức dành cho Admin ---

    // Thêm người dùng mới bởi Admin
    adminCreateUser: async (userData) => {
        try {
            const response = await axiosClient.post('/users/admin/create', userData);
            return response;
        } catch (error) {
            throw error;
        }
    },

    // Cập nhật thông tin người dùng bởi Admin
    adminUpdateUser: async (userId, updatedData) => {
        try {
            const response = await axiosClient.put(`/users/admin/${userId}`, updatedData);
            return response;
        } catch (error) {
            throw error;
        }
    },

    // Đặt lại mật khẩu người dùng bởi Admin
    adminResetUserPassword: async (userId, newPassword) => {
        try {
            const response = await axiosClient.put(`/users/admin/${userId}/reset-password?newPassword=${newPassword}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    // Tìm kiếm người dùng bởi Admin (không phân biệt tài khoản bị vô hiệu hóa)
    adminSearchUsers: async (keyword = '', page = 0, size = 10, sort = '') => {
        try {
            const params = new URLSearchParams({ page, size });
            if (keyword) params.append('keyword', keyword);
            if (sort) params.append('sort', sort);

            const response = await axiosClient.get(`/users/admin/search?${params.toString()}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Phương thức mới để bật/tắt trạng thái active
    toggleUserActiveStatus: async (userId) => {
        try {
            // Backend trả về void, chúng ta chỉ cần biết request thành công
            const response = await axiosClient.patch(`/users/${userId}/toggle-active`);
            return response; // response này có thể trống hoặc là object rỗng
        } catch (error) {
            throw error;
        }
    }
};

export default UserService;