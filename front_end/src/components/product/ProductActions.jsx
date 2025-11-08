import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { addCart, updateCartItem } from '../../API/CartService';
import WishlistService from '../../API/WishlistService';
import { FavoriteContext } from '../../contexts/FavoriteContext.jsx';
import { useTranslation } from 'react-i18next';

const ProductActions = ({
                          product,
                          currentVariant,
                          disabled = false
                        }) => {
  const { t } = useTranslation();
  const { addToWishlist, removeFromWishlist } = useContext(FavoriteContext);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const navigate = useNavigate();
  const session = JSON.parse(localStorage.getItem('session'));
  const isLoggedIn = session && session.token;

  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      if (!isLoggedIn) return;
      try {
        const fav = await WishlistService.checkFavorite(
            session.currentUser.id,
            product.id,
            session.token
        );
        setIsFavorite(fav);
      } catch (err) {
        console.error(t('product_actions.messages.check_favorite_error'), err);
      }
    };
    fetchFavoriteStatus();
  }, [product.id, isLoggedIn, session, t]);

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      navigate('/auth/login');
      return;
    }
    if (disabled || !currentVariant) return;
    setIsAddingToCart(true);
    try {
      await addCart(
          {
            idProduct: currentVariant.id,
            amount: quantity,
          },
          session.token
      );
      console.log(currentVariant);
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      alert(t('product_actions.messages.add_to_cart_success'));
    } catch (err) {
      console.error(t('product_actions.messages.add_to_cart_error'), err);
      alert(t('product_actions.messages.add_to_cart_fail'));
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!isLoggedIn) {
      navigate('/auth/login');
      return;
    }
    if (disabled || !currentVariant) return;
    setIsBuying(true);
    try {
      navigate('/checkout', { state: { items: [{ variant: currentVariant, quantity }], total: currentVariant.price * quantity } });
    } catch (err) {
      console.error(t('product_actions.messages.buy_now_error'), err);
    } finally {
      setIsBuying(false);
    }
  };

  const toggleFavorite = async () => {
    if (!isLoggedIn) {
      navigate('/auth/login');
      return;
    }
    try {
      if (!isFavorite) {
        await WishlistService.addFavorite(session.currentUser.id, product.id, session.token);
        setIsFavorite(true);
        addToWishlist(product.id);
      } else {
        await WishlistService.deleteFavorite(session.currentUser.id, product.id, session.token);
        setIsFavorite(false);
        removeFromWishlist(product.id);
      }
    } catch (err) {
      console.error(t('product_actions.messages.update_favorite_error'), err);
    }
  };

  const decrease = () => {
    if (quantity > 1) setQuantity(q => q - 1);
  };
  const increase = () => {
    setQuantity(q => q + 1);
  };

  const isDisabled = disabled || !currentVariant;

  return (
      <div className="space-y-6">
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-900">{t('product_actions.quantity_label')}</label>
          <div className="flex items-center space-x-4">
            <div className="flex items-center border-2 border-gray-300 rounded-xl overflow-hidden">
              <button onClick={decrease} disabled={isDisabled || quantity === 1} className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold">−</button>
              <span className="px-6 py-3 bg-white font-semibold min-w-[60px] text-center">{quantity}</span>
              <button onClick={increase} disabled={isDisabled} className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold">+</button>
            </div>
            <span className="text-sm text-gray-500">
            {t('product_actions.quantity_remaining', { stockQuantity: currentVariant?.stockQuantity ?? 0 })}
          </span>
          </div>
        </div>

        <div className="space-y-4">
          <button
              onClick={handleAddToCart}
              disabled={isDisabled || isAddingToCart}
              className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center transition-all duration-300 ${isDisabled ? 'bg-gray-200 text-gray-400' : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'}`}
          >
            {isAddingToCart ? t('product_actions.add_to_cart_loading') : t('product_actions.add_to_cart_button')}
          </button>

          <button
              onClick={handleBuyNow}
              disabled={isDisabled || isBuying}
              className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center transition-all duration-300 ${isDisabled ? 'bg-gray-200 text-gray-400' : 'bg-gradient-to-r from-gray-900 to-gray-800 text-white hover:from-gray-800 hover:to-gray-700'}`}
          >
            {isBuying ? t('product_actions.buy_now_loading') : t('product_actions.buy_now_button')}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
              onClick={toggleFavorite}
              className={`py-3 px-4 rounded-xl font-semibold flex items-center justify-center space-x-2 transition-all duration-300 ${isFavorite ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-600'}`}
          >
            <span className="text-xl">{isFavorite ? '♥' : '♡'}</span>
            <span className="text-sm">{isFavorite ? t('product_actions.favorite_button_liked') : t('product_actions.favorite_button_unliked')}</span>
          </button>

          <button className="py-3 px-4 rounded-xl font-semibold bg-gray-50 text-gray-600 flex items-center justify-center space-x-2">
            <span className="text-sm">{t('product_actions.share_button')}</span>
          </button>
        </div>
      </div>
  );
};

export default ProductActions;