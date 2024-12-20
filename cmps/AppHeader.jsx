const { useEffect } = React
const { Link, NavLink } = ReactRouterDOM
const { useNavigate } = ReactRouter
const { useSelector } = ReactRedux

import { showErrorMsg } from '../services/event-bus.service.js'
import { userService } from '../services/user.service.js'
import { LoginSignup } from './LoginSignup.jsx'
import { UserMsg } from "./UserMsg.jsx"


export function AppHeader() {
    const navigate = useNavigate()
    const { user } = useSelector(state => state.userReducer)

    useEffect(() => {
        userService.getLoggedinUser()
    }, [])

    function onLogout() {
        userService.logout()
            .then(() => {
                onSetUser(null)
            })
            .catch((err) => {
                showErrorMsg('OOPs try again')
            })
    }

    function onSetUser(user) {
        setUser(user)
        navigate('/')
    }

    return (
        <header className="app-header full main-layout">
            <section className="header-container">
                <h1>
                    <Link to="/">
                        Two-DO!
                    </Link>
                </h1>
                {user ? (
                    <section style={{ margin: '0 20px' }}>
                        <Link to={`/user/${user._id}`}>Hello {user.fullname}</Link>
                        <button onClick={onLogout}>Logout</button>
                        <span style={{ margin: '0 10px' }}>|</span>
                        <span>Balance: {user.balance.toLocaleString()}</span>
                    </section>
                ) : (
                    <section>
                        <LoginSignup onSetUser={onSetUser} />
                    </section>
                )}
                <nav className="app-nav">
                    <NavLink to="/">Home</NavLink>
                    <NavLink to="/about">About</NavLink>
                    <NavLink to="/todo">Todos</NavLink>
                    <NavLink to="/dashboard">Dashboard</NavLink>
                    <NavLink to="/user">Settings</NavLink>
                </nav>
            </section>
            <UserMsg />
        </header>
    )
}
