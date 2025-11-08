import React from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const OrderTable = ({ orders, onViewDetails, onUpdateStatusClick }) => {
    // Hàm định dạng tiền tệ Việt Nam
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    // Hàm định dạng ngày
    const formatDate = (dateString) => {
        if (!dateString) return '';
        try {
            // Đảm bảo dateString là định dạng YYYY-MM-DD từ backend
            return format(new Date(dateString), 'dd/MM/yyyy', { locale: vi });
        } catch (e) {
            console.error("Error formatting date:", dateString, e);
            return dateString; // Trả về nguyên bản nếu có lỗi
        }
    };

    const getStatusColorClass = (statusName) => {
        switch (statusName) {
            case 'Đang xử lý':
                return 'bg-blue-100 text-blue-800';
            case 'Đã xác nhận':
                return 'bg-yellow-100 text-yellow-800';
            case 'Đang giao hàng':
                return 'bg-purple-100 text-purple-800';
            case 'Đã giao hàng':
                return 'bg-green-100 text-green-800';
            case 'Đã hủy':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        ID Đơn hàng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Người nhận
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Số điện thoại
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Ngày đặt
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Trạng thái
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Hành động
                    </th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {orders.length === 0 ? (
                    <tr>
                        <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                            Không tìm thấy đơn hàng nào.
                        </td>
                    </tr>
                ) : (
                    orders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {order.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                {order.receiver}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                {order.phone}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                {formatDate(order.dateOrder)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                    <span
                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColorClass(order.status.name)}`}
                                    >
                                        {order.status.name}
                                    </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex items-center justify-center space-x-2">
                                    <button
                                        onClick={() => onViewDetails(order.id)}
                                        className="text-blue-600 hover:text-blue-800 px-2 py-1 rounded-md bg-blue-50 hover:bg-blue-100 transition-colors duration-200"
                                        title="Xem chi tiết đơn hàng"
                                    >
                                        Chi tiết
                                    </button>
                                    <button
                                        onClick={() => onUpdateStatusClick(order)}
                                        className="text-indigo-600 hover:text-indigo-800 px-2 py-1 rounded-md bg-indigo-50 hover:bg-indigo-100 transition-colors duration-200"
                                        title="Cập nhật trạng thái"
                                    >
                                        Cập nhật
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
    );
};

export default OrderTable;