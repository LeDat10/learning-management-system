const permissionsReducer = (state = {permissions: []}, action) => {
    switch (action.type) {
        case "PERMISSIONS":
            return ({
                permissions: action.payload.permissions
            });
    
        default:
            return state;

    };
};

export default permissionsReducer;