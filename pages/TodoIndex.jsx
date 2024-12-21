import { TodoFilter } from "../cmps/TodoFilter.jsx"
import { TodoList } from "../cmps/TodoList.jsx"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import { todoService } from "../services/todo.service.js"
import { utilService } from "../services/util.service.js"
import { SET_FILTER_BY } from "../store/reducers/todoReducer.js"
import { store } from "../store/store.js"

const { useEffect, useRef } = React
const { useSearchParams } = ReactRouterDOM
const { useSelector } = ReactRedux

export function TodoIndex() {
    const { todos, loading } = useSelector(state => state.todoReducer);
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
                showSuccessMsg(`Todo is ${(savedTodo.isDone) ? 'done' : 'back on your list'}`)
            })
            .catch(err => {
                console.log('err:', err)
                showErrorMsg('Cannot toggle todo ' + todo._id)
            })
    }

    if (loading) return <div>Loading...</div>
    return (
        <section className="todo-index">

            <section className="main-todo-wrapper">
                <TodoFilter storeFilterBy={filterBy} />
                <TodoList todos={todos} onRemoveTodo={onRemoveTodo} onToggleTodo={onToggleTodo} />
            </section>
            {/* <hr /> */}
            {/* <div style={{ width: '60%', margin: 'auto' }}>
                <DataTable todos={todos} onRemoveTodo={onRemoveTodo} />
            </div> */}
        </section>
    )
}