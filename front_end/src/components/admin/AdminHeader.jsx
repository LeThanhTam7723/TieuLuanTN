import React, {useState, useEffect, useContext} from "react";
import {FiSearch, FiSettings, FiBell, FiMenu, FiX} from "react-icons/fi";
import {FaUserCircle} from "react-icons/fa";
import {
    MdAdminPanelSettings
} from "react-icons/md";
import {useNavigate, Link} from "react-router-dom";
import {introspect, logOutApi} from "../../API/AuthService";
import {FavoriteContext} from "../../contexts/FavoriteContext.jsx";
import {checkAndRefreshSession} from "../../utils/tokenUtils";
import {toast} from "react-toastify";

const AdminHeader = () => {
    const {clearWishlist, setSession, clearCart} = useContext(FavoriteContext);
    const [isOpen, setIsOpen] = useState(false); // State for user avatar dropdown
    const [isMenuOpen, setIsMenuOpen] = useState(false); // State for mobile menu
    const [userAvatar, setUserAvatar] = useState(null);

    // State để lưu trữ thông tin admin
    const [isLogin, setIsLogin] = useState(false);
    const [adminInfo, setAdminInfo] = useState(null);

    const navigate = useNavigate();

    // Kiểm tra session và thông tin admin
    useEffect(() => {
        const checkAdminSession = async () => {
            const currentSession = checkAndRefreshSession();
            if (currentSession) {
                setSession(currentSession);
                setIsLogin(true);
                setAdminInfo(currentSession.currentUser);

                // Kiểm tra quyền admin
                const userRoles = currentSession.currentUser?.roles || [];
                const isAdmin = userRoles.some(role => role.name === "ADMIN");

                if (!isAdmin) {
                    toast.error("Bạn không có quyền truy cập trang admin");
                    navigate('/');
                    return;
                }

                if (currentSession.currentUser?.imageUrl) {
                    setUserAvatar(currentSession.currentUser.imageUrl);
                } else {
                    setUserAvatar(null);
                }
            } else {
                setIsLogin(false);
                toast.error("Vui lòng đăng nhập để truy cập trang admin");
                navigate('/auth/login');
            }
        };

        checkAdminSession();
    }, [navigate, setSession]);

    const handleLogout = async () => {
        try {
            const currentSession = checkAndRefreshSession();
            if (currentSession) {
                await logOutApi({token: currentSession.token});
            }
        } catch (error) {
            console.error("Error during logout:", error);
        } finally {
            setIsOpen(false);
            clearCart();
            localStorage.removeItem("session");
            setIsLogin(false);
            setAdminInfo(null);
            clearWishlist();
            toast.success("Đăng xuất thành công");
            navigate('/auth/login');
        }
    };

    // Admin menu items - Loại bỏ Dashboard
    const adminMenuItems = [
        {name: "Quản lý sản phẩm", icon: <FiSettings/>, link: "/admin/products"},
        {name: "Quản lý danh mục", icon: <FiSettings/>, link: "/admin/categories"},
        {name: "Quản lý người dùng", icon: <FiSettings/>, link: "/admin/users"},
        {name: "Quản lý đơn hàng", icon: <FiSettings/>, link: "/admin/orders"}
    ];

    return (
        <header className="sticky top-0 z-50 bg-white shadow-md backdrop-blur-sm bg-opacity-95">
            {/* Admin Top Bar */}
            <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 py-3">
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <MdAdminPanelSettings className="text-white text-2xl"/>
                        <span className="text-white font-semibold text-lg">Admin Panel</span>
                    </div>

                    <div className="flex items-center space-x-6">
                        {/* Admin User Dropdown */}
                        {isLogin && adminInfo && (
                            <div className="relative">
                                <button
                                    onClick={() => setIsOpen(!isOpen)}
                                    className="flex items-center space-x-2 text-white hover:text-yellow-300 transition-colors duration-300"
                                >
                                    <div
                                        className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-white/30 hover:ring-yellow-300">
                                        {userAvatar ? (
                                            <img
                                                src={userAvatar}
                                                alt="Admin avatar"
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    setUserAvatar(null);
                                                }}
                                            />
                                        ) : (
                                            <FaUserCircle className="w-full h-full text-gray-300"/>
                                        )}
                                    </div>
                                    <span className="font-medium">{adminInfo.username || 'Admin'}</span>
                                </button>

                                {isOpen && (
                                    <div
                                        className="absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                                        <div className="py-2" role="menu">
                                            <div className="px-4 py-2 border-b border-gray-100">
                                                <p className="text-sm font-medium text-gray-900">{adminInfo.username}</p>
                                                <p className="text-xs text-gray-500">{adminInfo.email}</p>
                                            </div>

                                            <Link
                                                to="/profile"
                                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                role="menuitem"
                                                onClick={() => setIsOpen(false)}
                                            >
                                                <FaUserCircle className="mr-3 text-gray-400"/>
                                                Thông tin cá nhân
                                            </Link>

                                            <Link
                                                to="/"
                                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                role="menuitem"
                                                onClick={() => setIsOpen(false)}
                                            >
                                                {/* Đổi icon về trang chủ nếu cần */}
                                                <MdAdminPanelSettings className="mr-3 text-gray-400"/>
                                                Về trang chủ
                                            </Link>

                                            <div className="border-t border-gray-100 my-1"/>

                                            <button
                                                onClick={() => {
                                                    setIsOpen(false);
                                                    handleLogout();
                                                }}
                                                className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                                role="menuitem"
                                            >
                                                Đăng xuất
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Admin Navigation */}
            <nav className="bg-white py-4 border-b border-gray-200">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between">
                        {/* Logo & Title - Liên kết về trang quản lý sản phẩm mặc định */}
                        <div className="flex items-center space-x-4">
                            <Link to="/admin/products"> {/* Thay đổi link từ /admin/dashboard sang /admin/products */}
                                <h1 className="text-2xl font-bold text-indigo-900 hover:text-purple-900 transition-colors duration-300">
                                    Moggo Admin
                                </h1>
                            </Link>
                        </div>

                        {/* Desktop Admin Menu - Adjusted justify-center for centered links */}
                        <div className="hidden lg:flex items-center justify-center flex-1 space-x-8">
                            {adminMenuItems.map((item, index) => (
                                <Link
                                    key={index}
                                    to={item.link}
                                    className="flex items-center space-x-2 text-gray-700 hover:text-indigo-900 font-medium transition-colors duration-300 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-indigo-900 hover:after:w-full after:transition-all after:duration-300"
                                >
                                    <span className="text-lg">{item.icon}</span>
                                    <span>{item.name}</span>
                                </Link>
                            ))}
                        </div>

                        {/* Right section: Mobile Menu Button */}
                        <div className="flex items-center space-x-4">
                            {/* Mobile Menu Button */}
                            <button
                                className="lg:hidden text-gray-600 hover:text-indigo-900 transition-colors duration-300"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                            >
                                {isMenuOpen ? <FiX size={24}/> : <FiMenu size={24}/>}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="lg:hidden fixed inset-0 z-50">
                        <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
                             onClick={() => setIsMenuOpen(false)}/>
                        <div
                            className="absolute top-0 right-0 w-80 h-full bg-white shadow-lg py-6 px-6 transform transition-transform duration-300">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-lg font-semibold text-gray-900">Admin Menu</h3>
                                <button
                                    onClick={() => setIsMenuOpen(false)}
                                    className="text-gray-600 hover:text-indigo-900 transition-colors duration-300"
                                >
                                    <FiX size={24}/>
                                </button>
                            </div>

                            <div className="space-y-4">
                                {adminMenuItems.map((item, index) => (
                                    <Link
                                        key={index}
                                        to={item.link}
                                        className="flex items-center space-x-3 text-gray-700 hover:text-indigo-900 text-lg font-medium py-3 transition-colors duration-300 border-b border-gray-100"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <span className="text-xl">{item.icon}</span>
                                        <span>{item.name}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
};

export default AdminHeader;