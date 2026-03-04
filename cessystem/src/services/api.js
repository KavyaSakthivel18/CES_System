import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api"
});

/* USER APIs */

export const createUser = (data) => API.post("/users", data);

export const getUsers = () => API.get("/users");

/* COURSE APIs */

export const getCourses = () => API.get("/courses");

export const createCourse = (data) => API.post("/courses", data);

/* ENROLLMENT APIs */

export const enrollCourse = (data) => API.post("/enrollments", data);

export const getStudentEnrollments = (studentId) =>
  API.get(`/enrollments/student/${studentId}`);

export const cancelEnrollment = (id) =>
  API.put(`/enrollments/${id}/cancel`);