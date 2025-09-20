-- Thêm vai trò
INSERT INTO roles (role_name) VALUES 
('admin'),
('manager'),
('customer');

-- Thêm người dùng
INSERT INTO users (username, email, password_hash, first_name, last_name) VALUES
('john_doe', 'john.doe@email.com', 'hashed_password_123', 'John', 'Doe'),
('jane_smith', 'jane.smith@email.com', 'hashed_password_456', 'Jane', 'Smith');

-- Thêm phân quyền
INSERT INTO user_roles (user_id, role_id) VALUES
(1, 1), -- John là admin
(2, 3); -- Jane là customer

-- Thêm địa chỉ
INSERT INTO addresses (user_id, street, city, state, zip_code, country, is_default) VALUES
(1, '123 Main St', 'New York', 'NY', '10001', 'USA', true),
(2, '456 Oak Ave', 'Los Angeles', 'CA', '90001', 'USA', true);

-- Thêm danh mục
INSERT INTO categories (category_name, parent_category_id) VALUES
('Áo', NULL),
('Quần', NULL),
('Áo thun', 1),
('Jeans', 2);

-- Thêm sản phẩm
INSERT INTO products (product_name, description, base_price) VALUES
('Áo thun basic', 'Chất liệu cotton 100%', 15.99),
('Quần jeans slim-fit', 'Dáng ôm hiện đại', 49.99);

-- Liên kết sản phẩm - danh mục
INSERT INTO product_category (product_id, category_id) VALUES
(1, 3),
(2, 4);

-- Thêm kích thước
INSERT INTO sizes (size_name) VALUES
('S'),
('M'),
('L'),
('XL');

-- Thêm màu sắc
INSERT INTO colors (color_name, hex_code) VALUES
('Đỏ', '#FF0000'),
('Xanh dương', '#0000FF');

-- Thêm tồn kho
INSERT INTO product_inventory (product_id, size_id, color_id, quantity, sku) VALUES
(1, 2, 1, 100, 'TSHIRT-M-RED'),
(2, 3, 2, 50, 'JEANS-L-BLUE');

-- Thêm hình ảnh
INSERT INTO product_images (product_id, image_url, is_primary) VALUES
(1, 'https://example.com/tshirt1.jpg', true),
(2, 'https://example.com/jeans1.jpg', true);

-- Thêm đơn hàng
INSERT INTO orders (user_id, address_id, total_amount, order_status) VALUES
(2, 2, 65.98, 'processing');

-- Thêm chi tiết đơn hàng
INSERT INTO order_details (order_id, inventory_id, quantity, price_at_purchase) VALUES
(1, 1, 2, 15.99),
(1, 2, 1, 49.99);

-- Thêm thanh toán
INSERT INTO payments (order_id, amount, payment_method, transaction_id, payment_status) VALUES
(1, 65.98, 'credit_card', 'TXN123456', 'completed');

-- Thêm đánh giá
INSERT INTO reviews (product_id, user_id, rating, comment) VALUES
(1, 2, 5, 'Áo mặc rất thoải mái!');

-- Thêm khuyến mãi
INSERT INTO promotions (promotion_code, discount_type, discount_value, start_date, end_date, max_uses) VALUES
('SALE10', 'percentage', 10.00, '2023-10-01', '2023-12-31', 1000);

-- Thêm sử dụng khuyến mãi
INSERT INTO user_promotions (user_id, promotion_id, used_at) VALUES
(2, 1, NOW());