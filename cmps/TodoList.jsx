import { TodoPreview } from "./TodoPreview.jsx";
const { Link } = ReactRouterDOM
const { useState, useRef, useEffect } = React

export function TodoList({ todos, onRemoveTodo, onToggleTodo }) {
    const [removeTodoId, setRemoveTodoId] = useState('');
    const dialogRef = useRef();

    useEffect(() => {
        if (removeTodoId) {
            dialogRef.current.showModal()
            dialogRef.current.addEventListener("close", handleCancelDialog)
        } else {
            dialogRef.current.close();
        }
        return () => dialogRef.current && dialogRef.current.removeEventListener("close", handleCancelDialog)
    }, [removeTodoId])

    const handleRemoveDialog = () => {
        onRemoveTodo(removeTodoId)
        setRemoveTodoId('')
    }

    const handleCancelDialog = () => {
        setRemoveTodoId('')
    }

    return (
        <React.Fragment>
            <dialog ref={dialogRef} className="remove-todo-dialog">
                <header>
                    <h1>Removing Todo (id: {removeTodoId})</h1>
                </header>
                <p>Are you sure you want to remove this todo?</p>
                <footer>
                    <button onClick={handleCancelDialog}>Cancel</button>
                    <button onClick={() => handleRemoveDialog(removeTodoId)}>Remove</button>
                </footer>
            </dialog>
            <ul className="todo-list scrollable-list-container">
                {todos.length === 0 && <p>There are no todos to show here.</p>}
                {todos.length > 0 && todos.map(todo => {
                    console.log(todo)
                    return (<li key={todo._id}>
                        <div style={{ borderLeft: `5px solid ${todo.color}` }}>
                            <TodoPreview
                                onRemoveTodo={onRemoveTodo}
                                todo={todo}
                                onToggleTodo={() => onToggleTodo(todo)}
                            />
                        </div>
                        <section>
                            <button onClick={() => setRemoveTodoId(todo._id)}>Remove</button>
                            <button><Link to={`/todo/${todo._id}`}>Details</Link></button>
                            <button><Link to={`/todo/edit/${todo._id}`}>Edit</Link></button>
                        </section>
                    </li>)
                }
                )}
            </ul>
        </React.Fragment>
    )
}