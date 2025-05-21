export const searchReducer = (state = '', action) => {
    switch (action.type) {
        case 'SEARCH':
            return action.keyword;
        default:
            return '';
    };
};