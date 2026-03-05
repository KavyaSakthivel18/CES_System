import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCoursesByStatus, enrollCourse } from "../services/api";
//in this home page course were listed and enrolling willl be done here
function HomePage() {
    const navigate = useNavigate();
    const userName = localStorage.getItem("userName");
    const role = localStorage.getItem("role");
    const userId = localStorage.getItem("userId");
    const [courses, setCourses] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [enrollingId, setEnrollingId] = useState(null);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        fetchOpenCourses();
    }, []);

    const fetchOpenCourses = async () => {
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
            fetchOpenCourses();
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
            c.courseCode.toLowerCase().includes(search.toLowerCase())
    );

    const seatPercentage = (c) =>
        c.totalSeats > 0 ? ((c.totalSeats - c.availableSeats) / c.totalSeats) * 100 : 0;

    return (
        <div>
            <div className="hero">
                <h1>
                    {/* Learn Without Limits with{" "} */}
                    <span className="gradient-text">Course Enrollment System</span>
                </h1>
                <p>
                    Discover and enroll in courses designed to accelerate your learning journey. Browse open courses and start today.
                </p>
                <div className="hero-actions">
                    {!userName && (
                        <>
                            <button className="btn btn-primary" onClick={() => navigate("/signup")}>
                                Get Started
                            </button>
                            <button className="btn btn-outline" onClick={() => navigate("/login")}>
                                Sign In
                            </button>
                        </>
                    )}
                    {userName && role === "STUDENT" && (
                        <button className="btn btn-primary" onClick={() => navigate("/courses")}>
                            Browse All Courses
                        </button>
                    )}
                    {userName && role === "ADMIN" && (
                        <button className="btn btn-primary" onClick={() => navigate("/admin")}>
                            Go to Dashboard
                        </button>
                    )}
                </div>
            </div>

            <div className="page-container">
                <div className="page-header">
                    <h1>Open Courses</h1>
                    <p>Currently available for enrollment</p>
                </div>

                <div className="search-bar">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search courses by title or code..."
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
                        <div className="empty-icon">📚</div>
                        <h3>No Open Courses</h3>
                        <p>There are no open courses available right now. Check back later.</p>
                    </div>
                )}

                <div className="course-grid">
                    {filteredCourses.map((course) => (
                        <div className="course-card" key={course.id}>
                            <div className="course-code">{course.courseCode}</div>
                            <h3>{course.title}</h3>
                            <p className="course-desc">{course.description || "No description available"}</p>

                            <div className="course-meta">
                                <span>📅 {course.startDate || "TBD"}</span>
                                <span>➡️ {course.endDate || "TBD"}</span>
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
                                <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                                    {course.availableSeats}/{course.totalSeats} seats left
                                </span>
                                {role === "STUDENT" && (
                                    <button
                                        className="btn btn-primary btn-sm"
                                        onClick={() => handleEnroll(course.id)}
                                        disabled={enrollingId === course.id || course.availableSeats === 0}
                                    >
                                        {enrollingId === course.id ? "Enrolling..." : course.availableSeats === 0 ? "Full" : "Enroll Now"}
                                    </button>
                                )}
                                {!userName && (
                                    <button className="btn btn-outline btn-sm" onClick={() => navigate("/login")}>
                                        Sign in to Enroll
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {toast && (
                <div className={`toast toast-${toast.type}`}>
                    {toast.type === "success" ? "✅" : "❌"} {toast.message}
                </div>
            )}
        </div>
    );
}

export default HomePage;
