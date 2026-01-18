// src/components/admin/order/UpdateOrderStatusModal.jsx
import React, { useState, useEffect } from 'react';
import StatusService from '../../../API/StatusService'; // Đảm bảo đường dẫn đúng

const UpdateOrderStatusModal = ({ order, onClose, onUpdate }) => {
    // order là đối tượng OrderResponse từ OrderTable, chứa id và idStatus
    const [selectedStatusId, setSelectedStatusId] = useState('');
    const [statuses, setStatuses] = useState([]);
    const [loadingStatuses, setLoadingStatuses] = useState(true);
    const [errorStatuses, setErrorStatuses] = useState(null);

    useEffect(() => {
        const fetchStatuses = async () => {
            setLoadingStatuses(true);
            setErrorStatuses(null);
            try {
                const response = await StatusService.getAllStatuses();
                if (response.code === 0) {
                    setStatuses(response.data);
                    // Đặt trạng thái hiện tại của đơn hàng làm giá trị mặc định cho select box
                    if (order && order.idStatus && order.idStatus.id) {
                        setSelectedStatusId(order.idStatus.id.toString());
                    }
                } else {
                    setErrorStatuses(response.message || "Không thể tải danh sách trạng thái.");
                }
            } catch (error) {
                console.error("Error fetching statuses:", error);
                setErrorStatuses("Lỗi kết nối khi tải trạng thái.");
            } finally {
                setLoadingStatuses(false);
            }
        };
        fetchStatuses();
    }, [order]); // Chạy lại khi order thay đổi (đảm bảo idStatus được set đúng)

    const handleSubmit = (e) => {
        e.preventDefault();
        if (order && selectedStatusId) {
            onUpdate(order.id, parseInt(selectedStatusId));
        } else {
            // Có thể thêm thông báo lỗi nếu cần
            console.warn("Không có đơn hàng hoặc trạng thái được chọn.");
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                {/* Modal Header */}
                <div className="flex justify-between items-center p-5 border-b border-gray-200">
                    <h3 className="text-xl font-bold text-gray-800">Cập nhật Trạng thái Đơn hàng #{order?.id}</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-3xl leading-none"
                    >
                        &times;
                    </button>
                </div>

                {/* Modal Body */}
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="mb-4">
                        <label htmlFor="statusSelect" className="block text-sm font-medium text-gray-700 mb-2">
                            Chọn trạng thái mới:
                        </label>
                        {loadingStatuses ? (
                            <p className="text-gray-600">Đang tải trạng thái...</p>
                        ) : errorStatuses ? (
                            <p className="text-red-600">{errorStatuses}</p>
                        ) : (
                            <select
                                id="statusSelect"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                value={selectedStatusId}
                                onChange={(e) => setSelectedStatusId(e.target.value)}
                                required
                            >
                                <option value="">-- Chọn trạng thái --</option>
                                {statuses.map((status) => (
                                    <option key={status.id} value={status.id}>
                                        {status.name}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    {/* Modal Footer */}
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus-ring-offset-2 focus:ring-blue-500 transition duration-200"
                            disabled={!selectedStatusId || loadingStatuses}
                        >
                            Cập nhật
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateOrderStatusModal;