import React, { useState, useEffect } from 'react';
import ProductService from './../../API/ProductService';
import ProductFormModal from '../../components/admin/product/ProductFormModal';
import ProductTable from '../../components/admin/product/ProductTable';
import Pagination from '../../components/common/Pagination';
import ProductSearchBar from '../../components/admin/product/ProductSearchBar';
import CustomMessageBox from '../../components/common/CustomMessageBox';
import ProductImageFormModal from '../../components/admin/product/ProductImageFormModal'; // Import modal ảnh
import ProductVariantFormModal from '../../components/admin/product/ProductVariantFormModal'; // Import modal biến thể

const ProductManagementPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [showCreateProductModal, setShowCreateProductModal] = useState(false);
    const [showUpdateProductModal, setShowUpdateProductModal] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false); // State cho modal ảnh
    const [showVariantModal, setShowVariantModal] = useState(false); // State cho modal biến thể
    const [selectedProduct, setSelectedProduct] = useState(null); // Lưu sản phẩm được chọn cho các modal
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    const showCustomMessage = (msg, type = 'success') => {
        setMessage(msg);
        setMessageType(type);
        setTimeout(() => {
            setMessage('');
            setMessageType('');
        }, 3000);
    };

    const fetchProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            let response;
            if (searchTerm) {
                response = await ProductService.searchProducts(searchTerm, {
                    page,
                    size,
                    sort: 'createdAt,desc'
                });
            } else {
                response = await ProductService.getAllProducts({
                    page,
                    size,
                    sort: 'createdAt,desc'
                });
            }
            setProducts(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (err) {
            setError('Không thể tải danh sách sản phẩm. Vui lòng thử lại.');
            showCustomMessage('Không thể tải danh sách sản phẩm.', 'error');
            console.error('Lỗi khi tải sản phẩm:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [page, size, searchTerm]);

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handleCreateProduct = async (id, productData) => {
        console.log("Dữ liệu sản phẩm gửi đi:", productData);
        try {
            const createdProduct = await ProductService.createProduct(productData);
            setShowCreateProductModal(false);
            fetchProducts();
            showCustomMessage('Sản phẩm đã được tạo thành công!', 'success');
            // Sau khi tạo, có thể chọn sản phẩm vừa tạo để quản lý ảnh/biến thể ngay lập tức
            // setSelectedProduct(createdProduct.data); // Nếu API trả về sản phẩm đã tạo
            // setShowImageModal(true);
        } catch (err) {
            setError('Không thể tạo sản phẩm. Vui lòng kiểm tra dữ liệu.');
            showCustomMessage('Không thể tạo sản phẩm. Vui lòng kiểm tra dữ liệu.', 'error');
            console.error('Lỗi khi tạo sản phẩm:', err);
        }
    };

    const handleUpdateProduct = async (id, productData) => {
        console.log("Dữ liệu sản phẩm cập nhật gửi đi (ID:", id, "):", productData);
        try {
            await ProductService.updateProduct(id, productData);
            setShowUpdateProductModal(false);
            setSelectedProduct(null); // Clear selected product
            fetchProducts();
            showCustomMessage('Sản phẩm đã được cập nhật thành công!', 'success');
        } catch (err) {
            setError('Không thể cập nhật sản phẩm. Vui lòng kiểm tra dữ liệu.');
            showCustomMessage('Không thể cập nhật sản phẩm. Vui lòng kiểm tra dữ liệu.', 'error');
            console.error('Lỗi khi cập nhật sản phẩm:', err);
        }
    };

    // Hàm xử lý khi nhấn nút Sửa trong ProductTable
    const handleEditProductClick = async (productSummary) => {
        setLoading(true);
        try {
            // Lấy chi tiết đầy đủ của sản phẩm
            const fullProductDetails = await ProductService.getProductById(productSummary.id);
            setSelectedProduct(fullProductDetails.data); // Lưu chi tiết đầy đủ vào state
            setShowUpdateProductModal(true); // Hiển thị modal cập nhật
        } catch (err) {
            showCustomMessage('Không thể tải chi tiết sản phẩm để cập nhật.', 'error');
            console.error('Lỗi khi tải chi tiết sản phẩm:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProduct = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?')) {
            try {
                await ProductService.deleteProduct(id);
                fetchProducts();
                showCustomMessage('Sản phẩm đã được xóa thành công!', 'success');
            } catch (err) {
                setError('Không thể xóa sản phẩm. Vui lòng thử lại.');
                showCustomMessage('Không thể xóa sản phẩm. Vui lòng thử lại.', 'error');
                console.error('Lỗi khi xóa sản phẩm:', err);
            }
        }
    };

    const handleToggleStatus = async (id) => {
        try {
            await ProductService.toggleProductStatus(id);
            fetchProducts();
            showCustomMessage('Trạng thái sản phẩm đã được chuyển đổi!', 'success');
        } catch (err) {
            setError('Không thể chuyển đổi trạng thái sản phẩm.');
            showCustomMessage('Không thể chuyển đổi trạng thái sản phẩm.', 'error');
            console.error('Lỗi khi chuyển đổi trạng thái:', err);
        }
    };

    const handleToggleFeatured = async (id) => {
        try {
            await ProductService.toggleFeaturedStatus(id);
            fetchProducts();
            showCustomMessage('Trạng thái nổi bật của sản phẩm đã được chuyển đổi!', 'success');
        } catch (err) {
            setError('Không thể chuyển đổi trạng thái nổi bật.');
            showCustomMessage('Không thể chuyển đổi trạng thái nổi bật.', 'error');
            console.error('Lỗi khi chuyển đổi nổi bật:', err);
        }
    };

    return (
        <div className="container mx-auto p-4 font-sans antialiased">
            <CustomMessageBox message={message} type={messageType} />

            <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Quản lý sản phẩm</h1>

            <ProductSearchBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                setShowCreateModal={setShowCreateProductModal}
            />

            {loading && <p className="text-center text-gray-600 text-lg py-8">Đang tải sản phẩm...</p>}
            {error && <p className="text-center text-red-500 text-lg py-8">{error}</p>}

            {!loading && !error && products.length === 0 && (
                <p className="text-center text-gray-600 text-lg py-8">Không tìm thấy sản phẩm nào.</p>
            )}

            {!loading && !error && products.length > 0 && (
                <ProductTable
                    products={products}
                    handleToggleStatus={handleToggleStatus}
                    handleToggleFeatured={handleToggleFeatured}
                    handleEditProductClick={handleEditProductClick} // Truyền hàm xử lý click sửa
                    handleDeleteProduct={handleDeleteProduct}
                    // Truyền các setters cho modal ảnh và biến thể
                    setShowImageModal={setShowImageModal}
                    setShowVariantModal={setShowVariantModal}
                    setSelectedProduct={setSelectedProduct} // Truyền để cập nhật sản phẩm được chọn
                />
            )}

            {!loading && !error && products.length > 0 && (
                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            )}

            {showCreateProductModal && (
                <ProductFormModal
                    title="Thêm sản phẩm mới"
                    product={null}
                    onSubmit={handleCreateProduct}
                    onClose={() => setShowCreateProductModal(false)}
                    showCustomMessage={showCustomMessage}
                />
            )}

            {showUpdateProductModal && selectedProduct && (
                <ProductFormModal
                    title="Cập nhật sản phẩm"
                    product={selectedProduct} // Truyền chi tiết đầy đủ sản phẩm
                    onSubmit={handleUpdateProduct}
                    onClose={() => {
                        setShowUpdateProductModal(false);
                        setSelectedProduct(null); // Clear selected product khi đóng modal
                        fetchProducts(); // Tải lại danh sách sản phẩm sau khi cập nhật
                    }}
                    showCustomMessage={showCustomMessage}
                />
            )}

            {/* Modal quản lý ảnh */}
            {showImageModal && selectedProduct && (
                <ProductImageFormModal
                    productId={selectedProduct.id}
                    onClose={() => {
                        setShowImageModal(false);
                        setSelectedProduct(null); // Clear selected product khi đóng
                        fetchProducts(); // Refresh product list in case thumbnail changed
                    }}
                    showCustomMessage={showCustomMessage}
                />
            )}

            {/* Modal quản lý biến thể */}
            {showVariantModal && selectedProduct && (
                <ProductVariantFormModal
                    productId={selectedProduct.id}
                    onClose={() => {
                        setShowVariantModal(false);
                        setSelectedProduct(null); // Clear selected product khi đóng
                        fetchProducts(); // Refresh product list in case stock/price changed
                    }}
                    showCustomMessage={showCustomMessage}
                />
            )}
        </div>
    );
};

export default ProductManagementPage;
