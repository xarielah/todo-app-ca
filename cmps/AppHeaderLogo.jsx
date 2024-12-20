const { Link } = ReactRouterDOM

export const AppHeaderLogo = () => {
    return (
        <h1 className='app-logo'>
            <Link to="/">
                Two-DO!
            </Link>
            <div className='underline-wrapper'>
                <div className='underline-base underline-1'></div>
                <div className='underline-base underline-2'></div>
                <div className='underline-base underline-3'></div>
            </div>
        </h1>
    )
}