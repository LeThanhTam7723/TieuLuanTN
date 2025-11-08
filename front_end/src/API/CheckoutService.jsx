import axiosClient from "./axiosClient";

const addOrder = async (body,token) => {
    return await axiosClient.post('/order/add',body,{
        headers : {
            Authorization: `Bearer ${token}`
        }
    });
}

const vnPay = async (amount) => {
    return await axiosClient.get('/payment/vnpay', {
        params: { amount }
    });
};


export {addOrder,vnPay};