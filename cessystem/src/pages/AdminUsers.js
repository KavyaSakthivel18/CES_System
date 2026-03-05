import { useEffect, useState } from "react";
import { getUsers, createUser, updateUser, deleteUser } from "../services/api";

function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({ name: "", password: "", role: "STUDENT" });
    const [search, setSearch] = useState("");
    const [toast, setToast] = useState(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await getUsers();
            setUsers(res.data);
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
        setEditingUser(null);
        setFormData({ name: "", password: "", role: "STUDENT" });
        setShowModal(true);
    };

    const openEditModal = (user) => {
        setEditingUser(user);
        setFormData({ name: user.name, password: "", role: user.role });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editingUser) {
                const payload = { name: formData.name, role: formData.role };
                if (formData.password) payload.password = formData.password;
                await updateUser(editingUser.id, payload);
                showToast("User updated successfully", "success");
            } else {
                await createUser(formData);
                showToast("User created successfully", "success");
            }
            setShowModal(false);
            fetchUsers();
        } catch (err) {
            showToast("Operation failed. Check input.", "error");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            await deleteUser(id);
            showToast("User deleted successfully", "success");
            fetchUsers();
        } catch (err) {
            showToast("Failed to delete user", "error");
        }
    };

    const filteredUsers = users.filter(
        (u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.role.toLowerCase().includes(search.toLowerCase())
    );

    const adminCount = users.filter((u) => u.role === "ADMIN").length;
    const studentCount = users.filter((u) => u.role === "STUDENT").length;

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>User Management</h1>
                <p>Manage all system users</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">👥</div>
                    <div className="stat-value">{users.length}</div>
                    <div className="stat-label">Total Users</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">🛡️</div>
                    <div className="stat-value">{adminCount}</div>
                    <div className="stat-label">Admins</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">🎓</div>
                    <div className="stat-value">{studentCount}</div>
                    <div className="stat-label">Students</div>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <h2>All Users</h2>
                    <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search users..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ width: "200px" }}
                        />
                        <button className="btn btn-primary" onClick={openCreateModal}>+ Add User</button>
                    </div>
                </div>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Role</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading && (
                                <tr><td colSpan="4" style={{ textAlign: "center", padding: "2rem" }}>Loading...</td></tr>
                            )}
                            {!loading && filteredUsers.length === 0 && (
                                <tr><td colSpan="4" style={{ textAlign: "center", padding: "2rem" }}>No users found</td></tr>
                            )}
                            {filteredUsers.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td style={{ color: "var(--text-primary)", fontWeight: 500 }}>{user.name}</td>
                                    <td>
                                        <span className={`badge badge-${user.role.toLowerCase()}`}>{user.role}</span>
                                    </td>
                                    <td>
                                        <div className="btn-group">
                                            <button className="btn btn-outline btn-sm" onClick={() => openEditModal(user)}>Edit</button>
                                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(user.id)}>Delete</button>
                                        </div>
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
                            <h3>{editingUser ? "Edit User" : "Create User"}</h3>
                            <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label>Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>{editingUser ? "New Password (leave blank to keep)" : "Password"}</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        placeholder={editingUser ? "Leave blank to keep current" : "Enter password"}
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required={!editingUser}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Role</label>
                                    <select
                                        className="form-control"
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    >
                                        <option value="STUDENT">STUDENT</option>
                                        <option value="ADMIN">ADMIN</option>
                                    </select>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={saving}>
                                    {saving ? "Saving..." : editingUser ? "Update" : "Create"}
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

export default AdminUsers;
