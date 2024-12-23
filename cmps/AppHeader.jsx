const { useEffect } = React
const { Link, NavLink } = ReactRouterDOM
const { useNavigate } = ReactRouter
const { useSelector } = ReactRedux

import { showErrorMsg } from '../services/event-bus.service.js'
import { userService } from '../services/user.service.js'
import { AppHeaderLogo } from './AppHeaderLogo.jsx'
import { AppStatusBar } from './AppStatusBar.jsx'
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
            .catch((err) => {
                showErrorMsg('OOPs try again')
            })
    }

    function onSetUser() {
        navigate('/')
    }

    return (
        <React.Fragment>

            <header className="app-header full main-layout">
                <AppStatusBar />
                <section className="header-container">
                    <AppHeaderLogo />
                    <section className='info-container'>
                        {user ? (
                            <section className='user-info' style={{ margin: '0 20px' }}>
                                <Link to={`/user/${user._id}`}>Hello {user.fullname}</Link>
                                <button className='btn-distructive' onClick={onLogout}>Logout</button>
                                <span style={{ margin: '0 10px' }}>|</span>
                                <span>Balance: {user.balance.toLocaleString()}</span>
                            </section>
                        ) : (
                            <section className='user-info'>
                                <LoginSignup onSetUser={onSetUser} />
                            </section>
                        )}
                        <nav className="app-nav">
                            <NavLink to="/">Home</NavLink>
                            <NavLink to="/about">About</NavLink>
                            <NavLink to="/todo">Todos</NavLink>
                            <NavLink to="/dashboard">Dashboard</NavLink>
                            {user && <NavLink to="/user">Settings</NavLink>}
                        </nav>
                    </section>
                </section>
                <UserMsg />
            </header>
        </React.Fragment>
    )
}
