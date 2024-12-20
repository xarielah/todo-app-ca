import { utilService } from "../services/util.service.js";
import { SET_FILTER_BY } from "../store/reducers/todoReducer.js";
import { store } from "../store/store.js";

const { useSelector } = ReactRedux
const { useRef, useState, useEffect } = React
const { useSearchParams } = ReactRouterDOM

export function TodoFilter({ storeFilterBy }) {
    const [filterBy, setFilterBy] = useState({})
    const onFilterDebounce = useRef(utilService.debounce(handleFilterChange, 500)).current

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
        <section className="todo-filter">
            <h2>Filter Todos</h2>
            <form onSubmit={e => e.preventDefault()}>
                <input
                    value={txt}
                    onChange={handleChange}
                    type="search"
                    placeholder="By Txt"
                    id="txt"
                    name="txt"
                />
                <label htmlFor="importance">Importance: </label>
                <input
                    value={importance}
                    onChange={handleChange}
                    type="number"
                    placeholder="By Importance"
                    id="importance"
                    name="importance"
                />
            </form>
        </section>
    )
}