import { UserActivity } from "./UserActivity.jsx";

const { useSelector } = ReactRedux;

export const UserActivities = () => {
    const { user } = useSelector(state => state.userReducer)
    const activities = user.activities;

    return <section className="user-activities">
        {activities.length === 0 && <p>No activities yet</p>}
        {activities.length > 0 &&
            <ul className="user-activities-list scrollable-list-container" style={{ margin: '0 0 1em 0' }}>
                {activities.map(activity =>
                    <UserActivity activity={activity} key={activity._id} />
                )}
            </ul>
        }
    </section>
}