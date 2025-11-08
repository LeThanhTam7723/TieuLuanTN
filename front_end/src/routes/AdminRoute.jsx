import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminRoute = ({ children }) => {
    const { isAdmin, loading } = useAuth();

    if (loading) return <div>Đang kiểm tra quyền truy cập...</div>;

    return isAdmin ? children : <Navigate to="/403" replace />;
};

export default AdminRoute;
