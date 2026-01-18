import React from 'react';

const UserTable = ({
                       users,
                       handleEditUserClick,
                       handleResetPasswordClick,
                       handleSoftDeleteUser,
                       handleToggleActiveStatus,
                   }) => {
    return (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">ID</th>
                    {/* <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Ảnh</th> */} {/* Đã xóa cột Ảnh */}
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Tên đăng nhập</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Họ và tên</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Số điện thoại</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Trạng thái</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Vai trò</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Hành động</th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.username}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.fullname}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.phone}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                    {user.active ? 'Hoạt động' : 'Vô hiệu hóa'}
                                </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {user.roles && user.roles.length > 0
                                ? user.roles.map(role => role.name).join(', ')
                                : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex gap-2">
                                {/* Nút Sửa */}
                                <button
                                    onClick={() => handleEditUserClick(user)}
                                    className="text-indigo-600 hover:text-indigo-800 px-2 py-1 rounded-md bg-indigo-50 hover:bg-indigo-100 transition-colors duration-200"
                                    title="Sửa thông tin người dùng"
                                >
                                    Sửa
                                </button>
                                {/* Nút Đặt lại mật khẩu */}
                                <button
                                    onClick={() => handleResetPasswordClick(user)}
                                    className="text-blue-600 hover:text-blue-800 px-2 py-1 rounded-md bg-blue-50 hover:bg-blue-100 transition-colors duration-200"
                                    title="Đặt lại mật khẩu"
                                >
                                    Reset Pass
                                </button>
                                {/* Nút Kích hoạt/Vô hiệu hóa */}
                                <button
                                    onClick={() => handleToggleActiveStatus(user)}
                                    className={`px-2 py-1 rounded-md transition-colors duration-200 ${
                                        user.active
                                            ? 'bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-800'
                                            : 'bg-green-50 hover:bg-green-100 text-green-600 hover:text-green-800'
                                    }`}
                                    title={user.active ? "Vô hiệu hóa tài khoản" : "Kích hoạt tài khoản"}
                                >
                                    {user.active ? 'Vô hiệu hóa' : 'Kích hoạt'}
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserTable;