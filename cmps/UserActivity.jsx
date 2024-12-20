export const UserActivity = ({ activity }) => {
    return <li style={{ padding: ".5em", display: "flex", justifyContent: "space-between" }}>
        <span>{activity.action}</span>
        <span style={{ color: 'gray' }}>{moment(activity.createdAt).fromNow()}</span>
    </li>
}