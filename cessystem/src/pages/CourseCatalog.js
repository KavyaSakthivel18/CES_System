import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCoursesByStatus, enrollCourse } from "../services/api";

function CourseCatalog() {
    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");
    const role = localStorage.getItem("role");
    const [courses, setCourses] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [enrollingId, setEnrollingId] = useState(null);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const response = await getCoursesByStatus("OPEN");
            setCourses(response.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleEnroll = async (courseId) => {
        if (!userId) {
            navigate("/login");
            return;
        }
        setEnrollingId(courseId);
        try {
            await enrollCourse(userId, courseId);
            showToast("Successfully enrolled!", "success");
            fetchCourses();
        } catch (err) {
            showToast("Enrollment failed. You may already be enrolled.", "error");
        } finally {
            setEnrollingId(null);
        }
    };

    const showToast = (message, type) => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const filteredCourses = courses.filter(
        (c) =>
            c.title.toLowerCase().includes(search.toLowerCase()) ||
            c.courseCode.toLowerCase().includes(search.toLowerCase()) ||
            (c.description && c.description.toLowerCase().includes(search.toLowerCase()))
    );

    const seatPercentage = (c) =>
        c.totalSeats > 0 ? ((c.totalSeats - c.availableSeats) / c.totalSeats) * 100 : 0;

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Course Catalog</h1>
                <p>Browse all open courses and enroll today</p>
            </div>

            <div className="search-bar">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search by title, code, or description..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {loading && (
                <div className="empty-state">
                    <p>Loading courses...</p>
                </div>
            )}

            {!loading && filteredCourses.length === 0 && (
                <div className="empty-state">
                    <div className="empty-icon">🔍</div>
                    <h3>No Courses Found</h3>
                    <p>
                        {search
                            ? "No courses match your search. Try a different keyword."
                            : "No open courses available right now."}
                    </p>
                </div>
            )}

            <div className="course-grid">
                {filteredCourses.map((course) => (
                    <div className="course-card" key={course.id}>
                        <div className="course-code">{course.courseCode}</div>
                        <h3>{course.title}</h3>
                        <p className="course-desc">{course.description || "No description available"}</p>

                        <div className="course-meta">
                            <span>📅 Start: {course.startDate || "TBD"}</span>
                            <span>🏁 End: {course.endDate || "TBD"}</span>
                        </div>

                        <div className="seats-bar">
                            <div
                                className="seats-bar-fill"
                                style={{
                                    width: `${seatPercentage(course)}%`,
                                    background:
                                        seatPercentage(course) > 80
                                            ? "var(--danger)"
                                            : seatPercentage(course) > 50
                                                ? "var(--warning)"
                                                : "var(--success)"
                                }}
                            />
                        </div>

                        <div className="course-footer">
                            <div>
                                <span className="badge badge-open">OPEN</span>
                                <span style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginLeft: "0.5rem" }}>
                                    {course.availableSeats}/{course.totalSeats} seats
                                </span>
                            </div>
                            {role === "STUDENT" && (
                                <button
                                    className="btn btn-primary btn-sm"
                                    onClick={() => handleEnroll(course.id)}
                                    disabled={enrollingId === course.id || course.availableSeats === 0}
                                >
                                    {enrollingId === course.id ? "Enrolling..." : course.availableSeats === 0 ? "Full" : "Enroll"}
                                </button>
                            )}
                            {!userId && (
                                <button className="btn btn-outline btn-sm" onClick={() => navigate("/login")}>
                                    Sign in
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {toast && (
                <div className={`toast toast-${toast.type}`}>
                    {toast.type === "success" ? "✅" : "❌"} {toast.message}
                </div>
            )}
        </div>
    );
}

export default CourseCatalog;
