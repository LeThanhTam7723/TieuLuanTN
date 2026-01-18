// src/components/admin/user/UserResetPasswordModal.jsx
import React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import UserService from '../../../API/UserService';

// Schema validation cho đổi mật khẩu
const resetPasswordSchema = yup.object().shape({
    newPassword: yup.string()
        .required('Mật khẩu mới là bắt buộc')
        .min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
    confirmPassword: yup.string()
        .required('Xác nhận mật khẩu là bắt buộc')
        .oneOf([yup.ref('newPassword'), null], 'Mật khẩu xác nhận không khớp'),
});

const UserResetPasswordModal = ({ userId, username, onClose, showCustomMessage }) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(resetPasswordSchema),
        defaultValues: {
            newPassword: '',
            confirmPassword: '',
        }
    });

    const onSubmit = async (data) => {
        try {
            await UserService.adminResetUserPassword(userId, data.newPassword);
            showCustomMessage(`Đặt lại mật khẩu cho người dùng "${username}" thành công!`, 'success');
            onClose(); // Đóng modal
        } catch (error) {
            console.error('Lỗi khi đặt lại mật khẩu:', error);
            showCustomMessage(`Không thể đặt lại mật khẩu: ${error.response?.data?.message || error.message}`, 'error');
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md transform transition-all duration-300 scale-95 md:scale-100">
                <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Đặt lại Mật khẩu cho "{username}"</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="newPassword">
                            Mật khẩu mới: <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="password"
                            id="newPassword"
                            {...register('newPassword')}
                            className={`shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ${errors.newPassword ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Nhập mật khẩu mới"
                        />
                        {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword.message}</p>}
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="confirmPassword">
                            Xác nhận mật khẩu mới: <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            {...register('confirmPassword')}
                            className={`shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Xác nhận mật khẩu mới"
                        />
                        {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
                    </div>

                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Đặt lại
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserResetPasswordModal;