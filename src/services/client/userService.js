import { tokenUserConfig } from "../../helper/tokenConfig";
import { get, post } from "../../utils/client/request";


export const register = async (option) => {
    const response = await post('client/users/register', option);
    return response.data;
};

export const confirmOTP = async (option) => {
    const response = await post('client/users/confirmOTP', option);
    return response.data;
};

export const login = async (option) => {
    const response = await post('client/users/login', option);
    return response.data;
};

export const getDetailUser = async () => {
    const response = await get('client/users/detail', tokenUserConfig());
    return response.data;
};

export const logout = async () => {
    const response = await post('client/users/logout', {}, tokenUserConfig());
    return response.data;
};

export const forgotPassword = async (option) => {
    const response = await post('client/users/password/forgot', option);
    return response.data;
};

export const otpPassword = async (option) => {
    const response = await post('client/users/password/otp', option);
    return response.data;
};

export const resetPassword = async (option) => {
    const response = await post('client/users/password/reset-password', option);
    return response.data;
};