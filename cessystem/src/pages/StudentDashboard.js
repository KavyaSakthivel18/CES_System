import { useEffect, useState } from "react";
import { getStudentEnrollments, cancelEnrollment } from "../services/api";
// Students enrollment page
function StudentDashboard() {
    const userId = localStorage.getItem("userId");
    const userName = localStorage.getItem("userName");
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cancellingId, setCancellingId] = useState(null);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        fetchEnrollments();
    }, []);

    const fetchEnrollments = async () => {
        try {
            const response = await getStudentEnrollments(userId);
            setEnrollments(response.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id) => {
        if (!window.confirm("Are you sure you want to cancel this enrollment?")) return;
        setCancellingId(id);
        try {
            await cancelEnrollment(id);
            showToast("Enrollment cancelled successfully", "success");
            fetchEnrollments();
        } catch (err) {
            showToast("Failed to cancel enrollment", "error");
        } finally {
            setCancellingId(null);
        }
    };

    const showToast = (message, type) => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const activeCount = enrollments.filter((e) => e.status === "ENROLLED").length;
    const cancelledCount = enrollments.filter((e) => e.status === "CANCELLED").length;

    const canCancel = (enrollment) => {
        return enrollment.status === "ENROLLED" && enrollment.course && enrollment.course.status !== "CLOSED" && enrollment.course.status !== "COMPLETED";
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>My Enrollments</h1>
                <p>Welcome back, {userName}. Here are your enrolled courses.</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">📚</div>
                    <div className="stat-value">{enrollments.length}</div>
                    <div className="stat-label">Total Enrollments</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">✅</div>
                    <div className="stat-value">{activeCount}</div>
                    <div className="stat-label">Active</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">❌</div>
                    <div className="stat-value">{cancelledCount}</div>
                    <div className="stat-label">Cancelled</div>
                </div>
            </div>

            {loading && (
                <div className="empty-state">
                    <p>Loading your enrollments...</p>
                </div>
            )}

            {!loading && enrollments.length === 0 && (
                <div className="empty-state">
                    <div className="empty-icon">📝</div>
                    <h3>No Enrollments Yet</h3>
                    <p>You haven't enrolled in any courses. Browse the catalog to get started!</p>
                </div>
            )}

            {!loading && enrollments.length > 0 && (
                <div className="card">
                    <div className="card-header">
                        <h2>Enrollment History</h2>
                    </div>
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Course</th>
                                    <th>Code</th>
                                    <th>Course Status</th>
                                    <th>Enrollment Status</th>
                                    <th>Enrolled At</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {enrollments.map((enroll) => (
                                    <tr key={enroll.id}>
                                        <td style={{ color: "var(--text-primary)", fontWeight: 500 }}>
                                            {enroll.course ? enroll.course.title : "N/A"}
                                        </td>
                                        <td>{enroll.course ? enroll.course.courseCode : "N/A"}</td>
                                        <td>
                                            {enroll.course && (
                                                <span className={`badge badge-${enroll.course.status.toLowerCase()}`}>
                                                    {enroll.course.status}
                                                </span>
                                            )}
                                        </td>
                                        <td>
                                            <span className={`badge badge-${enroll.status.toLowerCase()}`}>
                                                {enroll.status}
                                            </span>
                                        </td>
                                        <td>
                                            {enroll.enrolledAt
                                                ? new Date(enroll.enrolledAt).toLocaleDateString()
                                                : "N/A"}
                                        </td>
                                        <td>
                                            {canCancel(enroll) ? (
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => handleCancel(enroll.id)}
                                                    disabled={cancellingId === enroll.id}
                                                >
                                                    {cancellingId === enroll.id ? "Cancelling..." : "Cancel"}
                                                </button>
                                            ) : enroll.status === "ENROLLED" ? (
                                                <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                                                    Course closed
                                                </span>
                                            ) : null}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {toast && (
                <div className={`toast toast-${toast.type}`}>
                    {toast.type === "success" ? "✅" : "❌"} {toast.message}
                </div>
            )}
        </div>
    );
}

export default StudentDashboard;
