import { useState, useEffect, useCallback } from 'react';

const CART_STORAGE_KEY = 'shopping_cart';

export const useCart = () => {
  const [cart, setCart] = useState(() => {
    // Lấy dữ liệu giỏ hàng từ localStorage khi khởi tạo
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Lưu giỏ hàng vào localStorage mỗi khi có thay đổi
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  // Thêm sản phẩm vào giỏ hàng
  const addToCart = useCallback((product) => {
    setCart(prevCart => {
      // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
      const existingItemIndex = prevCart.findIndex(
        item => 
          item.id === product.id && 
          item.variant.color.id === product.variant.color.id &&
          item.variant.size.id === product.variant.size.id
      );

      if (existingItemIndex > -1) {
        // Nếu đã có, tăng số lượng
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += product.quantity;
        return newCart;
      } else {
        // Nếu chưa có, thêm mới
        return [...prevCart, product];
      }
    });
  }, []);

  // Cập nhật số lượng sản phẩm
  const updateQuantity = useCallback((productId, variantId, quantity) => {
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === productId && item.variant.id === variantId
          ? { ...item, quantity: Math.max(0, quantity) }
          : item
      ).filter(item => item.quantity > 0) // Xóa sản phẩm có số lượng = 0
    );
  }, []);

  // Xóa sản phẩm khỏi giỏ hàng
  const removeFromCart = useCallback((productId, variantId) => {
    setCart(prevCart => 
      prevCart.filter(item => 
        !(item.id === productId && item.variant.id === variantId)
      )
    );
  }, []);

  // Xóa toàn bộ giỏ hàng
  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  // Tính tổng số lượng sản phẩm trong giỏ hàng
  const getTotalItems = useCallback(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  // Tính tổng tiền
  const getTotalAmount = useCallback(() => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [cart]);

  return {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotalItems,
    getTotalAmount
  };
}; 