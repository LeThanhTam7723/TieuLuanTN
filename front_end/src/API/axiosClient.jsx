import axios from 'axios';
import { toast } from 'react-toastify';

const axiosClient = axios.create({
    baseURL: 'http://localhost:8080/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor
axiosClient.interceptors.request.use(
    (config) => {
        const session = JSON.parse(localStorage.getItem('session'));
        if (session?.token) {
            config.headers.Authorization = `Bearer ${session.token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
axiosClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            // Xử lý lỗi 401 (Unauthorized)
            if (error.response.status === 401) {
                localStorage.removeItem('session');
                window.location.href = '/auth/login';
                toast.error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
            }
            // Xử lý lỗi 400 (Bad Request)
            else if (error.response.status === 400) {
                const message = error.response.data?.message || 'Có lỗi xảy ra';
                toast.error(message);
            }
        }
        return Promise.reject(error);
    }
);

export default axiosClient;