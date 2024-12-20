
export const ADD_TODO = "ADD_TODO";
export const REMOVE_TODO = "REMOVE_TODO";
export const UPDATE_TODO = "UPDATE_TODO";
export const SET_TODOS = "SET_TODOS";
export const DONE_TODO_LOADING = "DONE_TODO_LOADING";
export const TODO_LOAD = "TODO_LOAD";
export const SET_FILTER_BY = "SET_FILTER_BY";
export const UPDATE_TODO_COUNT = "UPDATE_TODO_COUNT";

const initialState = {
    loading: true,
    todos: [],
    totalCount: 0,
    filterBy: { txt: "", importance: "" },
}

export const todoReducer = (state = initialState, action = {}) => {
    switch (action.type) {
        case UPDATE_TODO_COUNT:
            return ({
                ...state,
                totalCount: action.payload.total,
                doneCount: action.payload.done,
            })
        case TODO_LOAD:
            return ({
                ...state,
                loading: true
            })
        case ADD_TODO:
            return ({
                ...state,
                todos: [
                    ...state.todos,
                    action.payload
                ],
                todoCount: state.todoCount + 1
            })
        case UPDATE_TODO:
            return ({
                ...state,
                todos: state.todos.map(todo => {
                    if (todo._id === action.payload._id) {
                        return action.payload
                    }
                    return todo
                })
            })
        case REMOVE_TODO:
            return ({
                ...state,
                todos: state.todos.filter(todo => {
                    // Update todo count
                    if (todo._id === action.payload) {
                        store.dispatch({
                            type: UPDATE_TODO_COUNT,
                            payload: {
                                total: state.totalCount - 1,
                                done: todo.isDone ? state.doneCount - 1 : state.doneCount
                            }
                        })
                    }
                    return todo._id !== action.payload
                }),
            })
        case SET_TODOS:
            return ({
                ...state,
                todos: [
                    ...action.payload
                ]
            })
        case DONE_TODO_LOADING:
            return ({
                ...state,
                loading: false
            })
        case SET_FILTER_BY:
            return ({
                ...state,
                filterBy: {
                    ...action.payload
                }
            })
        default:
            return state
    }
}

// export const todoReducer = (state = {}, action = {}) => {
//     switch (action.type) {
//         case TODO_ADD:
//             return {
//                 ...state,
//                 todos: [
//                     ...state.todos,
//                     action.payload
//                 ]
//             }
//         case TODO_DELETE:
//             return {
//                 ...state,
//                 todos: (state.todos || []).filter(todo => todo.id !== action.payload)
//             }
//         case TODO_EDIT:
//             return {
//                 ...state,
//                 todos: (state.todos || []).map(todo => {
//                     if (todo.id === action.payload.id) {
//                         return action.payload
//                     }
//                     return todo
//                 })
//             }
//         case TODO_LOAD:
//             return {
//                 ...state,
//                 loading: true
//             }
//         case TODO_LOAD_SUCCESS:
//             return {
//                 ...state,
//                 loading: false,
//                 todos: action.payload
//             }
//         default:
//             return state
//     }
// }