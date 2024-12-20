import { TodoPreviewImportance } from "./TodoPreviewImportance.jsx";

export function TodoPreview({ todo, onToggleTodo }) {
    return (
        <article className="todo-preview">
            <h2 onClick={onToggleTodo} className={todo.isDone ? 'done' : ''} style={{ marginRight: '.5em' }}>
                Todo: {todo.txt}
            </h2>
            <TodoPreviewImportance importance={todo.importance} />
        </article>
    )
}
