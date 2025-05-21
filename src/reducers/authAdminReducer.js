import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

const initialState = {
  isAuthenticated: !!Cookies.get("accessToken"),  // Kiểm tra xem token có trong cookies không
  token: Cookies.get("accessToken") || null,      // Lấy token từ cookies nếu có
  permissions: null
};

if (initialState.token) {
  try {
    const decodeToken = jwtDecode(initialState.token);
    initialState.permissions = decodeToken.permissions || null;
  } catch (error) {
    console.error("Token is invalid:", error);
  };
};

const authAdminReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN_ACCOUNT_SUCCESS":
      // Lưu token vào cookies khi login thành công
      Cookies.set("accessToken", action.payload.token);
      try {
        const decodeToken = jwtDecode(action.payload.token);
        return {
          ...state,
          isAuthenticated: true,
          token: action.payload.token,
          permissions: decodeToken.permissions
        };
      } catch (error) {
        return state;
      };


    case "LOGOUT_ACCOUNT":
      // Xóa token khỏi cookies khi logout
      Cookies.remove("accessToken");
      return {
        ...state,
        isAuthenticated: false,
        token: null,
        permissions: null
      };
    case "TOKEN_EXPIRED_ACCOUNT":
      // Xử lý khi token hết hạn (được dispatch từ nơi khác)
      Cookies.remove("accessToken");
      return {
        ...state,
        isAuthenticated: false,
        token: null,
        permissions: null
      };
    default:
      return state;
  }
};

export default authAdminReducer;
