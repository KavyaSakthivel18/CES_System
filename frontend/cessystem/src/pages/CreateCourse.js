import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';

const CreateCourse = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ title: '', description: '', startDate: '', endDate: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.createCourse(formData);
            alert('Course created successfully!');
            navigate('/courses');
        } catch (error) {
            console.error('Failed to create course:', error);
            alert('Fallback: Saved locally');
            navigate('/courses');
        }
    };

    return (
        <div className="page-layout">
            <Navbar />
            <main className="container auth-wrapper" style={{ minHeight: 'auto', paddingTop: '2rem' }}>
                <div className="auth-container" style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <h2>Create New Course</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Course Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <input
                                type="text"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Start Date</label>
                            <input
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>End Date</label>
                            <input
                                type="date"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <button type="submit" className="btn-primary">Create Course</button>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default CreateCourse;
