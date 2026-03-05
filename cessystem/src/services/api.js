import axios from "axios";

const API = axios.create({
  baseURL: "https://ces-system.onrender.com/api"
});
//fetching APi's from backend
export const createUser = (data) => API.post("/users", data);
export const getUsers = () => API.get("/users");
export const getUserById = (id) => API.get(`/users/${id}`);
export const updateUser = (id, data) => API.put(`/users/${id}`, data);
export const deleteUser = (id) => API.delete(`/users/${id}`);

export const getCourses = () => API.get("/courses");
export const getCoursesByStatus = (status) => API.get(`/courses?status=${status}`);
export const createCourse = (data) => API.post("/courses", data);
export const updateCourse = (id, data) => API.put(`/courses/${id}`, data);
export const deleteCourse = (id) => API.delete(`/courses/${id}`);
export const openCourse = (id) => API.put(`/courses/${id}/open`);
export const closeCourse = (id) => API.put(`/courses/${id}/close`);
export const completeCourse = (id) => API.put(`/courses/${id}/complete`);

export const getAllEnrollments = () => API.get("/enrollments");
export const enrollCourse = (studentId, courseId) =>
  API.post(`/enrollments?studentId=${studentId}&courseId=${courseId}`);
export const cancelEnrollment = (id) => API.put(`/enrollments/${id}/cancel`);
export const getStudentEnrollments = (studentId) =>
  API.get(`/enrollments/student/${studentId}`);
export const getStudentsInCourse = (courseId) =>
  API.get(`/enrollments/course/${courseId}/students`);
export const countStudentsInCourse = (courseId) =>
  API.get(`/enrollments/course/${courseId}/count`);
