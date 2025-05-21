import { tokenUserConfig } from "../../helper/tokenConfig";
import { get } from "../../utils/client/request";


export const getDetailLesson = async (sectionId, lessonId) => {
    const response = await get(`client/lessons/${sectionId}/detail/${lessonId}`, tokenUserConfig());
    return response.data;
};