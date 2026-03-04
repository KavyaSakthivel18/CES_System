import React from 'react';

const CourseCard = ({ course, onEnroll }) => {
    return (
        <div className="course-item">
            <h3>{course.title || 'Course Title'}</h3>
            <p>{course.description || 'Description not available for this course.'}</p>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                <p style={{ margin: '0.2rem 0' }}><strong>Start Date:</strong> {course.startDate || '2026-05-01'}</p>
                <p style={{ margin: '0.2rem 0' }}><strong>End Date:</strong> {course.endDate || '2026-08-31'}</p>
            </div>
            <button className="btn-primary" onClick={() => onEnroll(course)}>Enroll Now</button>
        </div>
    );
};

export default CourseCard;
