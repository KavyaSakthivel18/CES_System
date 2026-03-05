import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createUser } from "../services/api";

function SignupPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const userData = {
                name: formData.name,
                password: formData.password,
                role: "STUDENT"
            };

            const response = await createUser(userData);
            localStorage.setItem("userId", response.data.id);
            localStorage.setItem("userName", response.data.name);
            localStorage.setItem("role", response.data.role);
            navigate("/");
        } catch (err) {
            setError("Signup failed. Username may already exist.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Create Account</h2>
                <p className="auth-subtitle">Join as a student to enroll in courses</p>

                {error && (
                    <div style={{ background: "var(--danger-bg)", color: "var(--danger)", padding: "0.75rem", borderRadius: "var(--radius-sm)", marginBottom: "1rem", fontSize: "0.88rem", border: "1px solid rgba(239,68,68,0.2)" }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            name="name"
                            className="form-control"
                            placeholder="Choose a username"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            className="form-control"
                            placeholder="Create a password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: "100%", padding: "0.75rem" }} disabled={loading}>
                        {loading ? "Creating account..." : "Sign Up"}
                    </button>
                </form>

                <div className="auth-footer">
                    Already have an account? <Link to="/login">Sign in</Link>
                </div>
            </div>
        </div>
    );
}

export default SignupPage;
