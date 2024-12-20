export const TodoPreviewImportance = ({ importance }) => {
    const importanceClass = importance < 3 ? 'low' : importance < 7 ? 'normal' : 'urgent'
    return <span className={"importance importance-" + importanceClass}>
        <span>{importance}</span>
        <span>{importanceClass.toUpperCase()}</span>
    </span>
}   