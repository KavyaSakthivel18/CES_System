import { Link, useLocation, useNavigate } from "react-router-dom";
// Navbar component that displays navigation links based on user role and handles logout functionality
function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const userName = localStorage.getItem("userName");
    const role = localStorage.getItem("role");

    const handleLogout = () => {
        localStorage.removeItem("userId");
        localStorage.removeItem("userName");
        localStorage.removeItem("role");
        navigate("/login");
    };

    const isActive = (path) => location.pathname === path ? "active" : "";

    if (!userName) return null;

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-brand">CES System</Link>

            <div className="navbar-links">
                <Link to="/" className={isActive("/")}>Home</Link>
                <Link to="/courses" className={isActive("/courses")}>Courses</Link>

                {role === "STUDENT" && (
                    <Link to="/my-enrollments" className={isActive("/my-enrollments")}>My Enrollments</Link>
                )}

                {role === "ADMIN" && (
                    <>
                        <Link to="/admin" className={isActive("/admin")}>Dashboard</Link>
                        <Link to="/admin/users" className={isActive("/admin/users")}>Users</Link>
                        <Link to="/admin/courses" className={isActive("/admin/courses")}>Manage Courses</Link>
                        <Link to="/admin/enrollments" className={isActive("/admin/enrollments")}>Enrollments</Link>
                    </>
                )}
            </div>

            <div className="navbar-right">
                <span className="navbar-user">
                    {userName}
                    <span className="role-tag">{role}</span>
                </span>
                <button className="btn-logout" onClick={handleLogout}>Logout</button>
            </div>
        </nav>
    );
}

export default Navbar;
