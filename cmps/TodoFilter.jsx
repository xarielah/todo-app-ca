import { STATUS_FILTERS } from "../services/todo.service.js";
import { utilService } from "../services/util.service.js";
import { SET_FILTER_BY } from "../store/reducers/todoReducer.js";
import { store } from "../store/store.js";

const { useSelector } = ReactRedux
const { useRef, useState, useEffect } = React
const { Link } = ReactRouterDOM

export function TodoFilter({ storeFilterBy }) {
    const [filterBy, setFilterBy] = useState({})
    const onFilterDebounce = useRef(utilService.debounce(handleFilterChange, 500)).current
    const { user } = useSelector(state => state.userReducer);


    useEffect(() => {
        setFilterBy(storeFilterBy)
    }, []);

    function handleFilterChange(filterBy) {
        store.dispatch({ type: SET_FILTER_BY, payload: { ...filterBy } })
    }

    function handleChange({ target }) {
        const field = target.name
        let value = target.value

        switch (target.type) {
            case 'number':
            case 'range':
                value = +value || ''
                break

            case 'checkbox':
                value = target.checked
                break

            default: break
        }

        setFilterBy({ ...filterBy, [field]: value })
        onFilterDebounce({ ...filterBy, [field]: value });
    }


    const { txt = '', importance = '' } = filterBy
    return (
        <aside className="todo-filter fancy-container">
            <h2>Filter Todos</h2>
            <form onSubmit={e => e.preventDefault()}>
                <label htmlFor="status" style={{ display: 'grid', alignItems: 'center' }}>
                    <select value={filterBy.status} onChange={handleChange} id="status" name="status">
                        <option value={STATUS_FILTERS.ALL}>All</option>
                        <option value={STATUS_FILTERS.ACTIVE}>Active</option>
                        <option value={STATUS_FILTERS.DONE}>Done</option>
                    </select>
                </label>
                <label htmlFor="txt" style={{ display: 'grid', alignItems: 'center' }}>
                    <span>Text: </span>
                    <input
                        value={txt}
                        autoFocus
                        onChange={handleChange}
                        type="search"
                        id="txt"
                        name="txt"
                    />
                </label>
                <label htmlFor="importance" style={{ display: 'grid', alignItems: 'center' }}>
                    <span>Importance: {importance} and above.</span>
                    <input
                        value={importance}
                        onChange={handleChange}
                        type="range"
                        placeholder="By Importance"
                        id="importance"
                        min={1}
                        max={10}
                        name="importance"
                    />
                </label>
            </form >
            {user && <button>
                <Link to="/todo/edit" className="btn">Add Todo</Link>
            </button>
            }
        </aside >
    )
}