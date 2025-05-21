export const loginAccountSuccess = (token) => ({
    type: "LOGIN_ACCOUNT_SUCCESS",
    payload: { token }
});

export const logoutAccount = () => ({
    type: "LOGOUT_ACCOUNT"
});

export const tokenExpiredAccount = () => ({
    type: "TOKEN_EXPIRED_ACCOUNT"
});

export const loginUserSuccess = (token) => ({
    type: "LOGIN_USER_SUCCESS",
    payload: { token }
});

export const logoutUser = () => ({
    type: "LOGOUT_USER"
});

export const tokenExpiredUser = () => ({
    type: "TOKEN_EXPIRED_USER"
});