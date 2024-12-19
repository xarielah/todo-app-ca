import { todoService } from "../services/todo.service.js";
import { utilService } from "../services/util.service.js";

const { useSelector } = ReactRedux
const { useRef, useState, useEffect } = React
const { useSearchParams } = ReactRouterDOM

export function TodoFilter() {
    const [searchParams, setSearchParams] = useSearchParams()
    const [filterBy, setFilterBy] = useState(todoService.getFilterFromSearchParams(searchParams))
    const onFilterDebounce = useRef(utilService.debounce(handleFilterChange, 500)).current

    useEffect(() => {
        onFilterDebounce({ ...filterBy })
    }, [filterBy])

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
    }

    function handleFilterChange(filterBy) {
        setSearchParams(utilService.getTruthyValues(filterBy))
    }

    const { txt, importance } = filterBy
    return (
        <section className="todo-filter">
            <h2>Filter Todos</h2>
            <form onSubmit={e => e.preventDefault()}>
                <input value={txt} onChange={handleChange}
                    type="search" placeholder="By Txt" id="txt" name="txt"
                />
                <label htmlFor="importance">Importance: </label>
                <input value={importance} onChange={handleChange}
                    type="number" placeholder="By Importance" id="importance" name="importance"
                />
            </form>
        </section>
    )
}