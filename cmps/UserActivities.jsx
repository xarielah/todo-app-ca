const { useSelector } = ReactRedux;

export const UserActivities = () => {
    const { user } = useSelector(state => state.userReducer)
    const activities = user.activities;

    return <section className="user-activities">
        <h2>Your activities</h2>
        {activities.length === 0 && <p>No activities yet</p>}
        {activities.length > 0 &&
            <ul>
                {activities.map(activity =>
                    <li key={activity._id}>{activity.action}</li>
                )}
            </ul>
        }
    </section>
}