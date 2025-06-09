import { tokenUserConfig } from "../../helper/tokenConfig";
import { get } from "../../utils/client/request";

export const getQuestion = async (lessonId, attemptId) => {
    const response = await get(`client/questions/${lessonId}/${attemptId}`, tokenUserConfig());
    return response.data;
};