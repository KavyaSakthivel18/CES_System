import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/signin');
    };

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <Link to="/dashboard">CES System</Link>
            </div>
            <div className="navbar-links">
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/courses">Courses</Link>
                <Link to="/enrollments">My Enrollments</Link>
                <Link to="/create-course">Create Course</Link>
                <button onClick={handleLogout} className="btn-logout">Logout</button>
            </div>
        </nav>
    );
};

export default Navbar;
