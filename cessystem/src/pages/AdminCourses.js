import { useEffect, useState } from "react";
import { getCourses, createCourse, updateCourse, deleteCourse, openCourse, closeCourse, completeCourse, countStudentsInCourse } from "../services/api";

function AdminCourses() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [toast, setToast] = useState(null);
    const [saving, setSaving] = useState(false);
    const [studentCounts, setStudentCounts] = useState({});
    const [formData, setFormData] = useState({
        courseCode: "",
        title: "",
        description: "",
        totalSeats: "",
        startDate: "",
        endDate: ""
    });

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const res = await getCourses();
            setCourses(res.data);
            const counts = {};
            for (const course of res.data) {
                try {
                    const countRes = await countStudentsInCourse(course.id);
                    counts[course.id] = countRes.data;
                } catch (e) {
                    counts[course.id] = 0;
                }
            }
            setStudentCounts(counts);
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

    const openCreateModal = () => {
        setEditingCourse(null);
        setFormData({ courseCode: "", title: "", description: "", totalSeats: "", startDate: "", endDate: "" });
        setShowModal(true);
    };

    const openEditModal = (course) => {
        setEditingCourse(course);
        setFormData({
            courseCode: course.courseCode,
            title: course.title,
            description: course.description || "",
            totalSeats: String(course.totalSeats),
            startDate: course.startDate || "",
            endDate: course.endDate || ""
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const payload = {
                ...formData,
                totalSeats: Number(formData.totalSeats),
                availableSeats: Number(formData.totalSeats),
                status: "PLANNED"
            };

            if (editingCourse) {
                payload.availableSeats = editingCourse.availableSeats;
                payload.status = editingCourse.status;
                await updateCourse(editingCourse.id, payload);
                showToast("Course updated successfully", "success");
            } else {
                await createCourse(payload);
                showToast("Course created successfully", "success");
            }
            setShowModal(false);
            fetchCourses();
        } catch (err) {
            showToast("Operation failed", "error");
        } finally {
            setSaving(false);
        }
    };

    const handleStatusChange = async (id, action) => {
        const labels = { open: "open", close: "close", complete: "complete" };
        if (!window.confirm(`Are you sure you want to ${labels[action]} this course?`)) return;
        try {
            if (action === "open") await openCourse(id);
            if (action === "close") await closeCourse(id);
            if (action === "complete") await completeCourse(id);
            showToast(`Course ${labels[action]}ed successfully`, "success");
            fetchCourses();
        } catch (err) {
            showToast(`Failed to ${labels[action]} course`, "error");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this course?")) return;
        try {
            await deleteCourse(id);
            showToast("Course deleted successfully", "success");
            fetchCourses();
        } catch (err) {
            showToast("Failed to delete course", "error");
        }
    };

    const getNextAction = (status) => {
        switch (status) {
            case "PLANNED": return { label: "Open", action: "open", className: "btn-success" };
            case "OPEN": return { label: "Close", action: "close", className: "btn-warning" };
            case "CLOSED": return { label: "Complete", action: "complete", className: "btn-primary" };
            default: return null;
        }
    };

    const filteredCourses = courses.filter((c) => {
        const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.courseCode.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = !filterStatus || c.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const statusCounts = {
        PLANNED: courses.filter((c) => c.status === "PLANNED").length,
        OPEN: courses.filter((c) => c.status === "OPEN").length,
        CLOSED: courses.filter((c) => c.status === "CLOSED").length,
        COMPLETED: courses.filter((c) => c.status === "COMPLETED").length
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Course Management</h1>
                <p>Lifecycle: PLANNED → OPEN → CLOSED → COMPLETED</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">📋</div>
                    <div className="stat-value">{statusCounts.PLANNED}</div>
                    <div className="stat-label">Planned</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">🟢</div>
                    <div className="stat-value">{statusCounts.OPEN}</div>
                    <div className="stat-label">Open</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">🔒</div>
                    <div className="stat-value">{statusCounts.CLOSED}</div>
                    <div className="stat-label">Closed</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">✅</div>
                    <div className="stat-value">{statusCounts.COMPLETED}</div>
                    <div className="stat-label">Completed</div>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <h2>All Courses</h2>
                    <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ width: "180px" }}
                        />
                        <select
                            className="form-control"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            style={{ width: "150px" }}
                        >
                            <option value="">All Status</option>
                            <option value="PLANNED">Planned</option>
                            <option value="OPEN">Open</option>
                            <option value="CLOSED">Closed</option>
                            <option value="COMPLETED">Completed</option>
                        </select>
                        <button className="btn btn-primary" onClick={openCreateModal}>+ Add Course</button>
                    </div>
                </div>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Code</th>
                                <th>Title</th>
                                <th>Seats</th>
                                <th>Enrolled</th>
                                <th>Dates</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading && (
                                <tr><td colSpan="7" style={{ textAlign: "center", padding: "2rem" }}>Loading...</td></tr>
                            )}
                            {!loading && filteredCourses.length === 0 && (
                                <tr><td colSpan="7" style={{ textAlign: "center", padding: "2rem" }}>No courses found</td></tr>
                            )}
                            {filteredCourses.map((course) => {
                                const nextAction = getNextAction(course.status);
                                return (
                                    <tr key={course.id}>
                                        <td style={{ color: "var(--accent-secondary)", fontWeight: 600, fontSize: "0.82rem" }}>
                                            {course.courseCode}
                                        </td>
                                        <td style={{ color: "var(--text-primary)", fontWeight: 500 }}>{course.title}</td>
                                        <td>{course.availableSeats}/{course.totalSeats}</td>
                                        <td>{studentCounts[course.id] !== undefined ? studentCounts[course.id] : "..."}</td>
                                        <td style={{ fontSize: "0.82rem" }}>
                                            {course.startDate || "TBD"} — {course.endDate || "TBD"}
                                        </td>
                                        <td>
                                            <span className={`badge badge-${course.status.toLowerCase()}`}>{course.status}</span>
                                        </td>
                                        <td>
                                            <div className="btn-group">
                                                {nextAction && (
                                                    <button
                                                        className={`btn ${nextAction.className} btn-sm`}
                                                        onClick={() => handleStatusChange(course.id, nextAction.action)}
                                                    >
                                                        {nextAction.label}
                                                    </button>
                                                )}
                                                <button className="btn btn-outline btn-sm" onClick={() => openEditModal(course)}>Edit</button>
                                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(course.id)}>Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{editingCourse ? "Edit Course" : "Create Course"}</h3>
                            <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Course Code</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="e.g. CS101"
                                            value={formData.courseCode}
                                            onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Total Seats</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="e.g. 30"
                                            value={formData.totalSeats}
                                            onChange={(e) => setFormData({ ...formData, totalSeats: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Title</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Course title"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea
                                        className="form-control"
                                        placeholder="Course description"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows="3"
                                    />
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Start Date</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={formData.startDate}
                                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>End Date</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={formData.endDate}
                                            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={saving}>
                                    {saving ? "Saving..." : editingCourse ? "Update" : "Create"}
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

export default AdminCourses;
