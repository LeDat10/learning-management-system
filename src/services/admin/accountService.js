import { tokenAccountConfig } from "../../helper/tokenConfig";
import { del, get, patch, post } from "../../utils/admin/request";

export const createAccount = async(option) => {
    const response = await post('admin/accounts/create', option, tokenAccountConfig());
    return response.data;
};

export const getRoles = async() => {
    const response = await get('admin/accounts/get-roles', tokenAccountConfig());
    return response.data;
};

export const getAccount = async(params) => {
    const response = await get(`admin/accounts?keyword=${params.keyword}&status=${params.status}&sortKey=${params.sortKey}&sortValue=${params.sortValue}&page=${params.page}&limit=${params.limit}`, tokenAccountConfig());
    return response.data;
};

export const changeStatusAccount = async (accountId, option) => {
    const response = await patch(`admin/accounts/change-status/${accountId}`, option, tokenAccountConfig());
    return response.data;
};

export const changeMultiAccount = async (option) => {
    const response = await patch('admin/accounts/change-multi', option, tokenAccountConfig());
    return response.data;
};

export const getDetailAccount = async (accountId) => {
    const response = await get(`admin/accounts/detail/${accountId}`, tokenAccountConfig());
    return response.data;
};

export const editAccount = async (accountId, option) => {
    const response = await patch(`admin/accounts/edit/${accountId}`, option, tokenAccountConfig());
    return response.data;
};

export const deleteAccount = async (accountId) => {
    const response = await del(`admin/accounts/delete/${accountId}`, tokenAccountConfig());
    return response.data;
};

export const getTrashAccount = async (params) => {
    const response = await get(`admin/accounts/trash?keyword=${params.keyword}&sortKey=${params.sortKey}&sortValue=${params.sortValue}&limit=${params.limit}&page=${params.page}`, tokenAccountConfig());
    return response.data;
};

export const restoreTrashAccount = async (accountId) => {
    const response = await patch(`admin/accounts/trash/restore/${accountId}`, {}, tokenAccountConfig());
    return response.data;
};

export const deleteTrashAccount = async (accountId) => {
    const response = await del(`admin/accounts/trash/delete/${accountId}`, tokenAccountConfig());
    return response.data;
};

export const restoreMultiAccount = async (option) => {
    const response = await patch('admin/accounts/trash/restore-multi', option, tokenAccountConfig());
    return response.data;
};

export const login = async (option) => {
    const response = await post('admin/accounts/login', option);
    return response.data;
};

export const getPermssions = async() => {
    const result = await get('admin/accounts/permissions', tokenAccountConfig());
    return result;
};