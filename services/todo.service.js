import { ADD_DONE_TODO, ADD_ONGOING_TODO, REMOVE_DONE_TODO, REMOVE_ONGOING_TODO, SET_TODO_COUNTS } from '../store/reducers/statusBarReducer.js'
import { ADD_TODO, DONE_TODO_LOADING, REMOVE_TODO, SET_CURRENT_PAGE, SET_PAGE_COUNT, SET_TODOS, UPDATE_TODO } from '../store/reducers/todoReducer.js'
import { store } from '../store/store.js'
import { activityService } from './activity.service.js'
import { storageService } from './async-storage.service.js'
import { userService } from './user.service.js'
import { utilService } from './util.service.js'

export const STATUS_FILTERS = Object.freeze({
    ALL: 'all',
    ACTIVE: 'active',
    DONE: 'done'
});

const TODO_KEY = 'todoDB'
_createTodos()

export const todoService = {
    query,
    get,
    remove,
    save,
    getEmptyTodo,
    getDefaultFilter,
    getFilterFromSearchParams,
    getImportanceStats,
}
// For Debug (easy access from console):
window.cs = todoService

function query() {
    const { filterBy } = store.getState().todoReducer
    return storageService.query(TODO_KEY)
        .then(todos => {
            store.dispatch({
                type: SET_TODO_COUNTS, payload: {
                    done: todos.filter(todo => todo.isDone).length,
                    total: todos.length
                }
            })

            if (filterBy.status === STATUS_FILTERS.ACTIVE) {
                todos = todos.filter(todo => !todo.isDone)
            }

            if (filterBy.status === STATUS_FILTERS.DONE) {
                todos = todos.filter(todo => todo.isDone)
            }

            if (filterBy.txt) {
                const regExp = new RegExp(filterBy.txt, 'i')
                todos = todos.filter(todo => regExp.test(todo.txt))
            }

            if (filterBy.importance) {
                todos = todos.filter(todo => todo.importance >= filterBy.importance)
            }

            store.dispatch({ type: SET_TODOS, payload: todos })
            const amountPerPage = store.getState().todoReducer.pagination.amountPerPage || 5
            store.dispatch({ type: SET_PAGE_COUNT, payload: Math.ceil(todos.length / amountPerPage) })
            store.dispatch({ type: SET_CURRENT_PAGE, payload: 1 })
        })
        .finally(() => store.dispatch({ type: DONE_TODO_LOADING }))
}

function get(todoId) {
    return storageService.get(TODO_KEY, todoId)
        .then(todo => {
            todo = _setNextPrevTodoId(todo)
            return todo
        })
}

function remove(todoId) {
    return storageService.remove(TODO_KEY, todoId).then((removedEntity) => {
        store.dispatch({ type: REMOVE_TODO, payload: todoId })
        if (removedEntity.isDone) {
            store.dispatch({ type: REMOVE_DONE_TODO })
        } else {
            store.dispatch({ type: REMOVE_ONGOING_TODO })
        }
        // Add activity
        activityService.add("User has removed todo with id: " + todoId)
    })
}

function save(todo) {
    if (todo._id) {
        todo.updatedAt = Date.now()
        return storageService.put(TODO_KEY, todo)
            .then((todo) => {
                store.dispatch({ type: UPDATE_TODO, payload: todo })
                activityService.add(`User has updated todo \"${todo.txt}\" with id: ${todo._id}`)
                return todo
            })
    } else {
        todo.createdAt = todo.updatedAt = Date.now()
        return storageService.post(TODO_KEY, todo)
            .then(todo => {
                if (todo.isDone) {
                    store.dispatch({ type: ADD_DONE_TODO })
                } else {
                    store.dispatch({ type: ADD_ONGOING_TODO })
                }
                store.dispatch({ type: ADD_TODO, payload: todo })
                userService.addUserBalance(10)
                activityService.add(`User has added todo with id: ${todo._id}`)
                return todo;
            })
    }
}

function getEmptyTodo(txt = '', importance = 5) {
    return { txt, importance, isDone: false, color: utilService.makeColor() }
}

function getDefaultFilter() {
    return { txt: '', importance: 1, status: 'all' }
}

function getFilterFromSearchParams(searchParams) {
    const defaultFilter = getDefaultFilter()
    const filterBy = {}
    for (const field in defaultFilter) {
        if (field === 'importance') {
            filterBy[field] = +searchParams.get(field) || 1
        } else {
            filterBy[field] = searchParams.get(field) || ''
        }
    }
    return filterBy
}


function getImportanceStats() {
    return storageService.query(TODO_KEY)
        .then(todos => {
            const todoCountByImportanceMap = _getTodoCountByImportanceMap(todos)
            const data = Object.keys(todoCountByImportanceMap).map(speedName => ({ title: speedName, value: todoCountByImportanceMap[speedName] }))
            return data
        })

}

function _createTodos() {
    let todos = utilService.loadFromStorage(TODO_KEY)
    if (!todos || !todos.length) {
        todos = []
        const txts = ['Learn React', 'Master CSS', 'Practice Redux']
        for (let i = 0; i < 20; i++) {
            const txt = txts[utilService.getRandomIntInclusive(0, txts.length - 1)]
            todos.push(_createTodo(txt + (i + 1), utilService.getRandomIntInclusive(1, 10)))
        }
        utilService.saveToStorage(TODO_KEY, todos)
    }
}

function _createTodo(txt, importance) {
    const todo = getEmptyTodo(txt, importance)
    todo._id = utilService.makeId()
    todo.createdAt = todo.updatedAt = Date.now() - utilService.getRandomIntInclusive(0, 1000 * 60 * 60 * 24)
    todo.color = utilService.makeColor();
    return todo
}

function _setNextPrevTodoId(todo) {
    return storageService.query(TODO_KEY).then((todos) => {
        const todoIdx = todos.findIndex((currTodo) => currTodo._id === todo._id)
        const nextTodo = todos[todoIdx + 1] ? todos[todoIdx + 1] : todos[0]
        const prevTodo = todos[todoIdx - 1] ? todos[todoIdx - 1] : todos[todos.length - 1]
        todo.nextTodoId = nextTodo._id
        todo.prevTodoId = prevTodo._id
        return todo
    })
}

function _getTodoCountByImportanceMap(todos) {
    const todoCountByImportanceMap = todos.reduce((map, todo) => {
        if (todo.importance < 3) map.low++
        else if (todo.importance < 7) map.normal++
        else map.urgent++
        return map
    }, { low: 0, normal: 0, urgent: 0 })
    return todoCountByImportanceMap
}


// Data Model:
// const todo = {
//     _id: "gZ6Nvy",
//     txt: "Master Redux",
//     importance: 9,
//     isDone: false,
//     createdAt: 1711472269690,
//     updatedAt: 1711472269690
// }

