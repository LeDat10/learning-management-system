import Cookies from "js-cookie";

export const tokenAccountConfig = () => {
    const token = Cookies.get("accessToken");
    return {
        headers: {
            authorization: `Bearer ${token}`
        }
    };
};

export const tokenUserConfig = () => {
    const token = Cookies.get("userToken");
    return {
        headers: {
            authorization: `Bearer ${token}`
        }
    };
};