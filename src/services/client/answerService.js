import { tokenUserConfig } from "../../helper/tokenConfig";
import { get, post } from "../../utils/client/request";

export const saveAnswer = async (option) => {
    const response = await post(`client/answers/save`, option, tokenUserConfig());
    return response.data;
};

export const getAnswersSaved = async (attemptId) => {
    const response = await get(`client/answers/${attemptId}`, tokenUserConfig());
    return response.data;
};

export const submitQuiz = async (option) => {
    const response = await post(`client/answers/submited`, option, tokenUserConfig());
    return response.data;
};