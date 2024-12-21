export const UserActivity = ({ activity }) => {
    return <li className="user-activity">
        <span>{activity.action}</span>
        <span style={{ color: 'gray' }}>{moment(activity.createdAt).fromNow()}</span>
    </li>
}