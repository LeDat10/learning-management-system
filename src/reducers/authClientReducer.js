import Cookies from 'js-cookie';

const initialState = {
    isAuthenticated: !!Cookies.get("userToken"),  // Kiểm tra xem token có trong cookies không
    token: Cookies.get("userToken") || null,      // Lấy token từ cookies nếu có
};

const authClientReducer = (state = initialState, action) => {
    switch (action.type) {
        case "LOGIN_USER_SUCCESS":
            // Lưu token vào cookies khi login thành công
            Cookies.set("userToken", action.payload.token);
            try {
                return {
                    ...state,
                    isAuthenticated: true,
                    token: action.payload.token,
                };
            } catch (error) {
                return state;
            };
        case "LOGOUT_USER":
            // Xóa token khỏi cookies khi logout
            Cookies.remove("userToken");
            return {
                ...state,
                isAuthenticated: false,
                token: null
            };
        case "TOKEN_EXPIRED_USER":
            // Xử lý khi token hết hạn (được dispatch từ nơi khác)
            Cookies.remove("userToken");
            return {
                ...state,
                isAuthenticated: false,
                token: null
            };
        default:
            return state;
    }
};

export default authClientReducer;
