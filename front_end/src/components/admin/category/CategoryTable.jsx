// src/components/admin/category/CategoryTable.jsx
import React from 'react';

const CategoryTable = ({ categories, handleToggleStatus, setSelectedCategory, setShowUpdateModal, handleDeleteCategory, setShowImageModal, setSelectedCategoryForImage }) => {
    return (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Tên danh mục</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Mô tả</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Slug</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Danh mục cha</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Hoạt động</th>
                    <th className="px-6 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Hành động</th> {/* Căn giữa tiêu đề */}
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                {categories.map((category) => (
                    <tr key={category.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{category.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{category.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{category.description || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{category.slug}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{category.parentName || 'Không có'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${category.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {category.active ? 'Có' : 'Không'}
                </span>
                            <button
                                onClick={() => handleToggleStatus(category.id)}
                                className="ml-2 text-blue-600 hover:text-blue-800 text-xs"
                                title="Chuyển đổi trạng thái"
                            >
                                Chuyển đổi
                            </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center"> {/* Căn giữa các nút */}
                            <div className="inline-flex items-center justify-center space-x-2"> {/* Thêm container để căn giữa và tạo khoảng cách */}
                                {/* Nút Sửa */}
                                <button
                                    onClick={() => { setSelectedCategory(category); setShowUpdateModal(true); }}
                                    className="text-indigo-600 hover:text-indigo-800 px-2 py-1 rounded-md bg-indigo-50 hover:bg-indigo-100 transition-colors duration-200"
                                    title="Sửa danh mục"
                                >
                                    Sửa
                                </button>
                                {/* Nút Ảnh */}
                                <button
                                    onClick={() => { setSelectedCategoryForImage(category); setShowImageModal(true); }}
                                    className="text-purple-600 hover:text-purple-800 px-2 py-1 rounded-md bg-purple-50 hover:bg-purple-100 transition-colors duration-200"
                                    title="Quản lý hình ảnh"
                                >
                                    Ảnh
                                </button>
                                {/* Nút Xóa */}
                                <button
                                    onClick={() => handleDeleteCategory(category.id)}
                                    className="text-red-600 hover:text-red-800 px-2 py-1 rounded-md bg-red-50 hover:bg-red-100 transition-colors duration-200"
                                    title="Xóa danh mục"
                                >
                                    Xóa
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

export default CategoryTable;
