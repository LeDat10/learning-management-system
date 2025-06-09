const { tokenUserConfig } = require("../../helper/tokenConfig");
const { post, get } = require("../../utils/client/request");

export const createQuizAttempt = async(option) => {
    const response = await post("client/quiz-attempts", option, tokenUserConfig());
    return response.data;
};

// export const getInfoAttempt = async(lessonId) => {
//     const response = await get(`client/quiz-attempts/info/${lessonId}`, tokenUserConfig());
//     return response.data;
// };