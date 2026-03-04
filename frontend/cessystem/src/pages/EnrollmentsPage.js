import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { api } from '../services/api';

const EnrollmentsPage = () => {
    const [enrollments, setEnrollments] = useState([]);

    useEffect(() => {
        const fetchEnrollments = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                if (!user) return;

                const response = await api.getStudentEnrollments(user.id);
                if (response.ok) {
                    const data = await response.json();
                    setEnrollments(data);
                } else {
                    const localEnrollments = JSON.parse(localStorage.getItem('my_enrollments') || '[]');
                    setEnrollments(localEnrollments);
                }
            } catch (error) {
                console.error('Failed to fetch enrollments:', error);
                const localEnrollments = JSON.parse(localStorage.getItem('my_enrollments') || '[]');
                setEnrollments(localEnrollments);
            }
        };

        fetchEnrollments();
    }, []);

    return (
        <div className="page-layout">
            <Navbar />
            <main className="container">
                <header className="page-header">
                    <h1>My Enrollments</h1>
                    <p>Access and manage your enrolled courses.</p>
                </header>

                {enrollments.length === 0 ? (
                    <div className="empty-state">
                        <p>You have not enrolled in any courses yet.</p>
                    </div>
                ) : (
                    <div className="course-list">
                        {enrollments.map((enrollment, index) => (
                            <div key={enrollment.id || index} className="course-item">
                                <h3>{enrollment.courseTitle || 'Course Title'}</h3>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                                    <p style={{ margin: '0.2rem 0' }}><strong>Start Date:</strong> {enrollment.courseStartDate || '2026-05-01'}</p>
                                    <p style={{ margin: '0.2rem 0' }}><strong>End Date:</strong> {enrollment.courseEndDate || '2026-08-31'}</p>
                                </div>
                                <p><strong>Enrolled as:</strong> {enrollment.studentName} ({enrollment.studentUsername})</p>
                                <p>Status: Active</p>
                                <button className="btn-primary" onClick={() => alert(`Opening course: ${enrollment.courseTitle}`)}>Open Course</button>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default EnrollmentsPage;
