import { tokenAccountConfig } from "../../helper/tokenConfig";
import { del, get, patch, post } from "../../utils/admin/request";


export const createCategory = async (option) => {
    const response = await post('admin/category/create', option, tokenAccountConfig());
    return response.data;
};

export const getCategory = async (params) => {
    const response = await get(`admin/category?keyword=${params.keyword}&status=${params.status}&sortKey=${params.sortKey}&sortValue=${params.sortValue}&page=${params.page}&limit=${params.limit}`, tokenAccountConfig());
    return response.data;
};

export const changeStatusCategory = async (categoryId, option) => {
    const response = await patch(`admin/category/change-status/${categoryId}`, option, tokenAccountConfig());
    return response.data;
};

export const changeMultiCategory = async (option) => {
    const response = await patch('admin/category/change-multi', option, tokenAccountConfig());
    return response.data;
};

export const getDetailCategory = async (categoryId) => {
    const response = await get(`admin/category/detail/${categoryId}`, tokenAccountConfig());
    return response.data;
};

export const editCategory = async (categoryId, option) => {
    const response = await patch(`admin/category/edit/${categoryId}`, option, tokenAccountConfig());
    return response.data;
};

export const deleteCategory = async (categoryId) => {
    const response = await del(`admin/category/delete/${categoryId}`, tokenAccountConfig());
    return response.data;
};

export const getTrashCategory = async (params) => {
    const response = await get(`admin/category/trash?keyword=${params.keyword}&sortKey=${params.sortKey}&sortValue=${params.sortValue}&limit=${params.limit}&page=${params.page}`, tokenAccountConfig());
    return response.data;
};

export const restoreTrashCategory = async (categoryId) => {
    const response = await patch(`admin/category/trash/restore/${categoryId}`, {}, tokenAccountConfig());
    return response.data;
};

export const deleteTrashCategory = async (categoryId) => {
    const response = await del(`admin/category/trash/delete/${categoryId}`, tokenAccountConfig());
    return response.data;
};

export const restoreMultiCategory = async (option) => {
    const response = await patch('admin/category/trash/restore-multi', option, tokenAccountConfig());
    return response.data;
};