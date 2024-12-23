import { SET_CURRENT_PAGE } from "../store/reducers/todoReducer.js";
import { store } from "../store/store.js";

const { useSelector } = ReactRedux;

export const TodoPagination = () => {
    const { pagination: { currentPage, totalPages } } = useSelector(state => state.todoReducer)

    const handlePageChange = (page) => {
        store.dispatch({ type: SET_CURRENT_PAGE, payload: page })
    }

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

    return <section className="todo-pagination">
        {pages.map(page => {
            const isCurrentPage = page === currentPage
            return <button
                key={page}
                onClick={() => handlePageChange(page)}
                className="btn"
                style={{ backgroundColor: isCurrentPage ? 'var(--supportive-green)' : '#eee', color: isCurrentPage ? '#fff' : '#000' }}
            >
                {page}
            </button>
        })}
    </section>
}