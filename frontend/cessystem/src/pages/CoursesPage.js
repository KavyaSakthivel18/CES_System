import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { api } from '../services/api';
import CourseCard from '../components/CourseCard';

const duplicateDates = { startDate: '2026-05-01', endDate: '2026-08-31' };

const mockCourses = [
    { id: 1, title: 'Introduction to React', description: 'Learn the basics of React and component-driven architecture.', ...duplicateDates },
    { id: 2, title: 'Advanced JavaScript', description: 'Deep dive into closures, prototypes, and async programming.', ...duplicateDates },
    { id: 3, title: 'Node.js Backend Development', description: 'Build scalable APIs using Express and Node.js.', ...duplicateDates },
    { id: 4, title: 'Data Structures and Algorithms', description: 'Master problem-solving with core computer science concepts.', ...duplicateDates },
    { id: 5, title: 'CSS Flexbox & Grid Masterclass', description: 'Build responsive layouts effortlessly with modern CSS.', ...duplicateDates },
    { id: 6, title: 'Database Design with PostgreSQL', description: 'Learn to design efficient and normalized relational databases.', ...duplicateDates },
    { id: 7, title: 'Fullstack Next.js', description: 'Create SEO friendly server-rendered applications.', ...duplicateDates },
    { id: 8, title: 'DevOps for Beginners', description: 'Introduction to Docker, CI/CD, and AWS deployment.', ...duplicateDates },
    { id: 9, title: 'Python for Data Science', description: 'Analyze data using Pandas, NumPy, and Matplotlib.', ...duplicateDates },
    { id: 10, title: 'Cybersecurity Fundamentals', description: 'Understand basic network security and threat mitigation protocols.', ...duplicateDates }
];

const CoursesPage = () => {
    const [courses, setCourses] = useState([]);
    const [enrollingCourse, setEnrollingCourse] = useState(null);
    const [enrollForm, setEnrollForm] = useState({ name: '', username: '' });

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await api.getCourses();
                if (response.ok) {
                    const data = await response.json();
                    setCourses(data.length > 0 ? data : mockCourses);
                } else {
                    setCourses(mockCourses);
                }
            } catch (error) {
                console.error('Failed to fetch courses:', error);
                setCourses(mockCourses);
            }
        };

        fetchCourses();

        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            setEnrollForm({ name: user.name || '', username: user.username || '' });
        }
    }, []);

    const handleEnrollClick = (course) => {
        setEnrollingCourse(course);
    };

    const handleEnrollSubmit = async (e) => {
        e.preventDefault();
        if (!enrollingCourse) return;

        const user = JSON.parse(localStorage.getItem('user')) || { id: Math.floor(Math.random() * 1000) };
        const enrollmentData = {
            courseId: enrollingCourse.id,
            courseTitle: enrollingCourse.title,
            courseStartDate: enrollingCourse.startDate || '2026-05-01',
            courseEndDate: enrollingCourse.endDate || '2026-08-31',
            studentId: user.id,
            studentName: enrollForm.name,
            studentUsername: enrollForm.username,
            enrollmentDate: new Date().toISOString()
        };

        try {
            await api.createEnrollment(enrollmentData);
        } catch (err) {
            console.log('API connection failed');
        }

        const localEnrollments = JSON.parse(localStorage.getItem('my_enrollments') || '[]');
        localEnrollments.push(enrollmentData);
        localStorage.setItem('my_enrollments', JSON.stringify(localEnrollments));

        alert(`Successfully enrolled in ${enrollingCourse.title}!`);
        setEnrollingCourse(null);
    };

    return (
        <div className="page-layout">
            <Navbar />
            <main className="container">
                <header className="page-header">
                    <h1>Available Courses</h1>
                    <p>Browse and enroll in the courses below.</p>
                </header>

                {enrollingCourse && (
                    <div className="auth-wrapper" style={{ minHeight: 'auto', marginBottom: '2rem' }}>
                        <div className="auth-container" style={{ border: '2px solid var(--primary)' }}>
                            <h3>Enroll in: {enrollingCourse.title}</h3>
                            <form onSubmit={handleEnrollSubmit}>
                                <div className="form-group">
                                    <label>Your Name</label>
                                    <input type="text" value={enrollForm.name} onChange={e => setEnrollForm({ ...enrollForm, name: e.target.value })} required />
                                </div>
                                <div className="form-group">
                                    <label>Your Username</label>
                                    <input type="text" value={enrollForm.username} onChange={e => setEnrollForm({ ...enrollForm, username: e.target.value })} required />
                                </div>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button type="submit" className="btn-primary">Confirm Enrollment</button>
                                    <button type="button" className="btn-secondary" onClick={() => setEnrollingCourse(null)}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {courses.length === 0 ? (
                    <div className="empty-state">
                        <p>No courses match your criteria at the moment.</p>
                    </div>
                ) : (
                    <div className="course-list">
                        {courses.map(course => (
                            <CourseCard key={course.id} course={course} onEnroll={handleEnrollClick} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default CoursesPage;
