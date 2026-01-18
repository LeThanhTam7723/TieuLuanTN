// src/components/admin/user/UserFormModal.jsx
import React, { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import UserService from '../../../API/UserService';
import UserInfoForm from './UserInfoForm'; // Import UserInfoForm

// Schema validation cho form người dùng
const userFormSchema = yup.object().shape({
    username: yup.string()
        .required('Tên đăng nhập là bắt buộc')
        .min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự')
        .max(50, 'Tên đăng nhập không quá 50 ký tự'),
    password: yup.string().when('id', { // Password chỉ bắt buộc khi tạo mới (id không tồn tại)
        is: (id) => !id, // Kiểm tra nếu id là null/undefined/0
        then: (schema) => schema
            .required('Mật khẩu là bắt buộc')
            .min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
        otherwise: (schema) => schema.notRequired()
    }),
    fullname: yup.string()
        .required('Họ và tên là bắt buộc')
        .max(100, 'Họ và tên không quá 100 ký tự'),
    email: yup.string()
        .required('Email là bắt buộc')
        .email('Email không hợp lệ')
        .max(45, 'Email không quá 45 ký tự'),
    phone: yup.string()
        .required('Số điện thoại là bắt buộc')
        .matches(/^[0-9]{10,11}$/, 'Số điện thoại không hợp lệ (10 hoặc 11 chữ số)'),
    active: yup.boolean().required('Trạng thái hoạt động là bắt buộc'),
    roleNames: yup.array()
        .of(yup.string())
        .min(1, 'Phải chọn ít nhất một vai trò')
        .required('Vai trò là bắt buộc'),
});

const UserFormModal = ({ user, roles, onClose, showCustomMessage }) => {
    const isEditMode = !!user; // Kiểm tra xem có phải chế độ sửa không

    const methods = useForm({
        resolver: yupResolver(userFormSchema),
        defaultValues: isEditMode ? {
            id: user.id,
            username: user.username,
            fullname: user.fullname,
            email: user.email,
            phone: user.phone,
            active: user.active,
            roleNames: user.roles ? user.roles.map(r => r.name) : [], // Ánh xạ roles thành roleNames
        } : {
            username: '',
            password: '',
            fullname: '',
            email: '',
            phone: '',
            active: true, // Mặc định tài khoản mới là active
            roleNames: [],
        }
    });

    const { handleSubmit, reset } = methods;

    useEffect(() => {
        if (isEditMode && user) {
            reset({
                id: user.id,
                username: user.username,
                fullname: user.fullname,
                email: user.email,
                phone: user.phone,
                active: user.active,
                roleNames: user.roles ? user.roles.map(r => r.name) : [],
            });
        } else {
            reset({
                username: '',
                password: '',
                fullname: '',
                email: '',
                phone: '',
                active: true,
                roleNames: [],
            });
        }
    }, [user, isEditMode, reset]);

    const handleSubmitUser = async (data) => {
        try {
            if (isEditMode) {
                // Cập nhật người dùng
                await UserService.adminUpdateUser(user.id, data);
                showCustomMessage('Cập nhật người dùng thành công!', 'success');
            } else {
                // Tạo người dùng mới
                await UserService.adminCreateUser(data);
                showCustomMessage('Thêm người dùng mới thành công!', 'success');
            }
            onClose(); // Đóng modal sau khi thành công
        } catch (error) {
            console.error('Lỗi khi xử lý người dùng:', error);
            showCustomMessage(`Lỗi: ${error.response?.data?.message || error.message}`, 'error');
        }
    };

    const title = isEditMode ? 'Cập nhật Người dùng' : 'Thêm Người dùng mới';

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl transform transition-all duration-300 scale-95 md:scale-100">
                <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">{title}</h2>
                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(handleSubmitUser)}>
                        <UserInfoForm roles={roles} isEditMode={isEditMode} /> {/* Truyền roles và isEditMode */}

                        <div className="flex justify-end gap-4 mt-6">
                            <button
                                type="button"
                                onClick={onClose}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                {isEditMode ? 'Cập nhật' : 'Thêm người dùng'}
                            </button>
                        </div>
                    </form>
                </FormProvider>
            </div>
        </div>
    );
};

export default UserFormModal;