export const USER_LOGIN = "USER_LOGIN";
export const USER_LOGOUT = "USER_LOGOUT";

export const ADD_TO_BALANCE = "ADD_TO_BALANCE";
export const REMOVE_FROM_BALANCE = "REMOVE_FROM_BALANCE";
export const ADD_ACTIVITY = "ADD_ACTIVITY";

const initialState = {
    user: null,
    balance: 10000,
    activities: []
}

export const userReducer = (state = initialState, action = {}) => {
    switch (action.type) {
        case USER_LOGIN:
            return {
                ...state,
                user: action.payload
            }
        case USER_LOGOUT:
            return {
                ...state,
                user: null
            }
        case ADD_TO_BALANCE:
            return {
                ...state,
                user: {
                    ...state.user,
                    balance: state.user.balance + action.payload
                }
            }
        case REMOVE_FROM_BALANCE:
            return {
                ...state,
                user: {
                    ...state.user,
                    balance: (state.balance - action.payload) || 0
                }
            }
        case ADD_ACTIVITY:
            return {
                ...state,
                activities: [
                    ...state.activities,
                    action.payload
                ]
            }
        default:
            return state
    }
}