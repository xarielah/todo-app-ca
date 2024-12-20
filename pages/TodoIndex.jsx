import { TodoFilter } from "../cmps/TodoFilter.jsx"
import { TodoList } from "../cmps/TodoList.jsx"
import { DataTable } from "../cmps/data-table/DataTable.jsx"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import { todoService } from "../services/todo.service.js"
import { SET_FILTER_BY } from "../store/reducers/todoReducer.js"
import { store } from "../store/store.js"

const { useEffect } = React
const { Link, useSearchParams } = ReactRouterDOM
const { useSelector } = ReactRedux

export function TodoIndex() {
    const { todos, loading } = useSelector(state => state.todoReducer);
    const { filterBy } = useSelector(state => state.todoReducer);
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        store.dispatch({
            type: SET_FILTER_BY,
            payload: { ...todoService.getFilterFromSearchParams(searchParams) }
        })
    }, [])

    useEffect(() => {
        setSearchParams(filterBy)
        todoService.query()
            .catch(err => {
                console.error('err:', err)
                showErrorMsg('Cannot load todos')
            })
    }, [filterBy])

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
                // setTodos(prevTodos => prevTodos.map(currTodo => (currTodo._id !== todo._id) ? currTodo : { ...savedTodo }))
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
            <TodoFilter storeFilterBy={filterBy} />
            <div>
                <Link to="/todo/edit" className="btn" >Add Todo</Link>
            </div>
            <h2>Todos List</h2>
            <TodoList todos={todos} onRemoveTodo={onRemoveTodo} onToggleTodo={onToggleTodo} />
            <hr />
            <h2>Todos Table</h2>
            <div style={{ width: '60%', margin: 'auto' }}>
                <DataTable todos={todos} onRemoveTodo={onRemoveTodo} />
            </div>
        </section>
    )
}