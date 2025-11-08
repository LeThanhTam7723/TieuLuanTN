import React from "react";
import {
    MdInventory,
    MdCategory,
    MdPeople,
    MdShoppingCart,
} from "react-icons/md";
import { FiChevronRight } from "react-icons/fi";

const AdminSidebar = ({ activeTab, setActiveTab, isCollapsed, setIsCollapsed }) => {
    const sidebarItems = [
        {
            id: 'products',
            name: 'Quản lý sản phẩm',
            icon: <MdInventory className="w-5 h-5" />,
            badge: null
        },
        {
            id: 'categories',
            name: 'Quản lý danh mục',
            icon: <MdCategory className="w-5 h-5" />,
            badge: null
        },
        {
            id: 'users',
            name: 'Quản lý người dùng',
            icon: <MdPeople className="w-5 h-5" />,
            badge: null
        },
        {
            id: 'orders',
            name: 'Quản lý đơn hàng',
            icon: <MdShoppingCart className="w-5 h-5" />,
            badge: null
        },
    ];

    const handleTabClick = (tabId) => {
        setActiveTab(tabId);
    };

    return (
        <div className={`bg-white shadow-lg transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'} min-h-screen border-r border-gray-200`}>
            {/* Sidebar Header */}
            <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    {!isCollapsed && (
                        <h2 className="text-lg font-semibold text-gray-800">Menu Admin</h2>
                    )}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                    >
                        <FiChevronRight
                            className={`w-4 h-4 text-gray-600 transition-transform duration-300 ${
                                isCollapsed ? 'rotate-0' : 'rotate-180'
                            }`}
                        />
                    </button>
                </div>
            </div>

            {/* Sidebar Menu */}
            <nav className="mt-4 px-2">
                <ul className="space-y-2">
                    {sidebarItems.map((item) => (
                        <li key={item.id}>
                            <button
                                onClick={() => handleTabClick(item.id)}
                                className={`w-full flex items-center justify-between px-3 py-3 rounded-lg transition-all duration-200 group ${
                                    activeTab === item.id
                                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                                        : 'text-gray-700 hover:bg-gray-100 hover:text-indigo-600'
                                }`}
                                title={isCollapsed ? item.name : ''}
                            >
                                <div className="flex items-center space-x-3">
                                    <div className={`flex-shrink-0 ${
                                        activeTab === item.id ? 'text-white' : 'text-gray-500 group-hover:text-indigo-600'
                                    }`}>
                                        {item.icon}
                                    </div>
                                    {!isCollapsed && (
                                        <span className="font-medium text-sm truncate">
                                            {item.name}
                                        </span>
                                    )}
                                </div>

                                {/* Badge */}
                                {!isCollapsed && item.badge && (
                                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                                        activeTab === item.id
                                            ? 'bg-white/20 text-white'
                                            : 'bg-red-100 text-red-600'
                                    }`}>
                                        {item.badge}
                                    </span>
                                )}

                                {/* Collapsed badge */}
                                {isCollapsed && item.badge && (
                                    <div className="absolute top-2 right-2">
                                        <span className="px-1.5 py-0.5 text-xs rounded-full bg-red-500 text-white font-medium">
                                            {item.badge}
                                        </span>
                                    </div>
                                )}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};

export default AdminSidebar;