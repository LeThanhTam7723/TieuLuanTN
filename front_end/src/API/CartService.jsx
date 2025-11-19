import axiosClient from "./axiosClient";

const CartService = {
    listCartItem: async () => {
        try {
            const response = await axiosClient.get('/cart/listCartItem');
            return response;
        } catch (error) {
            throw error;
        }
    },
    updateCartItem: async (body) => {
        try {
            const response = await axiosClient.put('/cart/updateItem', body);
            return response;
        } catch (error) {
            throw error;
        }
    },
    addCart: async (body) => {
        try {
            const response = await axiosClient.post('/cart/addCart', body);
            return response;
        } catch (error) {
            throw error;
        }
    },
    deleteCartItem: async (id) => {
        try {
            const response = await axiosClient.delete(`/cart/deleteItem/${id}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

}

export {CartService};