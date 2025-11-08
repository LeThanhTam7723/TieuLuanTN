import React, { useState, useEffect } from 'react';
import CategoryService from './../../API/CategoryService';
import CategoryFormModal from '../../components/admin/category/CategoryFormModal';
import CategoryTable from '../../components/admin/category/CategoryTable';
import Pagination from '../../components/common/Pagination';
import CategorySearchBar from '../../components/admin/category/CategorySearchBar';
import CustomMessageBox from '../../components/common/CustomMessageBox';
import CategoryImageForm from '../../components/admin/category/CategoryImageForm'; // Import CategoryImageForm (đã biến thành modal)

const CategoryManagementPage = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [showCreateCategoryModal, setShowCreateCategoryModal] = useState(false);
    const [showUpdateCategoryModal, setShowUpdateCategoryModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    // New states for image management
    const [showImageModal, setShowImageModal] = useState(false);
    const [selectedCategoryForImage, setSelectedCategoryForImage] = useState(null);

    const showCustomMessage = (msg, type = 'success') => {
        setMessage(msg);
        setMessageType(type);
        setTimeout(() => {
            setMessage('');
            setMessageType('');
        }, 3000);
    };

    const fetchCategories = async () => {
        setLoading(true);
        setError(null);
        try {
            let response;
            if (searchTerm) {
                response = await CategoryService.searchCategories(searchTerm, {
                    page,
                    size,
                    sort: 'createdAt,desc'
                });
            } else {
                response = await CategoryService.getAllCategories({
                    page,
                    size,
                    sort: 'createdAt,desc'
                });
            }
            setCategories(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (err) {
            setError('Không thể tải danh sách danh mục. Vui lòng thử lại.');
            showCustomMessage('Không thể tải danh sách danh mục.', 'error');
            console.error('Lỗi khi tải danh mục:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, [page, size, searchTerm]);

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handleCreateCategory = async (id, categoryData) => {
        console.log("Dữ liệu danh mục gửi đi:", categoryData);
        try {
            await CategoryService.createCategory(categoryData);
            setShowCreateCategoryModal(false);
            fetchCategories();
            showCustomMessage('Danh mục đã được tạo thành công!', 'success');
        } catch (err) {
            setError('Không thể tạo danh mục. Vui lòng kiểm tra dữ liệu.');
            showCustomMessage('Không thể tạo danh mục. Vui lòng kiểm tra dữ liệu.', 'error');
            console.error('Lỗi khi tạo danh mục:', err);
        }
    };

    const handleUpdateCategory = async (id, categoryData) => {
        console.log("Dữ liệu danh mục cập nhật gửi đi (ID:", id, "):", categoryData);
        try {
            await CategoryService.updateCategory(id, categoryData);
            setShowUpdateCategoryModal(false);
            setSelectedCategory(null);
            fetchCategories();
            showCustomMessage('Danh mục đã được cập nhật thành công!', 'success');
        } catch (err) {
            setError('Không thể cập nhật danh mục. Vui lòng kiểm tra dữ liệu.');
            showCustomMessage('Không thể cập nhật danh mục. Vui lòng kiểm tra dữ liệu.', 'error');
            console.error('Lỗi khi cập nhật danh mục:', err);
        }
    };

    const handleDeleteCategory = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa danh mục này không?')) {
            try {
                await CategoryService.deleteCategory(id);
                fetchCategories();
                showCustomMessage('Danh mục đã được xóa thành công!', 'success');
            } catch (err) {
                setError('Không thể xóa danh mục. Vui lòng thử lại.');
                showCustomMessage('Không thể xóa danh mục. Vui lòng thử lại.', 'error');
                console.error('Lỗi khi xóa danh mục:', err);
            }
        }
    };

    const handleToggleStatus = async (id) => {
        try {
            await CategoryService.toggleCategoryStatus(id);
            fetchCategories();
            showCustomMessage('Trạng thái danh mục đã được chuyển đổi!', 'success');
        } catch (err) {
            setError('Không thể chuyển đổi trạng thái danh mục.');
            showCustomMessage('Không thể chuyển đổi trạng thái danh mục.', 'error');
            console.error('Lỗi khi chuyển đổi trạng thái:', err);
        }
    };

    // Handler for image modal close and refresh
    const handleImageModalClose = () => {
        setShowImageModal(false);
        setSelectedCategoryForImage(null);
    };

    return (
        <div className="container mx-auto p-4 font-sans antialiased">
            <CustomMessageBox message={message} type={messageType} />

            <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Quản lý danh mục</h1>

            <CategorySearchBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                setShowCreateModal={setShowCreateCategoryModal}
            />

            {loading && <p className="text-center text-gray-600 text-lg py-8">Đang tải danh mục...</p>}
            {error && <p className="text-center text-red-500 text-lg py-8">{error}</p>}

            {!loading && !error && categories.length === 0 && (
                <p className="text-center text-gray-600 text-lg py-8">Không tìm thấy danh mục nào.</p>
            )}

            {!loading && !error && categories.length > 0 && (
                <CategoryTable
                    categories={categories}
                    handleToggleStatus={handleToggleStatus}
                    setSelectedCategory={setSelectedCategory}
                    setShowUpdateModal={setShowUpdateCategoryModal}
                    handleDeleteCategory={handleDeleteCategory}
                    setShowImageModal={setShowImageModal}
                    setSelectedCategoryForImage={setSelectedCategoryForImage}
                />
            )}

            {!loading && !error && categories.length > 0 && (
                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            )}

            {showCreateCategoryModal && (
                <CategoryFormModal
                    title="Thêm danh mục mới"
                    category={null}
                    onSubmit={handleCreateCategory}
                    onClose={() => setShowCreateCategoryModal(false)}
                    showCustomMessage={showCustomMessage}
                />
            )}

            {showUpdateCategoryModal && selectedCategory && (
                <CategoryFormModal
                    title="Cập nhật danh mục"
                    category={selectedCategory}
                    onSubmit={handleUpdateCategory}
                    onClose={() => {
                        setShowUpdateCategoryModal(false);
                        setSelectedCategory(null);
                    }}
                    showCustomMessage={showCustomMessage}
                />
            )}

            {/* Category Image Management Modal */}
            {showImageModal && selectedCategoryForImage && (
                <CategoryImageForm
                    categoryId={selectedCategoryForImage.id}
                    onClose={handleImageModalClose}
                    onSubmit={() => { /* No need to fetch categories here, CategoryImageForm handles its own refresh */ }}
                    showCustomMessage={showCustomMessage}
                />
            )}
        </div>
    );
};

export default CategoryManagementPage;
