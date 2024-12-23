export const SET_TODO_COUNTS = "SET_TODO_COUNTS";
export const ADD_ONGOING_TODO = "ADD_ONGOING_TODO";
export const ADD_DONE_TODO = "ADD_DONE_TODO";
export const REMOVE_ONGOING_TODO = "REMOVE_ONGOING_TODO";
export const REMOVE_DONE_TODO = "REMOVE_DONE_TODO";
export const INCREASE_DONE_TODO = "INCREASE_DONE_TODO";
export const DECREASE_DONE_TODO = "DECREASE_DONE_TODO";

const initialState = {
    total: 0,
    done: 0,
}

export const statusBarReducer = (state = initialState, action = {}) => {
    switch (action.type) {
        case SET_TODO_COUNTS:
            return ({
                ...state,
                total: action.payload.total,
                done: action.payload.done
            })
        case ADD_ONGOING_TODO:
            return ({
                ...state,
                total: state.total + 1,
                done: state.done
            })
        case ADD_DONE_TODO:
            return ({
                ...state,
                total: state.total + 1,
                done: state.done + 1
            })
        case REMOVE_ONGOING_TODO:
            return ({
                ...state,
                total: state.total - 1,
                done: state.done
            })
        case REMOVE_DONE_TODO:
            return ({
                ...state,
                total: state.total - 1,
                done: state.done - 1
            })
        case DECREASE_DONE_TODO:
            return ({
                ...state,
                done: state.done - 1
            })
        case INCREASE_DONE_TODO:
            return ({
                ...state,
                done: state.done + 1
            })
        default:
            return state
    }
}