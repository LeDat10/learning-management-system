import { tokenAccountConfig } from "../../helper/tokenConfig";
import { del, get, patch, post } from "../../utils/admin/request";


export const getCourse = async (params) => {
    const response = await get(`admin/courses?keyword=${params.keyword}&status=${params.status}&sortKey=${params.sortKey}&sortValue=${params.sortValue}&category=${params.category}&page=${params.page}&limit=${params.limit}`, tokenAccountConfig());
    return response.data;
};

export const getCategories = async () => {
    const response = await get("admin/courses/categories", tokenAccountConfig());
    return response.data;
};

export const changeStatusCourse = async (id, option) => {
    const response = await patch(`admin/courses/change-status/${id}`, option, tokenAccountConfig());
    return response.data;
};

export const changeToggleCourse = async (id, option) => {
    const response = await patch(`admin/courses/change-toggle/${id}`, option, tokenAccountConfig());
    return response.data;
};

export const createCourse = async (option) => {
    const response = await post('admin/courses/create', option, tokenAccountConfig());
    return response.data;
};

export const changeMultiCourse = async (option) => {
    const response = await patch('admin/courses/change-multi', option, tokenAccountConfig());
    return response.data;
};

export const getDetailCourse = async (id) => {
    const response = await get(`admin/courses/detail/${id}`, tokenAccountConfig());
    return response.data;
};

export const editCourse = async (id, option) => {
    const response = await patch(`admin/courses/edit/${id}`, option, tokenAccountConfig());
    return response.data;
};

export const deleteCourse = async (id) => {
    const response = await del(`admin/courses/delete/${id}`, tokenAccountConfig());
    return response.data;
};

export const getTrashCourse = async (params) => {
    const response = await get(`admin/courses/trash?keyword=${params.keyword}&sortKey=${params.sortKey}&sortValue=${params.sortValue}&limit=${params.limit}&page=${params.page}`, tokenAccountConfig());
    return response.data;
};

export const restoreTrashCourse = async (courseId) => {
    const response = await patch(`admin/courses/trash/restore/${courseId}`, {}, tokenAccountConfig());
    return response.data;
};

export const deleteTrashCourse = async (courseId) => {
    const response = await del(`admin/courses/trash/delete/${courseId}`, tokenAccountConfig());
    return response.data;
};

export const restoreMultiCourse = async (option) => {
    const response = await patch('admin/courses/trash/restore-multi', option, tokenAccountConfig());
    return response.data;
};