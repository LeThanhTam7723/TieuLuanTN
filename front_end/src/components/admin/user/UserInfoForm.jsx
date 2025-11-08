// src/components/admin/user/UserInfoForm.jsx
import React from 'react';
import { useFormContext } from 'react-hook-form';

const UserInfoForm = ({ roles, isEditMode }) => {
    const { register, formState: { errors }, watch } = useFormContext();

    // Watch for active status to control UI if needed, though not strictly required for this form
    const watchedActive = watch('active');
    const watchedRoleNames = watch('roleNames');

    return (
        <>
            <h3 className="text-2xl font-semibold mb-4 text-gray-700 border-b pb-2">Thông tin người dùng</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Tên đăng nhập */}
                <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="username">
                        Tên đăng nhập: <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="username"
                        {...register('username')}
                        className={`shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ${errors.username ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Nhập tên đăng nhập"
                        disabled={isEditMode} // Không cho phép sửa username khi chỉnh sửa
                    />
                    {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
                </div>

                {/* Mật khẩu (chỉ khi tạo mới) */}
                {!isEditMode && (
                    <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="password">
                            Mật khẩu: <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="password"
                            id="password"
                            {...register('password')}
                            className={`shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Nhập mật khẩu"
                        />
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                    </div>
                )}

                {/* Họ và tên */}
                <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="fullname">
                        Họ và tên: <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="fullname"
                        {...register('fullname')}
                        className={`shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ${errors.fullname ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Nhập họ và tên"
                    />
                    {errors.fullname && <p className="text-red-500 text-xs mt-1">{errors.fullname.message}</p>}
                </div>

                {/* Email */}
                <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="email">
                        Email: <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        id="email"
                        {...register('email')}
                        className={`shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Nhập email"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>

                {/* Số điện thoại */}
                <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="phone">
                        Số điện thoại: <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="phone"
                        {...register('phone')}
                        className={`shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Nhập số điện thoại"
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                </div>
            </div>

            {/* Checkbox Trạng thái hoạt động */}
            <div className="flex items-center mb-4">
                <input
                    type="checkbox"
                    id="active"
                    {...register('active')}
                    className="mr-2 h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <label className="text-gray-700 text-base font-semibold" htmlFor="active">
                    Tài khoản hoạt động
                </label>
            </div>

            {/* Chọn Vai trò */}
            <div className="mb-6">
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                    Vai trò: <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {roles.map((role) => (
                        <label key={role.name} className="inline-flex items-center text-gray-700">
                            <input
                                type="checkbox"
                                value={role.name}
                                {...register('roleNames')}
                                className="form-checkbox h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-base">{role.name}</span>
                        </label>
                    ))}
                </div>
                {errors.roleNames && <p className="text-red-500 text-xs mt-1">{errors.roleNames.message}</p>}
            </div>
        </>
    );
};

export default UserInfoForm;