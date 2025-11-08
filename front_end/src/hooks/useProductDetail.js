import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductService from '../API/ProductService';

export const useProductDetail = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await ProductService.getProductBySlug(slug);
        setProduct(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Có lỗi xảy ra khi tải thông tin sản phẩm');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  return { product, loading, error };
}; 