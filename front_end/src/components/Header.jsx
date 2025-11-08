import React, {useState, useEffect, useContext} from "react";
import {FiSearch, FiShoppingCart, FiHeart, FiMenu, FiX, FiMic, FiUser, FiGlobe} from "react-icons/fi";
import {FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaUserCircle} from "react-icons/fa";
import {MdEmail, MdPhone, MdLocationOn} from "react-icons/md";
import {useNavigate, Link} from "react-router-dom";
import {introspect, logOutApi} from "../API/AuthService";
import {FavoriteContext} from "../contexts/FavoriteContext.jsx";
import {checkAndRefreshSession} from "../utils/tokenUtils";
import {toast} from "react-toastify";
import {useTranslation} from 'react-i18next';
import { useAuth } from "../contexts/AuthContext.jsx";

const Header = () => {
    const {t, i18n} = useTranslation();

    const {wishlistItems, clearWishlist, setSession, cartItems, clearCart} = useContext(FavoriteContext);
    const wishlistCount = wishlistItems.length;

    console.log(wishlistItems.length);
    const [isOpen, setIsOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false); // State cho dropdown ngôn ngữ

    const cartCount = cartItems.length;

    const [userAvatar, setUserAvatar] = useState(null);
    const [isListening, setIsListening] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [results, setResults] = useState([]);
    const [isLogin, setIsLogin] = useState(false);

    const {user, isAdmin, loading} = useAuth();
    const navigate = useNavigate();

    const cartClick = () => {
        navigate('/cart')
    };
    const wishlistClick = () => {
        navigate('/wishList')
    }
    const searchProducts = async (q) => {
    if (!q) {
      setResults([]);
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:7700/indexes/products/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer masterKey123" // thay bằng key an toàn hơn khi deploy
        },
        body: JSON.stringify({
          q,             // từ khóa search
          limit: 10      // số kết quả tối đa
        })
      });

      const data = await response.json();
      setResults(data.hits || []);
    } catch (err) {
      console.error("Error searching products:", err);
    }
    };
    useEffect(() => {
        const timeout = setTimeout(() => {
        searchProducts(searchQuery);
        }, 300); // debounce 300ms tránh gọi API quá nhiều

        return () => clearTimeout(timeout);
    }, [searchQuery]);

    useEffect(() => {
        const checkSessionAndRole = async () => {
            const currentSession = checkAndRefreshSession();
            if (currentSession) {
                setSession(currentSession);
                setIsLogin(true);

                const userRoles = user?.roles || [];
                console.log("User roles:", userRoles);

                if (currentSession.currentUser?.imageUrl) {
                    setUserAvatar(user?.imageUrl);
                } else {
                    setUserAvatar(null);
                }

                try {
                    // const response = await listCartItem({
                    //   userId: currentSession.currentUser.id,
                    //   token: currentSession.token
                    // });
                } catch (error) {
                    if (error.response?.status === 401) {
                        handleLogout();
                    } else {
                        console.error("Error fetching cart:", error);
                    }
                }
            } else {
                setIsLogin(false);
                setUserAvatar(null);
            }
        };

        checkSessionAndRole();

        const handleCartUpdate = () => {
            checkSessionAndRole();
        };
        window.addEventListener('cartUpdated', handleCartUpdate);

        return () => {
            window.removeEventListener('cartUpdated', handleCartUpdate);
        };
    }, []);

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
            setIsAdmin(false);
            clearWishlist();
            toast.success(t('header.user_menu.logout_success_toast'));
            navigate('/auth/login');
        }
    };

    const loginClick = () => {
        navigate('/auth/login');
    }

    const menuItems = [
        {name: t('header.categories.men_wear'), link: "/nam"},
        {name: t('header.categories.women_wear'), link: "/nu"},
        {name: t('header.categories.brand_wear'), link: "/brands"}
    ];

    const adminLinks = [
        {name: t('header.user_menu.admin_dashboard_link'), link: "/admin/dashboard"},
    ];

    // Hàm để thay đổi ngôn ngữ
    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        setIsLanguageDropdownOpen(false); // Đóng dropdown sau khi chọn
    };

    // Hàm hiển thị cờ dựa trên ngôn ngữ hiện tại
    const renderCurrentLanguageFlag = () => {
        const currentLang = i18n.language;
        if (currentLang === 'vi') {
            return <span className="fi fi-vn w-5 h-5 rounded-full overflow-hidden mr-2"></span>;
        } else if (currentLang === 'en') {
            return <span className="fi fi-us w-5 h-5 rounded-full overflow-hidden mr-2"></span>;
        }
        return <FiGlobe className="w-5 h-5 mr-2"/>; // Fallback icon
    };

    return (
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100">
            {/* Elegant Top Bar */}
            <div className="bg-gradient-to-r from-slate-900 via-gray-800 to-slate-900 py-3 hidden md:block">
                <div className="container mx-auto px-6">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-8 text-sm">
                            <div
                                className="flex items-center text-gray-300 hover:text-white transition-all duration-300 group">
                                <MdEmail className="mr-2 text-amber-400 group-hover:scale-110 transition-transform"/>
                                <span className="font-light">info@moggo.com</span>
                            </div>
                            <div
                                className="flex items-center text-gray-300 hover:text-white transition-all duration-300 group">
                                <MdPhone className="mr-2 text-amber-400 group-hover:scale-110 transition-transform"/>
                                <span className="font-light">+84 123 456 789</span>
                            </div>
                            <div
                                className="flex items-center text-gray-300 hover:text-white transition-all duration-300 group">
                                <MdLocationOn
                                    className="mr-2 text-amber-400 group-hover:scale-110 transition-transform"/>
                                <span className="font-light">{t('header.top_bar.free_shipping')}</span>
                            </div>
                        </div>

                        <div className="flex items-center space-x-6">
                            {/* Language Switcher - Simple & Clean */}
                            <div className="relative">
                                <button
                                    onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                                    className="flex items-center gap-2 px-2 py-1.5 text-sm text-gray-300 hover:text-white border border-gray-600 rounded-lg hover:border-amber-400 transition-colors duration-200"
                                >
                                    <span className="w-4 h-4">
                                        {renderCurrentLanguageFlag()}
                                    </span>
                                    <span>{i18n.language.toUpperCase()}</span>
                                    <FiGlobe className="w-4 h-4"/>
                                </button>

                                {isLanguageDropdownOpen && (
                                    <div
                                        className="absolute right-0 mt-2 w-38 bg-white rounded-lg shadow-lg border z-50">
                                        <div className="py-1">
                                            <button
                                                onClick={() => changeLanguage('vi')}
                                                className="flex items-center gap-2 w-full px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                <span className="fi fi-vn w-4 h-4"></span>
                                                {t("header.change_language_vi")}
                                            </button>
                                            <button
                                                onClick={() => changeLanguage('en')}
                                                className="flex items-center gap-2 w-full px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                <span className="fi fi-us w-4 h-4"></span>
                                                {t("header.change_language_en_us")}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex space-x-4">
                                {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map((Icon, index) => (
                                    <div key={index} className="relative group">
                                        <Icon
                                            className="text-gray-400 hover:text-white transition-all duration-300 cursor-pointer w-4 h-4 hover:scale-125"/>
                                        <div
                                            className="absolute inset-0 bg-white/20 rounded-full scale-0 group-hover:scale-150 transition-transform duration-300 opacity-0 group-hover:opacity-100"></div>
                                    </div>
                                ))}
                            </div>

                            {isLogin ? (
                                <div className="relative">
                                    <button
                                        onClick={() => setIsOpen(!isOpen)}
                                        className="w-9 h-9 rounded-full overflow-hidden focus:outline-none ring-2 ring-gray-300 hover:ring-amber-400 flex items-center justify-center bg-gradient-to-r from-gray-100 to-gray-200 transition-all duration-300 hover:shadow-lg"
                                    >
                                        {userAvatar ? (
                                            <img
                                                src={userAvatar}
                                                alt="User avatar"
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    setUserAvatar(null);
                                                }}
                                            />
                                        ) : (
                                            <FaUserCircle className="w-full h-full text-gray-500"/>
                                        )}
                                    </button>
                                    {isOpen && (
                                        <div
                                            className="absolute right-0 mt-3 w-56 rounded-xl shadow-2xl bg-white ring-1 ring-black/5 z-50 border border-gray-100 backdrop-blur-sm">
                                            <div className="py-2" role="menu">
                                                <Link
                                                    to="/profile"
                                                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all duration-200"
                                                    role="menuitem"
                                                    onClick={() => setIsOpen(false)}
                                                >
                                                    <FiUser className="mr-3 text-gray-500"/>
                                                    {t('header.user_menu.profile_info')}
                                                </Link>
                                                <Link
                                                    to="/orderHistory"
                                                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all duration-200"
                                                    role="menuitem"
                                                    onClick={() => setIsOpen(false)}
                                                >
                                                    <FiShoppingCart className="mr-3 text-gray-500"/>
                                                    {t('header.user_menu.order_history')}
                                                </Link>
                                                {isAdmin && (
                                                    <>
                                                        <div className="border-t border-gray-200 my-2"/>
                                                        <span
                                                            className="block px-4 py-2 text-xs text-gray-500 font-semibold uppercase tracking-wider">{t('header.user_menu.admin_section_title')}</span>
                                                        {adminLinks.map((item, index) => (
                                                            <Link
                                                                key={index}
                                                                to={item.link}
                                                                className="block px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 transition-all duration-200"
                                                                role="menuitem"
                                                                onClick={() => setIsOpen(false)}
                                                            >
                                                                {item.name}
                                                            </Link>
                                                        ))}
                                                    </>
                                                )}
                                                <div className="border-t border-gray-200 my-2"/>
                                                <button
                                                    onClick={() => {
                                                        setIsOpen(false);
                                                        handleLogout();
                                                    }}
                                                    className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-all duration-200"
                                                    role="menuitem"
                                                >
                                                    {t('header.user_menu.logout_button')}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <button
                                    className="text-sm text-gray-300 hover:text-white transition-all duration-300 flex items-center gap-2 px-4 py-2 rounded-full border border-gray-600 hover:border-amber-400 hover:bg-white/10"
                                    onClick={loginClick}
                                >
                                    <FaUserCircle className="w-4 h-4"/>
                                    <span className="font-light">{t('header.top_bar.login_button')}</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Navigation */}
            <nav className="bg-white/95 py-6">
                <div className="container mx-auto px-6">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <div className="flex items-center">
                            <Link to="/" className="group">
                                <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-gray-800 to-slate-900 bg-clip-text text-transparent hover:from-amber-600 hover:via-orange-500 hover:to-amber-600 transition-all duration-500 tracking-tight">
                                    MOGGO
                                </h1>
                                <div
                                    className="h-0.5 bg-gradient-to-r from-amber-400 to-orange-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                            </Link>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden lg:flex items-center space-x-12">
                            {menuItems.map((item, index) => (
                                <div key={index} className="relative group">
                                    <Link
                                        to={item.link}
                                        className="text-gray-800 hover:text-amber-600 font-medium text-lg transition-all duration-300 relative py-2 px-4 rounded-lg hover:bg-gray-50"
                                    >
                                        {item.name}
                                        <div
                                            className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-amber-400 to-orange-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                                    </Link>
                                </div>
                            ))}
                        </div>

                        {/* Search and Actions */}
                        <div className="flex items-center space-x-6">
                            {/* Enhanced Search */}
                            <div
                                className={`relative group transition-all duration-300 ${isSearchFocused ? 'transform scale-105' : ''}`}>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onFocus={() => setIsSearchFocused(true)}
                                        onBlur={() => setIsSearchFocused(false)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && searchQuery.trim()) {
                                                navigate(`/search?keyword=${encodeURIComponent(searchQuery)}`);
                                            }
                                        }}
                                        placeholder={t('header.search.placeholder')}
                                        className="w-40 lg:w-80 px-5 py-3 pl-12 rounded-full border-2 border-gray-200 focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-100 transition-all duration-300 bg-white/80 backdrop-blur-sm text-gray-800"
                                    />
                                    <FiSearch
                                        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-amber-500 transition-colors duration-300"/>
                                    <button
                                        onClick={() => {
                                            if (searchQuery.trim()) {
                                                navigate(`/search?keyword=${encodeURIComponent(searchQuery)}`);
                                            }
                                        }}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-amber-600 transition-colors duration-300 rounded-full hover:bg-amber-50"
                                    >
                                        <FiSearch className="w-4 h-4"/>
                                    </button>
                                    {isSearchFocused && results.length > 0 && (
                                        <div className="absolute top-full left-0 mt-2 w-full bg-white shadow-lg rounded-lg z-50 max-h-96 overflow-y-auto">
                                        {results.map((p) => {console.log("Product object:", p);return(
                                            <div
                                            key={p.id}
                                            className="flex items-center gap-3 border-b last:border-none p-3 hover:bg-gray-50 cursor-pointer"
                                            onMouseDown={() =>
                                                navigate(`/search?keyword=${encodeURIComponent(p.name)}`)
                                            } // để click item không mất focus input
                                            >
                                            <img
                                                src={p.primaryImageUrl}
                                                alt={p.genderName}
                                                className="w-14 h-14 object-cover rounded"
                                            />
                                            <div className="flex-1">
                                                <h2 className="font-semibold text-sm">{p.name}</h2>
                                                <p className="text-gray-500 text-xs">{p.brandName}</p>
                                                <p className="text-red-500 font-bold text-sm">
                                                {p.basePrice} ₫
                                                </p>
                                            </div>
                                            </div>
                                        )})}
                                        </div>
                                    )}
                                </div>
                            </div>
                        
                            {/* Action Buttons */}
                            <div className="flex items-center space-x-4">
                                <div className="relative group cursor-pointer" onClick={wishlistClick}>
                                    <div
                                        className="p-3 rounded-full bg-gray-50 hover:bg-amber-50 transition-all duration-300 hover:shadow-md">
                                        <FiHeart
                                            className="text-xl text-gray-600 group-hover:text-amber-600 transition-colors duration-300"/>
                                    </div>
                                    {wishlistCount > 0 && (
                                        <div
                                            className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-semibold transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                            {wishlistCount}
                                        </div>
                                    )}
                                </div>

                                <div className="relative group cursor-pointer" onClick={cartClick}>
                                    <div
                                        className="p-3 rounded-full bg-gray-50 hover:bg-amber-50 transition-all duration-300 hover:shadow-md">
                                        <FiShoppingCart
                                            className="text-xl text-gray-600 group-hover:text-amber-600 transition-colors duration-300"/>
                                    </div>
                                    {cartCount > 0 && (
                                        <div
                                            className="absolute -top-1 -right-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-semibold transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                            {cartCount}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Mobile Menu Button */}
                            <button
                                className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-amber-600 hover:bg-gray-50 transition-all duration-300"
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
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                             onClick={() => setIsMenuOpen(false)}/>
                        <div
                            className="absolute top-0 right-0 w-80 h-full bg-white shadow-2xl transform transition-transform duration-300 overflow-y-auto">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-8">
                                    <h2 className="text-xl font-bold text-gray-900">{t('header.mobile_menu.title')}</h2>
                                    <button
                                        onClick={() => setIsMenuOpen(false)}
                                        className="p-2 rounded-full text-gray-600 hover:text-amber-600 hover:bg-gray-100 transition-all duration-300"
                                    >
                                        <FiX size={24}/>
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    {menuItems.map((item, index) => (
                                        <div key={index}>
                                            <Link
                                                to={item.link}
                                                className="block text-gray-800 hover:text-amber-600 text-lg font-medium py-3 px-4 rounded-lg hover:bg-gray-50 transition-all duration-300 border-l-4 border-transparent hover:border-amber-400"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                {item.name}
                                            </Link>
                                        </div>
                                    ))}

                                    {isAdmin && (
                                        <>
                                            <div className="border-t border-gray-200 pt-6 mt-6">
                                                <span
                                                    className="block text-gray-500 text-sm font-semibold uppercase mb-4 tracking-wider">{t('header.user_menu.admin_section_title')}</span>
                                                {adminLinks.map((item, index) => (
                                                    <Link
                                                        key={`admin-mobile-${index}`}
                                                        to={item.link}
                                                        className="block text-gray-800 hover:text-amber-600 text-lg font-medium py-3 px-4 rounded-lg hover:bg-amber-50 transition-all duration-300 border-l-4 border-transparent hover:border-amber-400"
                                                        onClick={() => setIsMenuOpen(false)}
                                                    >
                                                        {item.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        </>
                                    )}

                                    {!isLogin && (
                                        <div className="pt-6 border-t border-gray-200">
                                            <button
                                                onClick={() => {
                                                    setIsMenuOpen(false);
                                                    loginClick();
                                                }}
                                                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
                                            >
                                                {t('header.mobile_menu.login_button')}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
};

export default Header;