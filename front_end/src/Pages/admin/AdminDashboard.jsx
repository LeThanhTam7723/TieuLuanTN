import React, {useState, useEffect} from "react";
import {useLocation} from "react-router-dom";
import AdminHeader from "../../components/admin/AdminHeader.jsx";
import AdminSidebar from "../../components/admin/AdminSidebar.jsx";
import ProductManagementPage from "./ProductManagementPage";
import CategoryManagementPage from "./CategoryManagementPage";
import OrderManagementPage from "./OrderManagementPage.jsx";
import {FiChevronRight} from "react-icons/fi";
import UserManagementPage from "./UserManagementPage.jsx";
import Analytics from "./AnalyticsPage.jsx";
import AnalyticsPage from "./AnalyticsPage.jsx";
import ReviewManagement from "./ReviewManagementPage.jsx";
import VoucherPage from "./VoucherPage.jsx";

const AdminDashboard = () => {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('statistical');
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Update activeTab based on URL pathname
    useEffect(() => {
        const pathParts = location.pathname.split('/');
        const currentTab = pathParts[pathParts.length - 1];

        if (['statistical','products', 'categories', 'users', 'orders'].includes(currentTab)) {
            setActiveTab(currentTab);
        } else {
            setActiveTab('statistical');
        }
    }, [location.pathname]);

    // Render main content based on active tab
    const renderMainContent = () => {
        switch (activeTab) {
            case 'statistical':
                return <AnalyticsPage/>;
            case 'products':
                return <ProductManagementPage/>;
            case 'categories':
                return <CategoryManagementPage/>;
            case 'users':
                return <UserManagementPage/>;
            case 'orders':
                return <OrderManagementPage/>;
            case 'reviews':
                return <ReviewManagement/>;
            case 'discounts':
                return <VoucherPage/>;
            default:
                return <ProductManagementPage/>;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <AdminHeader/>

            <div className="flex">
                <AdminSidebar
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    isCollapsed={isCollapsed}
                    setIsCollapsed={setIsCollapsed}
                />

                <main className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-0' : 'ml-0'}`}>
                    <div className="p-6">
                        {renderMainContent()}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;