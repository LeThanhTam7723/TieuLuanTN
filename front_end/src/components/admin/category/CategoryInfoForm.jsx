// src/components/admin/category/CategoryInfoForm.jsx
import React from 'react';
import { useFormContext } from 'react-hook-form';

const CategoryInfoForm = ({ allCategories, genders }) => {
    const { register, formState: { errors } } = useFormContext();

    return (
        <>
            <h3 className="text-2xl font-semibold mb-4 text-gray-700 border-b pb-2">Thông tin danh mục</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Tên danh mục */}
                <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="name">
                        Tên danh mục: <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="name"
                        {...register('name')}
                        className={`shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Nhập tên danh mục"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>

                {/* Slug */}
                <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="slug">
                        Slug: <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="slug"
                        {...register('slug')}
                        className={`shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ${errors.slug ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Nhập slug (ví dụ: thoi-trang-nam)"
                    />
                    {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>}
                </div>

                {/* Danh mục cha */}
                <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="parentId">
                        Danh mục cha (tùy chọn):
                    </label>
                    <select
                        id="parentId"
                        {...register('parentId')}
                        className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 border-gray-300"
                    >
                        <option value="">-- Không có danh mục cha --</option>
                        {allCategories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                    {errors.parentId && <p className="text-red-500 text-xs mt-1">{errors.parentId.message}</p>}
                </div>

                {/* TRƯỜNG GIỚI TÍNH */}
                <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="genderId">
                        Giới tính (tùy chọn):
                    </label>
                    <select
                        id="genderId"
                        {...register('genderId')}
                        className={`shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ${errors.genderId ? 'border-red-500' : 'border-gray-300'}`}
                    >
                        <option value="">-- Chọn giới tính --</option>
                        {genders.map((gender) => (
                            <option key={gender.id} value={gender.id}>
                                {gender.name}
                            </option>
                        ))}
                    </select>
                    {errors.genderId && <p className="text-red-500 text-xs mt-1">{errors.genderId.message}</p>}
                </div>

                {/* TRƯỜNG HOẠT ĐỘNG (ACTIVE) */}
                <div className="md:col-span-2 flex items-center mt-2">
                    <input
                        type="checkbox"
                        id="active"
                        {...register('active')}
                        className={`form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500 transition duration-200 ${errors.active ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    <label className="ml-2 block text-gray-700 text-sm font-semibold" htmlFor="active">
                        Hoạt động
                    </label>
                    {errors.active && <p className="text-red-500 text-xs mt-1">{errors.active.message}</p>}
                </div>


                {/* Mô tả */}
                <div className="col-span-2">
                    <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="description">
                        Mô tả:
                    </label>
                    <textarea
                        id="description"
                        {...register('description')}
                        rows="3"
                        className={`shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Nhập mô tả danh mục"
                    ></textarea>
                    {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
                </div>
            </div>
        </>
    );
};

export default CategoryInfoForm;
