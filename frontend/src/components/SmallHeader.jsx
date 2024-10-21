const SmallHeader = ({ setIsAuthenticated, setToken }) => {
    const handleLogout = () => {
        console.log("logout")
        setToken('token', '');
        setIsAuthenticated(false);
    }

    return (
        <div className="small-header-container">
            <div className="small-header" onClick={handleLogout}>
                Logout
            </div>
        </div>
    )
}

export default SmallHeader;