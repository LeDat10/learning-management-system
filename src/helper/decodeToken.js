import Cookies from "js-cookie";
import {jwtDecode} from 'jwt-decode';

export const decodeToken = () => {
    const accessToken = Cookies.get("accessToken");
    if(!accessToken) {
        return [];
    }
    const decode = jwtDecode(accessToken);
    return decode.permissions;
};