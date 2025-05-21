import { tokenUserConfig } from "../../helper/tokenConfig";
import { get } from "../../utils/client/request";

export const getCourse = async (params) => {
    const response = await get(`client/courses?keyword=${params.keyword}&status=${params.status}&sortKey=${params.sortKey}&sortValue=${params.sortValue}&page=${params.page}&limit=${params.limit}&category=${params.category}`, tokenUserConfig());
    return response.data;
};

export const getDetailCourse = async (slugCourse) => {
    const response = await get(`client/courses/detail/${slugCourse}`, tokenUserConfig());
    return response.data;
};