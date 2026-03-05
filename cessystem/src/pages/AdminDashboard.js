import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUsers, getCourses, getAllEnrollments } from "../services/api";

function AdminDashboard() {
    const navigate = useNavigate();
    const [stats, setStats] = useState({ users: 0, courses: 0, enrollments: 0, openCourses: 0, activeEnrollments: 0 });
    const [recentEnrollments, setRecentEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const [usersRes, coursesRes, enrollmentsRes] = await Promise.all([
                getUsers(),
                getCourses(),
                getAllEnrollments()
            ]);

            const courses = coursesRes.data;
            const enrollments = enrollmentsRes.data;

            setStats({
                users: usersRes.data.length,
                courses: courses.length,
                enrollments: enrollments.length,
                openCourses: courses.filter((c) => c.status === "OPEN").length,
                activeEnrollments: enrollments.filter((e) => e.status === "ENROLLED").length
            });

            setRecentEnrollments(enrollments.slice(-5).reverse());
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const downloadCSV = (data, headers, filename) => {
        const csvHeaders = headers.join(",");
        const csvRows = data.map((row) => headers.map((h) => {
            const val = row[h] !== undefined && row[h] !== null ? String(row[h]) : "";
            return `"${val.replace(/"/g, '""')}"`;
        }).join(","));
        const csvContent = [csvHeaders, ...csvRows].join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
        URL.revokeObjectURL(link.href);
    };

    const handleDownloadUsers = async () => {
        try {
            const res = await getUsers();
            downloadCSV(res.data, ["id", "name", "role"], "users_data.csv");
        } catch (err) {
            console.error(err);
        }
    };

    const handleDownloadCourses = async () => {
        try {
            const res = await getCourses();
            downloadCSV(res.data, ["id", "courseCode", "title", "description", "totalSeats", "availableSeats", "startDate", "endDate", "status"], "courses_data.csv");
        } catch (err) {
            console.error(err);
        }
    };

    const handleDownloadEnrollments = async () => {
        try {
            const res = await getAllEnrollments();
            const flat = res.data.map((e) => ({
                id: e.id,
                studentName: e.student ? e.student.name : "",
                studentId: e.student ? e.student.id : "",
                courseTitle: e.course ? e.course.title : "",
                courseCode: e.course ? e.course.courseCode : "",
                courseId: e.course ? e.course.id : "",
                enrolledAt: e.enrolledAt || "",
                status: e.status
            }));
            downloadCSV(flat, ["id", "studentName", "studentId", "courseTitle", "courseCode", "courseId", "enrolledAt", "status"], "enrollments_data.csv");
        } catch (err) {
            console.error(err);
        }
    };

    const handleDownloadAll = async () => {
        await handleDownloadUsers();
        await handleDownloadCourses();
        await handleDownloadEnrollments();
    };

    if (loading) {
        return (
            <div className="page-container">
                <div className="empty-state"><p>Loading dashboard...</p></div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Admin Dashboard</h1>
                <p>System overview and quick actions</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card" onClick={() => navigate("/admin/users")} style={{ cursor: "pointer" }}>
                    <div className="stat-icon">👥</div>
                    <div className="stat-value">{stats.users}</div>
                    <div className="stat-label">Total Users</div>
                </div>
                <div className="stat-card" onClick={() => navigate("/admin/courses")} style={{ cursor: "pointer" }}>
                    <div className="stat-icon">📚</div>
                    <div className="stat-value">{stats.courses}</div>
                    <div className="stat-label">Total Courses</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">🟢</div>
                    <div className="stat-value">{stats.openCourses}</div>
                    <div className="stat-label">Open Courses</div>
                </div>
                <div className="stat-card" onClick={() => navigate("/admin/enrollments")} style={{ cursor: "pointer" }}>
                    <div className="stat-icon">🎓</div>
                    <div className="stat-value">{stats.activeEnrollments}</div>
                    <div className="stat-label">Active Enrollments</div>
                </div>
            </div>

            <div className="download-section">
                <h3>📥 Export Data</h3>
                <div className="download-btns">
                    <button className="btn btn-outline" onClick={handleDownloadUsers}>⬇ Users CSV</button>
                    <button className="btn btn-outline" onClick={handleDownloadCourses}>⬇ Courses CSV</button>
                    <button className="btn btn-outline" onClick={handleDownloadEnrollments}>⬇ Enrollments CSV</button>
                    <button className="btn btn-primary" onClick={handleDownloadAll}>⬇ Download All</button>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <h2>Recent Enrollments</h2>
                    <button className="btn btn-outline btn-sm" onClick={() => navigate("/admin/enrollments")}>
                        View All
                    </button>
                </div>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Student</th>
                                <th>Course</th>
                                <th>Status</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentEnrollments.length === 0 && (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: "center", padding: "2rem" }}>No enrollments yet</td>
                                </tr>
                            )}
                            {recentEnrollments.map((e) => (
                                <tr key={e.id}>
                                    <td style={{ color: "var(--text-primary)", fontWeight: 500 }}>
                                        {e.student ? e.student.name : "N/A"}
                                    </td>
                                    <td>{e.course ? e.course.title : "N/A"}</td>
                                    <td>
                                        <span className={`badge badge-${e.status.toLowerCase()}`}>{e.status}</span>
                                    </td>
                                    <td>{e.enrolledAt ? new Date(e.enrolledAt).toLocaleDateString() : "N/A"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
