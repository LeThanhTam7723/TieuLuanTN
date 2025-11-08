import React, { useState, useEffect, useCallback } from 'react';
import UserService from '../../API/UserService';
import RoleService from '../../API/RoleService';
import UserFormModal from '../../components/admin/user/UserFormModal.jsx';
import UserTable from '../../components/admin/user/UserTable';
import Pagination from '../../components/common/Pagination';
import UserSearchBar from '../../components/admin/user/UserSearchBar';
import CustomMessageBox from '../../components/common/CustomMessageBox';
import UserResetPasswordModal from '../../components/admin/user/UserResetPasswordModal';

const UserManagementPage = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]); // State để lưu danh sách roles
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [showCreateUserModal, setShowCreateUserModal] = useState(false);
    const [showUpdateUserModal, setShowUpdateUserModal] = useState(false);
    const [showResetPasswordModal, setShowResetPasswordModal] = useState(false); // State cho modal reset password
    const [selectedUser, setSelectedUser] = useState(null);
    const [messageBox, setMessageBox] = useState({ show: false, message: '', type: '' });

    const showCustomMessage = useCallback((message, type) => {
        setMessageBox({ show: true, message, type });
        setTimeout(() => {
            setMessageBox({ show: false, message: '', type: '' });
        }, 3000); // Ẩn sau 3 giây
    }, []);

    const fetchRoles = useCallback(async () => {
        try {
            const res = await RoleService.getAllRoles();
            if (res && res.data) {
                setRoles(res.data);
            } else {
                setRoles([]); // Đảm bảo luôn là một mảng
            }
        } catch (err) {
            console.error("Lỗi khi tải danh sách vai trò:", err);
            setError("Không thể tải danh sách vai trò.");
            showCustomMessage("Không thể tải danh sách vai trò.", "error");
        }
    }, [showCustomMessage]);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await UserService.adminSearchUsers(searchTerm, page, size);
            if (res && res.data) {
                setUsers(res.data.content || []);
                setTotalPages(res.data.totalPages || 0);
            } else {
                setUsers([]);
                setTotalPages(0);
            }
        } catch (err) {
            console.error("Lỗi khi tải danh sách người dùng:", err);
            setError("Không thể tải danh sách người dùng.");
            showCustomMessage("Không thể tải danh sách người dùng.", "error");
        } finally {
            setLoading(false);
        }
    }, [searchTerm, page, size, showCustomMessage]);

    useEffect(() => {
        fetchRoles(); // Tải roles khi component mount
    }, [fetchRoles]);

    useEffect(() => {
        fetchUsers(); // Tải người dùng khi component mount hoặc search/page/size thay đổi
    }, [fetchUsers]);

    const handleSearch = (term) => {
        setSearchTerm(term);
        setPage(0); // Reset về trang đầu tiên khi tìm kiếm
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handleSizeChange = (newSize) => {
        setSize(newSize);
        setPage(0); // Reset về trang đầu tiên khi thay đổi kích thước
    };

    const handleCreateUserClick = () => {
        setSelectedUser(null); // Đảm bảo không có user nào được chọn khi tạo mới
        setShowCreateUserModal(true);
    };

    const handleEditUserClick = (user) => {
        setSelectedUser(user);
        setShowUpdateUserModal(true);
    };

    const handleResetPasswordClick = (user) => {
        setSelectedUser(user); // Lưu user để lấy ID
        setShowResetPasswordModal(true);
    };

    const handleSoftDeleteUser = async (userId) => {
        if (window.confirm("Bạn có chắc chắn muốn vô hiệu hóa tài khoản này? Người dùng sẽ không thể đăng nhập.")) {
            try {
                await UserService.deleteUser(userId); // Endpoint xóa mềm đã có sẵn
                showCustomMessage("Người dùng đã được vô hiệu hóa thành công!", "success");
                fetchUsers(); // Tải lại danh sách
            } catch (err) {
                console.error("Lỗi khi vô hiệu hóa người dùng:", err);
                showCustomMessage(`Không thể vô hiệu hóa người dùng: ${err.response?.data?.message || err.message}`, "error");
            }
        }
    };

    const handleToggleActiveStatus = async (user) => {
        const newActiveStatus = !user.active;
        const confirmMessage = newActiveStatus
            ? `Bạn có chắc chắn muốn KÍCH HOẠT lại tài khoản "${user.username}" không?`
            : `Bạn có chắc chắn muốn VÔ HIỆU HÓA tài khoản "${user.username}" không? (Người dùng sẽ không thể đăng nhập)`;

        if (window.confirm(confirmMessage)) {
            try {
                await UserService.toggleUserActiveStatus(user.id);
                showCustomMessage(`Cập nhật trạng thái người dùng thành công!`, "success");
                fetchUsers(); // Tải lại danh sách
            } catch (err) {
                console.error("Lỗi khi cập nhật trạng thái người dùng:", err);
                showCustomMessage(`Không thể cập nhật trạng thái người dùng: ${err.response?.data?.message || err.message}`, "error");
            }
        }
    };


    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Quản lý Người dùng</h1>

            <UserSearchBar
                searchTerm={searchTerm}
                setSearchTerm={handleSearch}
                setShowCreateModal={handleCreateUserClick}
            />

            {messageBox.show && (
                <CustomMessageBox
                    message={messageBox.message}
                    type={messageBox.type}
                    onClose={() => setMessageBox({ ...messageBox, show: false })}
                />
            )}

            {loading ? (
                <div className="text-center text-blue-600 text-lg">Đang tải danh sách người dùng...</div>
            ) : error ? (
                <div className="text-center text-red-600 text-lg">{error}</div>
            ) : users.length === 0 ? (
                <div className="text-center text-gray-600 text-lg">Không tìm thấy người dùng nào.</div>
            ) : (
                <>
                    <UserTable
                        users={users}
                        handleEditUserClick={handleEditUserClick}
                        handleResetPasswordClick={handleResetPasswordClick}
                        handleSoftDeleteUser={handleSoftDeleteUser}
                        handleToggleActiveStatus={handleToggleActiveStatus}
                    />
                    <Pagination
                        page={page}
                        size={size}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        onSizeChange={handleSizeChange}
                    />
                </>
            )}

            {/* Modal Tạo/Cập nhật Người dùng */}
            {(showCreateUserModal || showUpdateUserModal) && (
                <UserFormModal
                    user={selectedUser} // Null khi tạo mới, đối tượng user khi cập nhật
                    roles={roles} // Truyền danh sách roles
                    onClose={() => {
                        setShowCreateUserModal(false);
                        setShowUpdateUserModal(false);
                        setSelectedUser(null);
                        fetchUsers(); // Tải lại danh sách sau khi thêm/sửa
                    }}
                    showCustomMessage={showCustomMessage}
                />
            )}

            {/* Modal Đặt lại mật khẩu */}
            {showResetPasswordModal && selectedUser && (
                <UserResetPasswordModal
                    userId={selectedUser.id}
                    username={selectedUser.username} // Truyền username để hiển thị
                    onClose={() => {
                        setShowResetPasswordModal(false);
                        setSelectedUser(null);
                        // Không cần fetchUsers vì chỉ đổi pass không ảnh hưởng đến hiển thị
                    }}
                    showCustomMessage={showCustomMessage}
                />
            )}
        </div>
    );
};

export default UserManagementPage;