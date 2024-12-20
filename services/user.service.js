import { ADD_TO_BALANCE, USER_LOGIN, USER_LOGOUT } from "../store/reducers/userReducer.js";
import { store } from "../store/store.js";
import { storageService } from "./async-storage.service.js";

const INITIAL_USER_BALANCE = 10000;

export const userService = {
    getLoggedinUser,
    login,
    logout,
    signup,
    getById,
    query,
    getEmptyCredentials,
    addUserBalance
}
const STORAGE_KEY_LOGGEDIN = 'user'
const STORAGE_KEY = 'userDB'

function query() {
    return storageService.query(STORAGE_KEY)
}

function getById(userId) {
    return storageService.get(STORAGE_KEY, userId)
}

function login({ username, password }) {
    return storageService.query(STORAGE_KEY)
        .then(users => {
            const user = users.find(user => user.username === username)
            if (user) return _setLoggedinUser(user)
            else return Promise.reject('Invalid login')
        })
}

function signup({ username, password, fullname }) {
    const user = { username, password, fullname }
    user.createdAt = user.updatedAt = Date.now()
    user.balance = INITIAL_USER_BALANCE;

    return storageService.post(STORAGE_KEY, user)
        .then(_setLoggedinUser)
}

function logout() {
    sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN)
    store.dispatch({ type: USER_LOGOUT })
    return Promise.resolve()
}

function getLoggedinUser() {
    const user = JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN))
    if (user)
        store.dispatch({ type: USER_LOGIN, payload: user })
    return user;
}

function addUserBalance(amountToAdd = 10) {
    const user = store.getState().userReducer.user
    if (user) {
        console.log("🚀 ~ addUserBalance ~ user:", user)
        store.dispatch({ type: ADD_TO_BALANCE, payload: amountToAdd })
        _setLoggedinUser({ ...user, balance: +user.balance + amountToAdd });
        return storageService.put(STORAGE_KEY, { ...user, balance: +user.balance + amountToAdd })
    }
}

function _setLoggedinUser(user) {
    const userToSave = { _id: user._id, fullname: user.fullname, balance: user.balance, activities: user.activities }
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN, JSON.stringify(userToSave))
    console.log("🚀 ~ _setLoggedinUser ~ userToSave:", userToSave)
    store.dispatch({ type: USER_LOGIN, payload: user })
    return userToSave
}

function getEmptyCredentials() {
    return {
        fullname: 'Muki Ja',
        username: 'muki',
        password: 'muki123',
    }
}

// signup({username: 'muki', password: 'muki1', fullname: 'Muki Ja'})
// login({username: 'muki', password: 'muki1'})

// Data Model:
// const user = {
//     _id: "KAtTl",
//     username: "muki",
//     password: "muki1",
//     fullname: "Muki Ja",
//     createdAt: 1711490430252,
//     updatedAt: 1711490430999
// }