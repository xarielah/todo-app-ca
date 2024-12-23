const { useSelector } = ReactRedux;

export const AppStatusBar = () => {
    const { done, total } = useSelector(state => state.statusBarReducer)
    const { loading } = useSelector(state => state.todoReducer)

    if (loading || total === 0) return null
    const progress = done / total;
    const percent = Math.round(progress * 100)
    console.log("🚀 ~ AppStatusBar ~ percent:", percent)
    return <section className="app-status-bar">
        <span>{percent}%</span>
        <progress value={progress} style={{ width: '100%' }} />
    </section>
}