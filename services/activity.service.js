import { store } from "../store/store.js";

const ACTIVITY_STORAGE_KEY = 'activityDB'

export const activityService = {
    get,
    add
};

function get() {
    const user = store.getState().userReducer.user
    if (user) {
        return storageService.query(ACTIVITY_STORAGE_KEY)
            .then(activities => activities.filter(activity => activity.userId === user._id))
    } else {
        return Promise.resolve([])
    }
}

// Ex. actions = "User has removed todo with id: gZ6Nvy"
function add(action) {
    const user = store.getState().userReducer.user
    if (user) {
        const userId = user._id
        const activity = { userId, action, createdAt: Date.now() }
        return storageService.post(ACTIVITY_STORAGE_KEY, activity)
    }
}

// Activity Model:
// const activity = {
//     _id: string,
//     userId: string,
//     action: string,
//     createdAt: number,
// }
