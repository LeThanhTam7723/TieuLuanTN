import { createContext, useContext, useEffect, useState } from 'react';
import UserService from '../API/UserService'; // Đường dẫn tùy theo project của bạn

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await UserService.getUserProfile();
                setUser(res.data?.data);
            } catch (error) {
                console.error('Lỗi khi lấy thông tin người dùng:', error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const isAdmin = user?.roles?.some(role => role.name === 'ADMIN');

    return (
        <AuthContext.Provider value={{ user, isAdmin, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
