import { UserActivities } from "../cmps/UserActivities.jsx";

const { useSelector } = ReactRedux;
const { useNavigate } = ReactRouterDOM;
const { useEffect } = React

export const UserDetails = () => {
    const navigate = useNavigate();
    const { user } = useSelector(state => state.userReducer)

    useEffect(() => {
        // if (!user)
        // navigate("/")
    }, [])

    if (user)
        return <section className="user-details">
            <aside className="fancy-container">
                <h1 style={{ fontSize: "2em" }}>Welcome {user.fullname}!</h1>
                <h2>Your balance is: {user.balance.toLocaleString()}</h2>
            </aside>
            <section>
                <h2>Your activities</h2>
                <UserActivities />
            </section>
        </section>
}