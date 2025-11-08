import axiosClient from "./axiosClient";

const listCartItem = async (body) => {
    return await axiosClient.get('/cart/listCartItem', {
        headers: {
            Authorization: `Bearer ${body.token}`
        }
    });
}

const updateCartItem = async (body, token) => {
    return await axiosClient.put('/cart/updateItem', body, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}
const addCart = async (body, token) => {
    return await axiosClient.post('/cart/addCart', body, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}
const deleteCartItem = async (id, token) => {
  return await axiosClient.delete(`/cart/deleteItem/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


export { listCartItem, updateCartItem ,addCart,deleteCartItem};