import { tokenAccountConfig } from "../../helper/tokenConfig";
import { del, get, patch, post } from "../../utils/admin/request";


export const getSection = async (courseId, params) => {
    const response = await get(`admin/sections/${courseId}?keyword=${params.keyword}&status=${params.status}&sortKey=${params.sortKey}&sortValue=${params.sortValue}&page=${params.page}&limit=${params.limit}`, tokenAccountConfig());
    return response.data;
};

export const createSection = async (courseId, option) => {
    const response = await post(`admin/sections/${courseId}/create`, option, tokenAccountConfig());
    return response.data;
};


export const changeStatusSection = async (courseId, sectionId, option) => {
    const response = await patch(`admin/sections/${courseId}/change-status/${sectionId}`, option, tokenAccountConfig());
    return response.data;
};

export const getDetailSection = async (courseId, sectionId) => {
    const response = await get(`admin/sections/${courseId}/detail/${sectionId}`, tokenAccountConfig());
    return response.data;
};

export const editSection = async (courseId, sectionId, option) => {
    const response = await patch(`admin/sections/${courseId}/edit/${sectionId}`, option, tokenAccountConfig());
    return response.data;
};

export const changeMultiSection = async (courseId, option) => {
    const response = await patch(`admin/sections/${courseId}/change-multi`, option, tokenAccountConfig());
    return response.data;
};

export const deleteSection = async (courseId, sectionId) => {
    const response = await del(`admin/sections/${courseId}/delete/${sectionId}`, tokenAccountConfig());
    return response.data;
};

export const getTrashSection = async (courseId, params) => {
    const response = await get(`admin/sections/${courseId}/trash?keyword=${params.keyword}&sortKey=${params.sortKey}&sortValue=${params.sortValue}&page=${params.page}&limit=${params.limit}`, tokenAccountConfig());
    return response.data;
};

export const restoreTrashSection = async (courseId, sectionId) => {
    const response = await patch(`admin/sections/${courseId}/trash/restore/${sectionId}`, {}, tokenAccountConfig());
    return response.data;
};

export const deleteTrashSection = async (courseId, sectionId) => {
    const response = await del(`admin/sections/${courseId}/trash/delete/${sectionId}`, tokenAccountConfig());
    return response.data;
};

export const restoreMultiSection = async (courseId, option) => {
    const response = await patch(`admin/sections/${courseId}/trash/restore-multi`, option, tokenAccountConfig());
    return response.data;
};