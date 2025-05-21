import { tokenAccountConfig } from "../../helper/tokenConfig";
import { del, get, patch, post } from "../../utils/admin/request";


export const createLessonText = async (sectionId, option) => {
    const response = await post(`admin/lessons/${sectionId}/create`, option, tokenAccountConfig());
    return response.data;
};

export const getLesson = async (sectionId, params) => {
    const response = await get(`admin/lessons/${sectionId}?keyword=${params.keyword}&status=${params.status}&sortKey=${params.sortKey}&sortValue=${params.sortValue}&page=${params.page}&limit=${params.limit}`, tokenAccountConfig());
    return response.data;
};

export const changeMultiLesson = async (sectionId, option) => {
    const response = await patch(`admin/lessons/${sectionId}/change-multi`, option, tokenAccountConfig());
    return response.data;
};

export const changeStatusLesson = async (sectionId, lessonId, option) => {
    const response = await patch(`admin/lessons/${sectionId}/change-status/${lessonId}`, option, tokenAccountConfig());
    return response.data;
};

export const getDetailLessonText = async (sectionId, lessonId) => {
    const response = await get(`admin/lessons/${sectionId}/detail/${lessonId}`, tokenAccountConfig());
    return response.data;
};

export const editLessonText = async (sectionId, lessonId, option) => {
    const response = await patch(`admin/lessons/${sectionId}/edit/${lessonId}`, option, tokenAccountConfig());
    return response.data;
};

export const deleteLessonText = async (sectionId, lessonId) => {
    const response = await del(`admin/lessons/${sectionId}/delete/${lessonId}`, tokenAccountConfig());
    return response.data;
};

export const getTrashLesson = async (sectionId, params) => {
    const response = await get(`admin/lessons/${sectionId}/trash?keyword=${params.keyword}&sortKey=${params.sortKey}&sortValue=${params.sortValue}`, tokenAccountConfig());
    return response.data;
};

export const deleteTrashLessonText = async (sectionId, lessonId) => {
    const response = await del(`admin/lessons/${sectionId}/trash/delete/${lessonId}`, tokenAccountConfig());
    return response.data;
};

export const restoreTrashLesson = async (sectionId, lessonId) => {
    const response = await patch(`admin/lessons/${sectionId}/trash/restore/${lessonId}`, {}, tokenAccountConfig());
    return response.data;
};

export const restoreMultiLessonText = async (sectionId, option) => {
    const response = await patch(`admin/lessons/${sectionId}/trash/restore-multi`, option, tokenAccountConfig());
    return response.data;
};