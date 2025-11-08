import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';
import axiosClient from '../API/axiosClient.jsx';
import { listCartItem } from '../API/CartService.jsx';

export const FavoriteContext = createContext();

export const FavoriteProvider = ({ children }) => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [session, setSession] = useState(null);
    
    useEffect(() => {
      const fetchFavorites = async () => {
        if (!session?.currentUser?.id || !session?.token) return;
        try {
          const response = await axios.get(
            `http://localhost:8080/api/favorite/idUser/${session.currentUser.id}`,
            {
              headers: {
                Authorization: `Bearer ${session.token}`,
              },
            }
          );
          setWishlistItems(response.data.result || []);
        } catch (error) {
          console.error('Lỗi khi fetch danh sách yêu thích:', error);
        }
      };
      const fetchCarts = async () => {
        if (!session?.currentUser?.id || !session?.token) return;
        try {
          const response = await listCartItem({userId:session.currentUser.id,token:session.token})
          setCartItems(response.data.result || []);
        } catch (error) {
          console.error('Lỗi khi fetch danh sách giỏ hàng:', error);
        }
      };
      fetchFavorites();
      fetchCarts();
    }, [session]);

    const clearWishlist = () => {
      setWishlistItems([]);
    };
    const clearCart = () => {
      setCartItems([]);
    };

    const addToWishlist = async (productId) => {
      if (!session?.currentUser?.id || !session?.token) return;
      try {
        console.log("userId"+session.currentUser.id);
        const response = await axiosClient.post(
          `http://localhost:8080/api/favorite/add`,
          {
            userId: session.currentUser.id,
            productId: productId,
          },
          {
            headers: {
              Authorization: `Bearer ${session.token}`,
            },
          }
        );        
        // Giả sử API trả về danh sách mới hoặc sản phẩm vừa thêm
        setWishlistItems((prev) => [...prev, response.data.result]);
      } catch (error) {
        console.error('Lỗi khi thêm sản phẩm vào yêu thích:', error);
      }
    };
    const removeFromWishlist = async (productId) => {
      if (!session?.currentUser?.id || !session?.token) return;
      console.log("session"+session.token);
      console.log("productId"+productId);
      try {
        await axiosClient.delete('/favorite/delete', {
          data: {
            userId: session.currentUser.id,
            productId: productId,
          },
          headers: {
            Authorization: `Bearer ${session.token}`
          }
        });  
        setWishlistItems(wishlistItems.filter(item => item.id !== productId));
      } catch (error) {
        console.error('Lỗi khi xóa sản phẩm khỏi yêu thích:', error);
      }
    };
    const addToCart = async(productId)=> {

    }
  
   
  return (
    <FavoriteContext.Provider value={{ wishlistItems,clearWishlist,session,setSession,removeFromWishlist,addToWishlist,cartItems,clearCart}}>
      {children}
    </FavoriteContext.Provider>
  );
};
