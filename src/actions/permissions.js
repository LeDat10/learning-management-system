import { getPermssions } from "../services/admin/accountService";

export const permissions = () => {
    return async (dispatch) => {
        const result = await getPermssions();
        dispatch({
            type: "PERMISSIONS",
            payload: result
        });
    };
};