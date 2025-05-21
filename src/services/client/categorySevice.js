import { tokenUserConfig } from "../../helper/tokenConfig";
import { get } from "../../utils/client/request";

export const getCategory = async () => {
    const response = await get(`client/category`, tokenUserConfig());
    return response.data;
};