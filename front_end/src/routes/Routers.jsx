import {lazy} from 'react';
import AdminRoute from "./AdminRoute";
import TestPage from "../pages/admin/TestPage.jsx";
import ProductManagementPage from "../pages/admin/ProductManagementPage.jsx";
import CategoryManagementPage from "../pages/admin/CategoryManagementPage.jsx";
import Dashboard from '../pages/admin/AdminDashboard.jsx';
import AdminDashboard from "../pages/admin/AdminDashboard.jsx";
import {Navigate} from "react-router-dom";

const routes = [
    {
        path: '/',
        component: lazy(() => import('../pages/HomePage')),
    },
    {
        path: '/cart',
        component: lazy(() => import('../pages/Cart')),
    },
    {
        path: '/payment',
        component: lazy(() => import('../pages/Payment')),
    },
    {
        path: '/auth/*',
        component: lazy(() => import('../pages/auth/Authentication')),
    },
    {
        path: '/profile',
        component: lazy(() => import('../pages/auth/Profile')),
    },
    {
        path: '/wishList',
        component: lazy(() => import('../pages/product/WishList')),
    },
    {
        path: '/product/:slug',
        component: lazy(() => import('../pages/product/ProductDetailPage')),
    },
    {
        path: '/:genderSlug',
        component: lazy(() => import('../pages/product/CategoryListPage')),
    },
    {
        path: '/collections/:categorySlug',
        component: lazy(() => import('../pages/product/ProductListPage')),
    },
    {
        path: '/category/:brandSlug',
        component: lazy(() => import('../pages/product/ProductListBrand')),
    },
    {
        path: '/search',
        component: lazy(() => import('../pages/product/SearchResultPage')),
    },
    {
      path: '/orderHistory',
      component: lazy(() => import('../pages/OrderHistory')),
    },
    {
        path: '/403',
        component: lazy(() => import('../pages/error/ForbiddenPage')),
    },
    {
        path: '/404',
        component: lazy(() => import('../pages/error/NotFoundPage')),
    },
    {
        path: '/admin/*',
        component: () => (
            <AdminRoute>
              <AdminDashboard/>
            </AdminRoute>
        ),
    },
    {
        path: '*',
        component: () => <Navigate to="/404" replace />,
    },
];

export default routes;
