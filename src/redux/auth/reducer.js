export const auth_state = (state='initial', action) => {
    switch(action.type) {
        case 'AUTH_SUCCESS': {
            return 'authorized'
        }
        case 'AUTH_FAILED': {
            return 'unauthorized'
        }
        case 'LOGOUT': {
            return 'unauthorized'
        }
        default:
            return state
    }
};

export const user_info = (state={user_info: null}, action) => {
    switch(action.type) {
        case 'AUTH_SUCCESS': {
            console.log("Auth success.." + action.payload.user.first_name);
            return { ...action.payload }
        }
        default:
            return state
    }
};
