import React from 'react';
import Navbar from '../components/Navbar';

const Dashboard = () => {
    return (
        <div className="page-layout">
            <Navbar />
            <main className="container">
                <header className="page-header">
                    <h1>Dashboard</h1>
                    <p>Welcome back to the Course Enrollment System.</p>
                </header>

                <div className="dashboard-grid">
                    <div className="dashboard-card">
                        <h3>My Enrollments</h3>
                        <p>You have not enrolled in any recent courses.</p>
                        <button className="btn-secondary">View Details</button>
                    </div>
                    <div className="dashboard-card">
                        <h3>Account Settings</h3>
                        <p>Update your profile and preferences.</p>
                        <button className="btn-secondary">Settings</button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
