import axiosClient from "./axiosClient";

const signIn = async (body) => {
    return await axiosClient.post('/auth/login', body);
};

const register = async (body) => {
    return await axiosClient.post('/users/createUser', body);
};

const checkEmailExists = async (email) => {
    return await axiosClient.post('users/existUser',null, {
        params: {
            email: email
        }
    });
}

const logOutApi = async (body) => {
    const token = body.token;
    return await axiosClient.post('auth/logout',body,{
        headers : {
            Authorization: `Bearer ${token}`
        }
    });
}

const verifyRegister = async (email) => {
    return await axiosClient.post('/verifyRegister',null, {
        params: {
            email: email
        },
        timeout: 15000
    });
}

const introspect = async (body) => {
    return await axiosClient.post('/auth/introspect', body);
}

const forgot = async (email) => {
    return await axiosClient.post('/forgotPassword',null, {
        params: {
            email: email
        },
        timeout: 30000
    });
};


export { signIn ,register,checkEmailExists,logOutApi,verifyRegister,introspect,forgot };