import { post } from "../../utils/client/request";


export const register = async(option) => {
    const response = await post('client/users/register', option);
    return response.data;
};

export const confirmOTP = async(option) => {
    const response = await post('client/users/confirmOTP', option);
    return response.data;
};

export const login = async(option) => {
    const response = await post('client/users/login', option);
    return response.data;
};