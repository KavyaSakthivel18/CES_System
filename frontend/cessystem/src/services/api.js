export const BASE_URL = 'http://localhost:8080/api';

export const api = {
    getUser: (id) => fetch(`${BASE_URL}/users/${id}`),
    getUsers: () => fetch(`${BASE_URL}/users`),
    createUser: (userData) => fetch(`${BASE_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    }),
    updateUser: (id, userData) => fetch(`${BASE_URL}/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    }),
    deleteUser: (id) => fetch(`${BASE_URL}/users/${id}`, { method: 'DELETE' }),

    getEnrollments: () => fetch(`${BASE_URL}/enrollments`),
    createEnrollment: (data) => fetch(`${BASE_URL}/enrollments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }),
    cancelEnrollment: (id) => fetch(`${BASE_URL}/enrollments/${id}/cancel`, { method: 'PUT' }),
    getStudentEnrollments: (studentId) => fetch(`${BASE_URL}/enrollments/student/${studentId}`),
    getCourseStudents: (courseId) => fetch(`${BASE_URL}/enrollments/course/${courseId}/students`),
    getCourseEnrollmentCount: (courseId) => fetch(`${BASE_URL}/enrollments/course/${courseId}/count`),

    getCourses: () => fetch(`${BASE_URL}/courses`),
    createCourse: (data) => fetch(`${BASE_URL}/courses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }),
    updateCourse: (id, data) => fetch(`${BASE_URL}/courses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }),
    deleteCourse: (id) => fetch(`${BASE_URL}/courses/${id}`, { method: 'DELETE' }),
    openCourse: (id) => fetch(`${BASE_URL}/courses/${id}/open`, { method: 'PUT' }),
    completeCourse: (id) => fetch(`${BASE_URL}/courses/${id}/complete`, { method: 'PUT' }),
    closeCourse: (id) => fetch(`${BASE_URL}/courses/${id}/close`, { method: 'PUT' }),
};
