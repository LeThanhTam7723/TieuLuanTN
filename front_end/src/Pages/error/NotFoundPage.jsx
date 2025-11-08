import { Link } from 'react-router-dom';

const ForbiddenPage = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
            <h1 className="text-5xl font-bold text-red-600 mb-4">404</h1>
            <p className="text-xl text-gray-700 mb-6">
                Không tìm thấy trang.
            </p>
            <Link to="/" className="text-blue-600 underline hover:text-blue-800">
                Quay lại trang chủ
            </Link>
        </div>
    );
};

export default ForbiddenPage;
