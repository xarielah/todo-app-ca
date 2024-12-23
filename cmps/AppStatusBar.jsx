const { useSelector } = ReactRedux;

export const AppStatusBar = () => {
    const { done, total } = useSelector(state => state.statusBarReducer)
    const { loading } = useSelector(state => state.todoReducer)

    if (loading) return null
    const progress = Math.round(total === 0 ? total : (done / total * 100));
    return <section className="app-status-bar">
        <progress value={progress} max="100" style={{ width: '100%' }} />
    </section>
}