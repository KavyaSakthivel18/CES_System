import { useEffect, useState } from "react";
import { getAllEnrollments, cancelEnrollment, enrollCourse, getUsers, getCoursesByStatus, countStudentsInCourse } from "../services/api";

function AdminEnrollments() {
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [toast, setToast] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [students, setStudents] = useState([]);
    const [openCourses, setOpenCourses] = useState([]);
    const [newEnroll, setNewEnroll] = useState({ studentId: "", courseId: "" });
    const [saving, setSaving] = useState(false);
    const [courseCounts, setCourseCounts] = useState({});

    useEffect(() => {
        fetchEnrollments();
    }, []);

    const fetchEnrollments = async () => {
        try {
            const res = await getAllEnrollments();
            setEnrollments(res.data);

            const courseIds = [...new Set(res.data.filter((e) => e.course).map((e) => e.course.id))];
            const counts = {};
            for (const cid of courseIds) {
                try {
                    const countRes = await countStudentsInCourse(cid);
                    counts[cid] = countRes.data;
                } catch (e) {
                    counts[cid] = 0;
                }
            }
            setCourseCounts(counts);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const showToast = (message, type) => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleCancel = async (id) => {
        if (!window.confirm("Cancel this enrollment?")) return;
        try {
            await cancelEnrollment(id);
            showToast("Enrollment cancelled", "success");
            fetchEnrollments();
        } catch (err) {
            showToast("Failed to cancel enrollment", "error");
        }
    };

    const openEnrollModal = async () => {
        try {
            const [usersRes, coursesRes] = await Promise.all([
                getUsers(),
                getCoursesByStatus("OPEN")
            ]);
            setStudents(usersRes.data.filter((u) => u.role === "STUDENT"));
            setOpenCourses(coursesRes.data);
            setNewEnroll({ studentId: "", courseId: "" });
            setShowModal(true);
        } catch (err) {
            showToast("Failed to load data", "error");
        }
    };

    const handleEnrollSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await enrollCourse(newEnroll.studentId, newEnroll.courseId);
            showToast("Student enrolled successfully", "success");
            setShowModal(false);
            fetchEnrollments();
        } catch (err) {
            showToast("Enrollment failed. Student may already be enrolled.", "error");
        } finally {
            setSaving(false);
        }
    };

    const filteredEnrollments = enrollments.filter((e) => {
        const studentName = e.student ? e.student.name.toLowerCase() : "";
        const courseTitle = e.course ? e.course.title.toLowerCase() : "";
        const courseCode = e.course ? e.course.courseCode.toLowerCase() : "";
        const matchesSearch = studentName.includes(search.toLowerCase()) ||
            courseTitle.includes(search.toLowerCase()) ||
            courseCode.includes(search.toLowerCase());
        const matchesStatus = !filterStatus || e.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const activeCount = enrollments.filter((e) => e.status === "ENROLLED").length;
    const cancelledCount = enrollments.filter((e) => e.status === "CANCELLED").length;

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Enrollment Management</h1>
                <p>View and manage all student enrollments</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">📊</div>
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

            <div className="card">
                <div className="card-header">
                    <h2>All Enrollments</h2>
                    <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search student or course..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ width: "220px" }}
                        />
                        <select
                            className="form-control"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            style={{ width: "150px" }}
                        >
                            <option value="">All Status</option>
                            <option value="ENROLLED">Enrolled</option>
                            <option value="CANCELLED">Cancelled</option>
                        </select>
                        <button className="btn btn-primary" onClick={openEnrollModal}>+ Enroll Student</button>
                    </div>
                </div>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Student</th>
                                <th>Course</th>
                                <th>Course Status</th>
                                <th>Students in Course</th>
                                <th>Status</th>
                                <th>Enrolled At</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading && (
                                <tr><td colSpan="8" style={{ textAlign: "center", padding: "2rem" }}>Loading...</td></tr>
                            )}
                            {!loading && filteredEnrollments.length === 0 && (
                                <tr><td colSpan="8" style={{ textAlign: "center", padding: "2rem" }}>No enrollments found</td></tr>
                            )}
                            {filteredEnrollments.map((enroll) => (
                                <tr key={enroll.id}>
                                    <td>{enroll.id}</td>
                                    <td style={{ color: "var(--text-primary)", fontWeight: 500 }}>
                                        {enroll.student ? enroll.student.name : "N/A"}
                                    </td>
                                    <td>
                                        {enroll.course ? (
                                            <div>
                                                <div style={{ fontWeight: 500, color: "var(--text-primary)" }}>{enroll.course.title}</div>
                                                <div style={{ fontSize: "0.75rem", color: "var(--accent-secondary)" }}>{enroll.course.courseCode}</div>
                                            </div>
                                        ) : "N/A"}
                                    </td>
                                    <td>
                                        {enroll.course && (
                                            <span className={`badge badge-${enroll.course.status.toLowerCase()}`}>
                                                {enroll.course.status}
                                            </span>
                                        )}
                                    </td>
                                    <td>
                                        {enroll.course && courseCounts[enroll.course.id] !== undefined
                                            ? courseCounts[enroll.course.id]
                                            : "..."}
                                    </td>
                                    <td>
                                        <span className={`badge badge-${enroll.status.toLowerCase()}`}>{enroll.status}</span>
                                    </td>
                                    <td>
                                        {enroll.enrolledAt ? new Date(enroll.enrolledAt).toLocaleDateString() : "N/A"}
                                    </td>
                                    <td>
                                        {enroll.status === "ENROLLED" && (
                                            <button className="btn btn-danger btn-sm" onClick={() => handleCancel(enroll.id)}>
                                                Cancel
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Enroll Student</h3>
                            <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
                        </div>
                        <form onSubmit={handleEnrollSubmit}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label>Student</label>
                                    <select
                                        className="form-control"
                                        value={newEnroll.studentId}
                                        onChange={(e) => setNewEnroll({ ...newEnroll, studentId: e.target.value })}
                                        required
                                    >
                                        <option value="">Select a student</option>
                                        {students.map((s) => (
                                            <option key={s.id} value={s.id}>{s.name} (ID: {s.id})</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Course (Open Only)</label>
                                    <select
                                        className="form-control"
                                        value={newEnroll.courseId}
                                        onChange={(e) => setNewEnroll({ ...newEnroll, courseId: e.target.value })}
                                        required
                                    >
                                        <option value="">Select a course</option>
                                        {openCourses.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.title} ({c.courseCode}) — {c.availableSeats} seats left
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={saving}>
                                    {saving ? "Enrolling..." : "Enroll"}
                                </button>
                            </div>
                        </form>
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

export default AdminEnrollments;
