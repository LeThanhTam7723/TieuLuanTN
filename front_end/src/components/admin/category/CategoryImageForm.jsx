// src/components/admin/category/CategoryImageForm.jsx
import React, { useState, useEffect } from 'react';
import CategoryImageService from '../../../API/CategoryImageService'; // Đảm bảo đường dẫn import đúng
import CustomMessageBox from '../../common/CustomMessageBox'; // Đảm bảo đã import

// Add onClose and onSubmit to props
const CategoryImageForm = ({ categoryId, showCustomMessage, onClose, onSubmit }) => {
    const [categoryImage, setCategoryImage] = useState(null); // Chỉ một hình ảnh cho danh mục
    const [showForm, setShowForm] = useState(false); // Trạng thái hiển thị form thêm/sửa
    const [imageFile, setImageFile] = useState(null); // File hình ảnh được chọn để tải lên
    const [altText, setAltText] = useState(''); // Alt text cho hình ảnh
    const [formErrors, setFormErrors] = useState({}); // Lỗi validation của form
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null); // URL để hiển thị preview ảnh

    // Effect để tải hình ảnh khi component mount hoặc categoryId thay đổi
    useEffect(() => {
        const fetchImage = async () => {
            if (categoryId) {
                try {
                    const res = await CategoryImageService.getCategoryImage(categoryId);
                    // console.log("Dữ liệu hình ảnh danh mục fetch được (res.data):", res.data);
                    setCategoryImage(res.data); // Cập nhật state với đối tượng hình ảnh
                    // Nếu có ảnh, tự động điền vào form khi mở để chỉnh sửa
                    if (res.data) {
                        setAltText(res.data.altText || '');
                        setImagePreviewUrl(res.data.imageUrl || null);
                    } else {
                        setAltText('');
                        setImagePreviewUrl(null);
                    }
                    setShowForm(false); // Đóng form khi tải xong
                } catch (error) {
                    // Xử lý lỗi nếu không tìm thấy ảnh (ví dụ: 404)
                    if (error.response && error.response.status === 404) {
                        // console.log("Không tìm thấy ảnh cho danh mục này. Có thể tạo mới.");
                        setCategoryImage(null); // Đảm bảo không có ảnh nào được đặt
                        setAltText('');
                        setImagePreviewUrl(null);
                        setShowForm(false); // Đóng form nếu không có ảnh
                    } else {
                        console.error("Lỗi khi tải hình ảnh danh mục:", error);
                        showCustomMessage("Không thể tải hình ảnh danh mục. Vui lòng kiểm tra console.", "error");
                        setCategoryImage(null);
                    }
                }
            }
        };
        fetchImage();
    }, [categoryId, showCustomMessage]);

    // Xử lý thay đổi input của form
    const handleChange = (e) => {
        const { name, value, type } = e.target;
        if (type === 'file') {
            const file = e.target.files[0];
            setImageFile(file);
            if (file) {
                setImagePreviewUrl(URL.createObjectURL(file)); // Tạo URL tạm thời cho preview
            } else {
                // Nếu người dùng bỏ chọn file, quay lại ảnh hiện có nếu đang chỉnh sửa
                setImagePreviewUrl(categoryImage?.imageUrl || null);
            }
            setFormErrors((prev) => ({ ...prev, imageFile: '' }));
        } else {
            setAltText(value);
            setFormErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
        }
    };

    // Validate form trước khi gửi
    const validateForm = () => {
        let errors = {};
        // File hình ảnh chỉ bắt buộc khi TẠO MỚI (categoryImage không tồn tại)
        if (!categoryImage && !imageFile) {
            errors.imageFile = 'File hình ảnh là bắt buộc khi tạo mới.';
        }
        if (altText && altText.length > 100) {
            errors.altText = 'Alt text không được vượt quá 100 ký tự.';
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Xử lý gửi form (tạo hoặc cập nhật hình ảnh)
    const handleSubmitImage = async (e) => {
        e.preventDefault();

        if (!categoryId) {
            showCustomMessage("Vui lòng tạo danh mục chính trước khi thêm hình ảnh.", "error");
            return;
        }

        if (!validateForm()) {
            return;
        }

        // --- LOGIC MỚI CHO TRƯỜNG HỢP CẬP NHẬT ---
        if (categoryImage) { // Nếu đang ở chế độ chỉnh sửa
            // Kiểm tra xem có thay đổi nào về file hoặc altText không
            const altTextHasChanged = altText !== (categoryImage.altText || '');

            // Nếu không có file mới VÀ không có thay đổi altText
            if (!imageFile && !altTextHasChanged) {
                showCustomMessage('Không có thay đổi nào để cập nhật.', 'info');
                setShowForm(false); // Đóng form nếu không có thay đổi
                // Reset các state về trạng thái ban đầu của ảnh hiện có
                setAltText(categoryImage.altText || '');
                setImagePreviewUrl(categoryImage.imageUrl || null);
                setImageFile(null);
                setFormErrors({});
                return; // Thoát mà không gọi API
            }
        } else { // Nếu là chế độ tạo mới và không có file
            if (!imageFile) {
                showCustomMessage('Vui lòng chọn một hình ảnh để thêm mới.', 'error');
                return;
            }
        }
        // --- KẾT THÚC LOGIC MỚI ---

        const formData = new FormData();
        if (imageFile) { // Chỉ thêm file nếu có file mới được chọn
            formData.append('imageFile', imageFile);
        }
        formData.append('altText', altText);

        try {
            if (categoryImage) {
                await CategoryImageService.updateCategoryImage(categoryId, formData);
                showCustomMessage("Cập nhật hình ảnh danh mục thành công!", "success");
            } else {
                await CategoryImageService.createCategoryImage(categoryId, formData);
                showCustomMessage("Thêm hình ảnh danh mục thành công!", "success");
            }

            const updatedImageRes = await CategoryImageService.getCategoryImage(categoryId);
            setCategoryImage(updatedImageRes.data);

            setImageFile(null);
            setAltText(updatedImageRes.data.altText || '');
            setImagePreviewUrl(updatedImageRes.data.imageUrl || null);
            setFormErrors({});
            setShowForm(false);
            onSubmit();
            onClose();
        } catch (error) {
            console.error("Lỗi khi lưu hình ảnh danh mục:", error);
            showCustomMessage("Lỗi khi lưu hình ảnh danh mục. Vui lòng thử lại.", "error");
        }
    };

    // Xử lý xóa hình ảnh
    const handleDeleteImage = async () => {
        if (window.confirm('Bạn có chắc chắn muốn xóa hình ảnh này không?')) {
            try {
                await CategoryImageService.deleteCategoryImage(categoryId); // Truyền categoryId
                setCategoryImage(null); // Xóa ảnh khỏi state
                setImageFile(null);
                setAltText('');
                setImagePreviewUrl(null);
                setFormErrors({});
                setShowForm(false); // Đóng form sau khi xóa
                showCustomMessage("Xóa hình ảnh danh mục thành công!", "success");
                onSubmit(); // Call onSubmit to notify parent to refresh
                onClose(); // Close the modal
            } catch (error) {
                console.error("Lỗi khi xóa hình ảnh danh mục:", error);
                showCustomMessage("Lỗi khi xóa hình ảnh danh mục. Vui lòng thử lại.", "error");
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md overflow-y-auto max-h-[95vh] transform transition-all duration-300 scale-100 opacity-100">
                <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
                    {categoryImage ? 'Chỉnh sửa hình ảnh danh mục' : 'Thêm hình ảnh danh mục'}
                </h2>

                {categoryId ? (
                    <>
                        {/* Nút thêm/sửa ảnh */}
                        {!showForm && (
                            <button
                                type="button"
                                onClick={() => {
                                    setShowForm(true);
                                    // Nếu đã có ảnh, điền dữ liệu vào form để chỉnh sửa
                                    if (categoryImage) {
                                        setAltText(categoryImage.altText || '');
                                        setImagePreviewUrl(categoryImage.imageUrl || null);
                                    } else {
                                        // Nếu chưa có ảnh, reset form để tạo mới
                                        setAltText('');
                                        setImagePreviewUrl(null);
                                    }
                                    setImageFile(null); // Reset file input
                                    setFormErrors({}); // Reset lỗi
                                }}
                                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 mb-4"
                            >
                                {categoryImage ? 'Chỉnh sửa hình ảnh' : 'Thêm hình ảnh mới'}
                            </button>
                        )}

                        {showForm && (
                            <form onSubmit={handleSubmitImage} className="bg-gray-50 p-6 rounded-lg shadow-inner mb-6">
                                <h4 className="text-xl font-semibold mb-4 text-gray-800">{categoryImage ? 'Chỉnh sửa hình ảnh' : 'Thêm hình ảnh'}</h4>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="categoryImageFile">
                                        File hình ảnh: {categoryImage && <span className="text-gray-500 text-xs">(Để trống nếu không muốn thay đổi ảnh)</span>}
                                    </label>
                                    <input
                                        type="file"
                                        id="categoryImageFile"
                                        name="imageFile"
                                        onChange={handleChange}
                                        className={`shadow-sm appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.imageFile ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    {formErrors.imageFile && <p className="text-red-500 text-xs mt-1">{formErrors.imageFile}</p>}
                                </div>

                                {/* Hiển thị ảnh preview */}
                                {imagePreviewUrl && (
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-semibold mb-2">Ảnh Preview:</label>
                                        <img src={imagePreviewUrl} alt="Image Preview" className="w-32 h-32 object-cover rounded-md border" />
                                    </div>
                                )}

                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="categoryAltText">
                                        Alt Text:
                                    </label>
                                    <input
                                        type="text"
                                        id="categoryAltText"
                                        name="altText"
                                        value={altText}
                                        onChange={handleChange}
                                        className={`shadow-sm appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.altText ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="Mô tả hình ảnh"
                                    />
                                    {formErrors.altText && <p className="text-red-500 text-xs mt-1">{formErrors.altText}</p>}
                                </div>

                                <div className="flex justify-end gap-4 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => { setShowForm(false); setImageFile(null); setAltText(categoryImage?.altText || ''); setImagePreviewUrl(categoryImage?.imageUrl || null); setFormErrors({}); }}
                                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
                                    >
                                        Lưu hình ảnh
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* Hiển thị hình ảnh đã có (nếu có) */}
                        {!showForm && categoryImage ? (
                            <div className="relative border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition duration-200 mt-4 p-4 text-center">
                                <img
                                    src={categoryImage.imageUrl || `https://placehold.co/150x150/e0e0e0/000000?text=No+Image`}
                                    alt={categoryImage.altText || 'Category image'}
                                    className="w-48 h-48 object-cover mx-auto rounded-md"
                                    onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/150x150/e0e0e0/000000?text=Error+Loading+Image`; }}
                                />
                                <div className="p-2 text-center text-sm">
                                    <p className="truncate">{categoryImage.altText || 'Không có mô tả'}</p>
                                    <div className="inline-flex items-center justify-center space-x-2 mt-2">
                                        <button
                                            onClick={() => {
                                                setShowForm(true); // Mở form để chỉnh sửa ảnh này
                                                setAltText(categoryImage.altText || '');
                                                setImagePreviewUrl(categoryImage.imageUrl || null);
                                                setImageFile(null); // Đảm bảo không có file nào được chọn
                                            }}
                                            className="text-indigo-600 hover:text-indigo-800 px-2 py-1 rounded-md bg-indigo-50 hover:bg-indigo-100 transition-colors duration-200"
                                            title="Chỉnh sửa hình ảnh"
                                        >
                                            Sửa
                                        </button>
                                        <button
                                            onClick={handleDeleteImage}
                                            className="text-red-600 hover:text-red-800 px-2 py-1 rounded-md bg-red-50 hover:bg-red-100 transition-colors duration-200"
                                            title="Xóa hình ảnh"
                                        >
                                            Xóa
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            !showForm && !categoryImage && <p className="text-center text-gray-600 mt-4">Chưa có hình ảnh nào cho danh mục này. Vui lòng thêm mới.</p>
                        )}
                    </>
                ) : (
                    <p className="text-center text-gray-600 mt-4">Vui lòng chọn một danh mục để quản lý hình ảnh.</p>
                )}
                {/* Nút Đóng modal, nằm trong div chính của modal */}
                <div className="flex justify-end mt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CategoryImageForm;
