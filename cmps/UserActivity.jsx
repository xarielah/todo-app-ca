export const UserActivity = ({ activity }) => {
    return <li style={{ padding: "1em", display }}>
        <span>{activity.action}</span>
        <span>{moment(activity.createdAt).fromNow()}</span>
    </li>
}