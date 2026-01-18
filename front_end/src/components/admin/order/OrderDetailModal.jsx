import React from 'react';

const OrderDetailModal = ({ order, onClose }) => {
    // Đảm bảo order và các thuộc tính lồng nhau được kiểm tra trước khi truy cập
    if (!order) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto transform scale-95 animate-scale-in">
                <div className="p-8">
                    <h2 className="text-4xl font-extrabold mb-7 text-indigo-800 border-b-2 border-indigo-200 pb-4">
                        Chi tiết đơn hàng <span className="text-indigo-600">#{order.id}</span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        {/* Thông tin đơn hàng */}
                        <div className="bg-blue-50 p-6 rounded-lg shadow-inner">
                            <h3 className="text-2xl font-bold mb-4 text-blue-700 border-b border-blue-200 pb-2">Thông tin chung</h3>
                            <p className="text-gray-800 mb-2"><strong className="text-gray-900">Người nhận:</strong> {order.receiver}</p>
                            <p className="text-gray-800 mb-2"><strong className="text-gray-900">Địa chỉ:</strong> {order.address}</p>
                            <p className="text-gray-800 mb-2"><strong className="text-gray-900">Số điện thoại:</strong> {order.phone}</p>
                            <p className="text-gray-800 mb-2"><strong className="text-gray-900">Ngày đặt hàng:</strong> {order.dateOrder}</p>
                            <p className="text-gray-800 mb-2"><strong className="text-gray-900">Phương thức thanh toán:</strong> {order.paymentMethod?.typePayment || 'N/A'}</p>
                            <p className="text-gray-800 mb-2"><strong className="text-gray-900">Tổng giá trị đơn hàng:</strong> <span className="font-bold text-green-700">{order.totalOrderValue?.toLocaleString('vi-VN')} VNĐ</span></p>
                            <p className="text-gray-800 mb-2">
                                <strong className="text-gray-900">Trạng thái:</strong>
                                <span className={`ml-2 px-3 py-1 rounded-full text-sm font-semibold ${
                                    order.status?.name === 'Chờ xử lý' ? 'bg-yellow-100 text-yellow-800' :
                                        order.status?.name === 'Đã xác nhận' ? 'bg-blue-100 text-blue-800' :
                                            order.status?.name === 'Đang giao hàng' ? 'bg-purple-100 text-purple-800' :
                                                order.status?.name === 'Đã giao' ? 'bg-green-100 text-green-800' :
                                                    order.status?.name === 'Đã hủy' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                                }`}>
                                    {order.status?.name || 'Không xác định'}
                                </span>
                            </p>
                        </div>

                        {/* Thông tin khách hàng */}
                        <div className="bg-green-50 p-6 rounded-lg shadow-inner">
                            <h3 className="text-2xl font-bold mb-4 text-green-700 border-b border-green-200 pb-2">Thông tin khách hàng</h3>
                            <p className="text-gray-800 mb-2"><strong className="text-gray-900">Tên đăng nhập:</strong> {order.user?.username || 'N/A'}</p>
                            <p className="text-gray-800 mb-2"><strong className="text-gray-900">Email:</strong> {order.user?.email || 'N/A'}</p>
                            <p className="text-gray-800 mb-2"><strong className="text-gray-900">Họ và tên:</strong> {order.user?.fullname || 'N/A'}</p>
                            <p className="text-gray-800 mb-2"><strong className="text-gray-900">Số điện thoại:</strong> {order.user?.phone || 'N/A'}</p>
                        </div>
                    </div>

                    {/* Chi tiết sản phẩm trong đơn hàng */}
                    <h3 className="text-2xl font-bold mb-4 text-indigo-700 border-b-2 border-indigo-200 pb-2 mt-6">Sản phẩm trong đơn hàng</h3>
                    <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
                        {order.orderDetails && order.orderDetails.length > 0 ? (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Tên sản phẩm</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Kích cỡ</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Màu sắc</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Số lượng</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Đơn giá</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Thành tiền</th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {order.orderDetails.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {item.idProduct?.product?.name || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {item.idProduct?.size?.name || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {item.idProduct?.color?.name || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {item.quantity}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {item.idProduct?.price?.toLocaleString('vi-VN') || '0'} VNĐ
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">
                                            {item.totalPrice?.toLocaleString('vi-VN') || '0'} VNĐ
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-center text-gray-600 py-6">Không có sản phẩm nào trong đơn hàng này.</p>
                        )}
                    </div>

                    <div className="flex justify-end mt-8">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailModal;