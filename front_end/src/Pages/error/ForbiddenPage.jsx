import { Link } from 'react-router-dom';

const ForbiddenPage = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
            <h1 className="text-5xl font-bold text-red-600 mb-4">403</h1>
            <p className="text-xl text-gray-700 mb-6">
                Bạn không có quyền truy cập vào trang này.
            </p>
            <Link to="/" className="text-blue-600 underline hover:text-blue-800">
                Quay lại trang chủ
            </Link>
        </div>
    );
};

export default ForbiddenPage;
