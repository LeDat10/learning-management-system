import { tokenUserConfig } from "../../helper/tokenConfig";
import { get } from "../../utils/client/request";


export const getDetailSection = async (courseId, sectionId) => {
    const response = await get(`client/sections/${courseId}/detail/${sectionId}`, tokenUserConfig());
    return response.data;
};