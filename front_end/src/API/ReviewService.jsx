import axiosClient from "./axiosClient";
const ReviewService = {
    addReview: async(idProduct,idUser,rating,comment,token)=> {
        try {
            const response = await axiosClient.post('/review/add',{idProduct,idUser,rating,comment},
                {headers:{Authorization: `Bearer ${token}`}}
            );
            return response;
        } catch (error) {
            throw error;
        }
    },
    getReviews: async (productId) => {
        try {
            const response = await axiosClient.get('/review/comments/'+productId);
            return response.data.result;
        } catch (error) {
            throw error;
        }
    },
}
export default ReviewService;

