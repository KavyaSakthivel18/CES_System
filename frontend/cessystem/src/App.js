import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import CoursesPage from './pages/CoursesPage';
import EnrollmentsPage from './pages/EnrollmentsPage';
import CreateCourse from './pages/CreateCourse';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Navigate to="/signin" replace />} />
                    <Route path="/signin" element={<SignIn />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/courses" element={<CoursesPage />} />
                    <Route path="/enrollments" element={<EnrollmentsPage />} />
                    <Route path="/create-course" element={<CreateCourse />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
