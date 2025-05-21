import { tokenAccountConfig } from "../../helper/tokenConfig";
import { del, get, patch, post } from "../../utils/admin/request";


export const getRole = async (params) => {
    const response = await get(`admin/roles?keyword=${params.keyword}&sortKey=${params.sortKey}&sortValue=${params.sortValue}&page=${params.page}&limit=${params.limit}`, tokenAccountConfig());
    return response.data;
};

export const createRole = async (option) => {
    const response = await post("admin/roles/create", option, tokenAccountConfig());
    return response.data;
};

export const changeMultiRole = async (option) => {
    const response = await patch('admin/roles/change-multi', option, tokenAccountConfig());
    return response.data;
};

export const deleteRole = async (id) => {
    const response = await del(`admin/roles/delete/${id}`, tokenAccountConfig());
    return response.data;
};

export const getDetailRole = async (id) => {
    const response = await get(`admin/roles/detail/${id}`, tokenAccountConfig());
    return response.data;
};

export const editRole = async (id, option) => {
    const response = await patch(`admin/roles/edit/${id}`, option, tokenAccountConfig());
    return response.data;
};

export const setPermissions = async (option) => {
    const response = await patch('admin/roles/permissions', option, tokenAccountConfig());
    return response.data;
};

export const getTrashRole = async (params) => {
    const response = await get(`admin/roles/trash?keyword=${params.keyword}&sortKey=${params.sortKey}&sortValue=${params.sortValue}&limit=${params.limit}&page=${params.page}`, tokenAccountConfig());
    return response.data;
};

export const restoreTrashRole = async (roleId) => {
    const response = await patch(`admin/roles/trash/restore/${roleId}`, {}, tokenAccountConfig());
    return response.data;
};

export const deleteTrashRole = async (roleId) => {
    const response = await del(`admin/roles/trash/delete/${roleId}`, tokenAccountConfig());
    return response.data;
};

export const restoreMultiRole = async (option) => {
    const response = await patch('admin/roles/trash/restore-multi', option, tokenAccountConfig());
    return response.data;
};