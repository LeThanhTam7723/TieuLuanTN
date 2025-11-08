// src/components/admin/product/ProductTable.jsx
import React from 'react';

const ProductTable = ({
                          products,
                          handleToggleStatus,
                          handleToggleFeatured,
                          handleEditProductClick,
                          handleDeleteProduct,
                          setShowImageModal,
                          setShowVariantModal,
                          setSelectedProduct,
                      }) => {
    return (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Tên sản phẩm</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Giá gốc</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Thương hiệu</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Giới tính</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Nổi bật</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Hoạt động</th>
                    <th className="px-6 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Hành động</th> {/* Căn giữa tiêu đề */}
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.basePrice)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{product.brandName || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{product.genderName || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.featured ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                  {product.featured ? 'Có' : 'Không'}
                </span>
                            <button
                                onClick={() => handleToggleFeatured(product.id)}
                                className="ml-2 text-blue-600 hover:text-blue-800 text-xs"
                                title="Chuyển đổi trạng thái nổi bật"
                            >
                                Chuyển đổi
                            </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {product.active ? 'Có' : 'Không'}
                </span>
                            <button
                                onClick={() => handleToggleStatus(product.id)}
                                className="ml-2 text-blue-600 hover:text-blue-800 text-xs"
                                title="Chuyển đổi trạng thái hoạt động"
                            >
                                Chuyển đổi
                            </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center"> {/* Căn giữa các nút */}
                            <div className="inline-flex items-center justify-center space-x-2"> {/* Thêm container để căn giữa và tạo khoảng cách */}
                                {/* Nút Sửa */}
                                <button
                                    onClick={() => handleEditProductClick(product)}
                                    className="text-indigo-600 hover:text-indigo-800 px-2 py-1 rounded-md bg-indigo-50 hover:bg-indigo-100 transition-colors duration-200"
                                    title="Sửa sản phẩm"
                                >
                                    Sửa
                                </button>
                                {/* Nút Ảnh */}
                                <button
                                    onClick={() => { setSelectedProduct(product); setShowImageModal(true); }}
                                    className="text-green-600 hover:text-green-800 px-2 py-1 rounded-md bg-green-50 hover:bg-green-100 transition-colors duration-200"
                                    title="Quản lý ảnh sản phẩm"
                                >
                                    Ảnh
                                </button>
                                {/* Nút Biến thể */}
                                <button
                                    onClick={() => { setSelectedProduct(product); setShowVariantModal(true); }}
                                    className="text-purple-600 hover:text-purple-800 px-2 py-1 rounded-md bg-purple-50 hover:bg-purple-100 transition-colors duration-200"
                                    title="Quản lý biến thể sản phẩm"
                                >
                                    Biến thể
                                </button>
                                {/* Nút Xóa */}
                                <button
                                    onClick={() => handleDeleteProduct(product.id)}
                                    className="text-red-600 hover:text-red-800 px-2 py-1 rounded-md bg-red-50 hover:bg-red-100 transition-colors duration-200"
                                    title="Xóa sản phẩm"
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

export default ProductTable;
