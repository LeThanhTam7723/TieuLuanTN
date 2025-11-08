import { useState, useMemo } from 'react';

export const useVariantSelection = (product, onVariantChange) => {
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  // Đảm bảo variants là một mảng
  const variants = useMemo(() => {
    if (!product?.variants || !Array.isArray(product.variants)) {
      return [];
    }
    return product.variants.filter(variant => variant.active);
  }, [product?.variants]);

  // Lấy danh sách màu sắc duy nhất
  const availableColors = useMemo(() => {
    const colorSet = new Set();
    const colors = [];

    variants.forEach(variant => {
      const colorKey = `${variant.color.id}-${variant.color.name}`;
      if (!colorSet.has(colorKey)) {
        colorSet.add(colorKey);
        colors.push({
          ...variant.color,
          available: variants.some(v => 
            v.color.id === variant.color.id && 
            v.active && 
            v.stockQuantity > 0
          )
        });
      }
    });

    return colors;
  }, [variants]);

  // Lấy danh sách kích thước khả dụng cho màu đã chọn
  const availableSizes = useMemo(() => {
    if (!selectedColor) return [];

    const sizeSet = new Set();
    const sizes = [];

    variants.forEach(variant => {
      if (
        variant.color.id === selectedColor.id &&
        variant.active &&
        variant.stockQuantity > 0
      ) {
        const sizeKey = `${variant.size.id}-${variant.size.name}`;
        if (!sizeSet.has(sizeKey)) {
          sizeSet.add(sizeKey);
          sizes.push(variant.size);
        }
      }
    });

    return sizes;
  }, [variants, selectedColor]);

  // Kiểm tra xem biến thể có khả dụng không
  const isVariantAvailable = (color, size) => {
    if (!color || !size) return false;
    return variants.some(
      variant =>
        variant.color.id === color.id &&
        variant.size.id === size.id &&
        variant.active &&
        variant.stockQuantity > 0
    );
  };

  // Xử lý khi chọn màu sắc
  const handleColorChange = (color) => {
    setSelectedColor(color);
    setSelectedSize(null); // Reset kích thước khi đổi màu

    // Tìm biến thể đầu tiên khả dụng cho màu này
    const firstAvailableVariant = variants.find(
      variant =>
        variant.color.id === color.id &&
        variant.active &&
        variant.stockQuantity > 0
    );

    if (firstAvailableVariant) {
      setSelectedSize(firstAvailableVariant.size);
      onVariantChange?.(firstAvailableVariant);
    } else {
      onVariantChange?.(null);
    }
  };

  // Xử lý khi chọn kích thước
  const handleSizeChange = (size) => {
    setSelectedSize(size);

    // Tìm biến thể tương ứng với màu và kích thước đã chọn
    const variant = variants.find(
      variant =>
        variant.color.id === selectedColor?.id &&
        variant.size.id === size.id &&
        variant.active
    );

    onVariantChange?.(variant || null);
  };

  // Lấy biến thể đã chọn
  const selectedVariant = useMemo(() => {
    if (!selectedColor || !selectedSize) return null;
    return variants.find(
      variant =>
        variant.color.id === selectedColor.id &&
        variant.size.id === selectedSize.id &&
        variant.active
    );
  }, [variants, selectedColor, selectedSize]);

  return {
    selectedColor,
    selectedSize,
    availableColors,
    availableSizes,
    handleColorChange,
    handleSizeChange,
    isVariantAvailable,
    selectedVariant,
    isLoading: !product
  };
}; 