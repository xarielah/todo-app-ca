import { TodoFilter } from "../cmps/TodoFilter.jsx"
import { TodoList } from "../cmps/TodoList.jsx"
import { TodoPagination } from "../cmps/TodoPagination.jsx"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import { todoService } from "../services/todo.service.js"
import { utilService } from "../services/util.service.js"
import { DECREASE_DONE_TODO, INCREASE_DONE_TODO } from "../store/reducers/statusBarReducer.js"
import { SET_FILTER_BY } from "../store/reducers/todoReducer.js"
import { store } from "../store/store.js"

const { useEffect, useRef } = React
const { useSearchParams } = ReactRouterDOM
const { useSelector } = ReactRedux

export function TodoIndex() {
    const { todos, loading, pagination: { currentPage, amountPerPage } } = useSelector(state => state.todoReducer);
    const { filterBy } = useSelector(state => state.todoReducer);
    const [searchParams, setSearchParams] = useSearchParams();
    // Allows me to optimize query to be initially fetched once after we update filterBy
    // from the search params.
    const hasRendered = useRef(false)

    useEffect(() => {
        if (hasRendered.current) {
            setSearchParams(utilService.getTruthyValues(filterBy))
            todoService.query()
                .catch(err => {
                    console.error('err:', err)
                    showErrorMsg('Cannot load todos')
                })
        }
    }, [filterBy])

    useEffect(() => {
        store.dispatch({ type: SET_FILTER_BY, payload: { ...todoService.getFilterFromSearchParams(searchParams) } })
        hasRendered.current = true
    }, [])

    function onRemoveTodo(todoId) {
        todoService.remove(todoId)
            .then(() => {
                showSuccessMsg(`Todo removed`)
            })
            .catch(err => {
                console.log('err:', err)
                showErrorMsg('Cannot remove todo ' + todoId)
            })
    }

    function onToggleTodo(todo) {

        const todoToSave = { ...todo, isDone: !todo.isDone }
        todoService.save(todoToSave)
            .then((savedTodo) => {
                if (todo.isDone) {
                    // If initial state of todo is done, we'd like to decrease the done count
                    store.dispatch({ type: DECREASE_DONE_TODO })
                } else {
                    // If initial state of todo is not done, we'd like to increase the done count
                    store.dispatch({ type: INCREASE_DONE_TODO })
                }
                showSuccessMsg(`Todo is ${(savedTodo.isDone) ? 'done' : 'back on your list'}`)
            })
            .catch(err => {
                console.log('err:', err)
                showErrorMsg('Cannot toggle todo ' + todo._id)
            })
    }

    if (loading) return <div>Loading...</div>
    const start = (currentPage - 1) * amountPerPage;
    console.log("🚀 ~ TodoIndex ~ start:", start)
    const end = currentPage * amountPerPage
    console.log("🚀 ~ TodoIndex ~ end:", end)
    console.log("🚀 ~ TodoIndex ~ amountPerPage:", amountPerPage)
    console.log("🚀 ~ TodoIndex ~ currentPage:", currentPage)
    const pagedTodos = todos.slice(start, end)
    return (
        <section className="todo-index">
            <section className="main-todo-wrapper">
                <TodoFilter storeFilterBy={filterBy} />
                <TodoList todos={pagedTodos} onRemoveTodo={onRemoveTodo} onToggleTodo={onToggleTodo} />
                <TodoPagination />
            </section>
        </section>
    )
}