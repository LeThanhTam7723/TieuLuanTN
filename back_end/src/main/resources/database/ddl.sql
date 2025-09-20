-- Bảng người dùng
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bảng phân quyền
CREATE TABLE roles (
    role_id INT PRIMARY KEY AUTO_INCREMENT,
    role_name VARCHAR(20) UNIQUE NOT NULL
);

-- Bảng phân quyền cho người dùng
CREATE TABLE user_roles (
    user_id INT,
    role_id INT,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (role_id) REFERENCES roles(role_id)
);

-- Bảng địa chỉ
CREATE TABLE addresses (
    address_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    street VARCHAR(255),
    city VARCHAR(50),
    state VARCHAR(50),
    zip_code VARCHAR(20),
    country VARCHAR(50),
    is_default BOOLEAN DEFAULT false,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Bảng danh mục
CREATE TABLE categories (
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    category_name VARCHAR(50) UNIQUE NOT NULL,
    parent_category_id INT,
    FOREIGN KEY (parent_category_id) REFERENCES categories(category_id)
);

-- Bảng sản phẩm
CREATE TABLE products (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    product_name VARCHAR(255) NOT NULL,
    description TEXT,
    base_price DECIMAL(10,2) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bảng liên kết sản phẩm - danh mục
CREATE TABLE product_category (
    product_id INT,
    category_id INT,
    PRIMARY KEY (product_id, category_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id),
    FOREIGN KEY (category_id) REFERENCES categories(category_id)
);

-- Bảng kích thước
CREATE TABLE sizes (
    size_id INT PRIMARY KEY AUTO_INCREMENT,
    size_name VARCHAR(10) UNIQUE NOT NULL
);

-- Bảng màu sắc
CREATE TABLE colors (
    color_id INT PRIMARY KEY AUTO_INCREMENT,
    color_name VARCHAR(20) UNIQUE NOT NULL,
    hex_code VARCHAR(7)
);

-- Bảng tồn kho
CREATE TABLE product_inventory (
    inventory_id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    size_id INT NOT NULL,
    color_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    sku VARCHAR(50) UNIQUE,
    FOREIGN KEY (product_id) REFERENCES products(product_id),
    FOREIGN KEY (size_id) REFERENCES sizes(size_id),
    FOREIGN KEY (color_id) REFERENCES colors(color_id)
);

-- Bảng hình ảnh sản phẩm
CREATE TABLE product_images (
    image_id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    is_primary BOOLEAN DEFAULT false,
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- Bảng đơn hàng
CREATE TABLE orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    address_id INT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    order_status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (address_id) REFERENCES addresses(address_id)
);

-- Bảng chi tiết đơn hàng
CREATE TABLE order_details (
    order_detail_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    inventory_id INT NOT NULL,
    quantity INT NOT NULL,
    price_at_purchase DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (inventory_id) REFERENCES product_inventory(inventory_id)
);

-- Bảng thanh toán
CREATE TABLE payments (
    payment_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    transaction_id VARCHAR(255),
    payment_status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
);

-- Bảng đánh giá
CREATE TABLE reviews (
    review_id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    user_id INT NOT NULL,
    rating TINYINT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(product_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Bảng khuyến mãi
CREATE TABLE promotions (
    promotion_id INT PRIMARY KEY AUTO_INCREMENT,
    promotion_code VARCHAR(20) UNIQUE NOT NULL,
    discount_type ENUM('percentage', 'fixed'),
    discount_value DECIMAL(10,2) NOT NULL,
    start_date DATETIME,
    end_date DATETIME,
    max_uses INT,
    current_uses INT DEFAULT 0
);

-- Bảng sử dụng khuyến mãi
CREATE TABLE user_promotions (
    user_id INT,
    promotion_id INT,
    used_at DATETIME,
    PRIMARY KEY (user_id, promotion_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (promotion_id) REFERENCES promotions(promotion_id)
);

-- Tạo index
CREATE INDEX idx_product_name ON products(product_name);
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_order_date ON orders(created_at);

-- Trigger trừ tồn kho
DELIMITER $$
CREATE TRIGGER after_order_insert
AFTER INSERT ON order_details
FOR EACH ROW
BEGIN
    UPDATE product_inventory 
    SET quantity = quantity - NEW.quantity
    WHERE inventory_id = NEW.inventory_id;
END$$
DELIMITER ;