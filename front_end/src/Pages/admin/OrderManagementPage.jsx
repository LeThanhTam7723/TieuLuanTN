import React, {useState, useEffect, useCallback} from 'react';
import OrderService from '../../API/OrderService';
import CustomMessageBox from '../../components/common/CustomMessageBox';
import Pagination from '../../components/common/Pagination';
import {useAuth} from '../../contexts/AuthContext';
import OrderSearchBar from '../../components/admin/order/OrderSearchBar';
import OrderTable from '../../components/admin/order/OrderTable';
import OrderDetailModal from '../../components/admin/order/OrderDetailModal.jsx';
import UpdateOrderStatusModal from '../../components/admin/order/UpdateOrderStatusModal';
import {useNavigate} from 'react-router-dom';

const OrderManagementPage = () => {
    const {user, isAdmin, loading: authLoading} = useAuth();
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true); // Loading riêng cho việc fetch orders
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [searchParams, setSearchParams] = useState({
        keyword: '',
        statusId: '',
        startDate: '',
        endDate: '',
    });

    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);

    const [showUpdateStatusModal, setShowUpdateStatusModal] = useState(false);
    const [orderToUpdate, setOrderToUpdate] = useState(null);

    const [messageBox, setMessageBox] = useState({show: false, message: '', type: ''});

    const showMessage = useCallback((msg, type) => {
        setMessageBox({show: true, message: msg, type});
        setTimeout(() => {
            setMessageBox({show: false, message: '', type: ''});
        }, 3000); // Ẩn sau 3 giây
    }, []);

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        setError(null);

        // Kiểm tra quyền truy cập và trạng thái tải xác thực
        if (authLoading) {
            // Đang tải thông tin auth, chờ đợi
            return;
        }
        if (!isAdmin) {
            setError("Bạn không có quyền truy cập trang này.");
            showMessage("Bạn không có quyền truy cập trang này. Vui lòng liên hệ quản trị viên.", "error");
            setLoading(false);
            // Có thể chuyển hướng về trang chủ hoặc trang lỗi
            navigate('/');
            return;
        }

        try {
            const params = {
                keyword: searchParams.keyword,
                statusId: searchParams.statusId,
                startDate: searchParams.startDate,
                endDate: searchParams.endDate,
                page,
                size,
            };
            const response = await OrderService.searchAndFilterOrders(params);
            if (response.code === 0) {
                setOrders(response.data.content);
                setTotalPages(response.data.totalPages);
                setTotalElements(response.data.totalElements);
            } else {
                setError(response.message || "Failed to fetch orders.");
                showMessage(response.message || "Không thể tải danh sách đơn hàng.", "error");
            }
        } catch (err) {
            console.error("Error fetching orders:", err);
            setError("Lỗi khi tải danh sách đơn hàng.");
            showMessage("Lỗi kết nối hoặc dữ liệu. Vui lòng thử lại.", "error");
        } finally {
            setLoading(false);
        }
    }, [page, size, searchParams, isAdmin, authLoading, navigate, showMessage]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]); // Gọi fetchOrders khi dependencies thay đổi

    const handleSearch = useCallback((newSearchParams) => {
        setSearchParams(newSearchParams);
        setPage(0); // Reset về trang đầu tiên khi tìm kiếm mới
    }, []);

    const handlePageChange = useCallback((newPage) => {
        setPage(newPage);
    }, []);

    const handleViewDetails = useCallback(async (orderId) => {
        if (!isAdmin) {
            showMessage("Bạn không có quyền xem chi tiết đơn hàng.", "error");
            console.error("Access Denied: User is not an admin to view order details.");
            return;
        }
        // Tên biến được đổi thành orderData để phản ánh rõ hơn nội dung của nó.
        // orderData bây giờ sẽ chứa trực tiếp đối tượng OrderResponse DTO từ backend.
        const response = await OrderService.getOrderById(orderId);

        // Kiểm tra xem dữ liệu orderData có hợp lệ không (ví dụ: có ID)
        if (response && response.id) {
            setSelectedOrderDetails(response);
            setShowDetailModal(true);
        } else {
            showMessage("Không thể tải chi tiết đơn hàng. Dữ liệu nhận được không hợp lệ.", "error");
        }
    }, [isAdmin]);

    const handleUpdateStatusClick = useCallback((order) => {
        if (!isAdmin) { // Kiểm tra quyền trước khi mở modal cập nhật
            showMessage("Bạn không có quyền cập nhật trạng thái đơn hàng.", "error");
            return;
        }
        setOrderToUpdate(order);
        setShowUpdateStatusModal(true);
    }, [isAdmin]);

    const handleUpdateStatus = useCallback(async (orderId, newStatusId) => {
        if (!isAdmin) { // Kiểm tra quyền trước khi gửi yêu cầu cập nhật
            showMessage("Bạn không có quyền cập nhật. Vui lòng liên hệ quản trị viên.", "error");
            return;
        }
        try {
            const response = await OrderService.updateOrderStatus(orderId, newStatusId);
            showMessage("Cập nhật trạng thái đơn hàng thành công!", "success");
            setShowUpdateStatusModal(false);
            fetchOrders(); // Tải lại danh sách đơn hàng để hiển thị trạng thái mới
            console.log(response);
        } catch (err) {
            console.error("Error updating order status:", err);
            showMessage(`Lỗi khi cập nhật trạng thái: ${err.response?.data?.message || err.message}`, "error");
        }
    }, [isAdmin, fetchOrders]);


    if (authLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-xl font-semibold text-gray-700">Đang tải thông tin người dùng...</div>
            </div>
        );
    }

    if (!isAdmin) {
        return (
            <div className="flex justify-center items-center h-screen">
                <CustomMessageBox
                    message={message.text || "Bạn không có quyền truy cập trang này."}
                    type={message.type || "error"}
                    onClose={() => {
                        showMessage(false);
                        // Tùy chọn: Chuyển hướng người dùng nếu họ không có quyền
                        // navigate('/');
                    }}
                    show={showMessage || !isAdmin} // Hiển thị ngay nếu không phải admin
                />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Quản lý Đơn hàng</h1>

            <OrderSearchBar onSearch={handleSearch}/>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="text-xl font-semibold text-gray-700">Đang tải đơn hàng...</div>
                </div>
            ) : error ? (
                <div className="text-center text-red-600 text-lg mt-8">{error}</div>
            ) : (
                <>
                    <OrderTable
                        orders={orders}
                        onViewDetails={handleViewDetails}
                        onUpdateStatusClick={handleUpdateStatusClick}
                    />
                    <Pagination
                        page={page}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </>
            )}

            {showDetailModal && (
                <OrderDetailModal
                    order={selectedOrderDetails}
                    onClose={() => setShowDetailModal(false)}
                />
            )}

            {showUpdateStatusModal && (
                <UpdateOrderStatusModal
                    order={orderToUpdate}
                    onClose={() => setShowUpdateStatusModal(false)}
                    onUpdate={handleUpdateStatus}
                />
            )}

            {messageBox.show && (
                <CustomMessageBox
                    message={messageBox.message}
                    type={messageBox.type}
                    onClose={() => setMessageBox({...messageBox, show: false})}
                />
            )}
        </div>
    );
};

export default OrderManagementPage;