import { useState } from "react";
import { createUser } from "../services/api";

function Signup() {

  const [formData, setFormData] = useState({
    name: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      name: formData.name,
      password: formData.password,
      role: "STUDENT"
    };

    try {

      await createUser(userData);

      alert("Signup successful");

      setFormData({ name: "", password: "" });

    } catch (error) {

      alert("Signup failed");

    }
  };

  return (

    <div className="container d-flex justify-content-center align-items-center vh-100">

      <div className="card p-4 shadow" style={{width:"350px"}}>

        <h3 className="text-center mb-3">Student Signup</h3>

        <form onSubmit={handleSubmit}>

          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button className="btn btn-primary w-100">
            Signup
          </button>

        </form>

      </div>

    </div>

  );
}

export default Signup;