import { createContext, useContext, useEffect, useState } from 'react';
import UserService from '../API/UserService'; // Đường dẫn tùy theo project của bạn
import { checkAndRefreshSession } from '../utils/tokenUtils';
import { FavoriteContext } from './FavoriteContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const {session, setSession} = useContext(FavoriteContext);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await UserService.getUserProfile();
                setUser(res.data?.data);
                console.error('Lấy được thông tin người dùng');
            } catch (error) {
                console.error('Lỗi khi lấy thông tin người dùng:', error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [session]);

    const isAdmin = user?.roles?.some(role => role.name === 'ADMIN');

    return (
        <AuthContext.Provider value={{ user, isAdmin, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
