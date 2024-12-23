import { statusBarReducer } from "./reducers/statusBarReducer.js";
import { todoReducer } from "./reducers/todoReducer.js";
import { userReducer } from "./reducers/userReducer.js";

const { createStore, combineReducers, compose } = Redux;

const composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

const reducers = combineReducers({
    userReducer,
    todoReducer,
    statusBarReducer
});

export const store = createStore(reducers, composeEnhancers());