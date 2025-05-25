import { tokenUserConfig } from "../../helper/tokenConfig";
import { post } from "../../utils/client/request";


export const registerCourse = async (option) => {
    const response = await post('client/enrollments/register', option, tokenUserConfig());
    return response.data;
};

export const cancelCourse = async (option) => {
    const response = await post('client/enrollments/cancel', option, tokenUserConfig());
    return response.data;
};

export const registerCourseWithCode = async (option) => {
    const response = await post('client/enrollments/code-register', option, tokenUserConfig());
    return response.data;
};