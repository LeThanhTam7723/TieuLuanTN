import axiosClient from './axiosClient';

const WishlistService = {
  addFavorite: async (userId, productId, token) => {
    return axiosClient.post(
      '/favorite/add',
      { userId, productId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  },

  deleteFavorite: async (userId, productId, token) => {
    return axiosClient.delete(
      '/favorite/delete',
      {
        data: { userId, productId },
        headers: { Authorization: `Bearer ${token}` }
      }
    );
  },

  checkFavorite: async (userId, productId, token) => {
    const res = await axiosClient.get('/favorite/check', {
      params: { userId, productId },
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('>>> checkFavorite res.data:', res.data);
    return res.data;
  }
};

export default WishlistService;
