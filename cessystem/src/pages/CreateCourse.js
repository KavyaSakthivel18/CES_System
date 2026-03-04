import { useState } from "react";
import { createCourse } from "../services/api";

function CreateCourse() {

  const [course, setCourse] = useState({
    courseCode: "",
    title: "",
    description: "",
    totalSeats: "",
    startDate: "",
    endDate: ""
  });

  const handleChange = (e) => {

    setCourse({
      ...course,
      [e.target.name]: e.target.value
    });

  };

const handleSubmit = async (e) => {

  e.preventDefault();

  try {

    const payload = {
      ...course,
      totalSeats: Number(course.totalSeats),
      availableSeats: Number(course.totalSeats), // backend expects this
      status: "PLANNED" // default course status
    };

    await createCourse(payload);

    alert("Course created successfully");

    setCourse({
      courseCode: "",
      title: "",
      description: "",
      totalSeats: "",
      startDate: "",
      endDate: ""
    });

  } catch (error) {

    console.error(error);
    alert("Error creating course");

  }

};

  return (

    <div className="container mt-5">

      <div className="row justify-content-center">

        <div className="col-md-6">

          <div className="card shadow p-4">

            <h3 className="text-center mb-4">Create Course</h3>

            <form onSubmit={handleSubmit}>

              <div className="mb-3">
                <label className="form-label">Course Code</label>
                <input
                  type="text"
                  name="courseCode"
                  className="form-control"
                  placeholder="Enter course code"
                  value={course.courseCode}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  name="title"
                  className="form-control"
                  placeholder="Enter course title"
                  value={course.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  className="form-control"
                  rows="3"
                  placeholder="Enter course description"
                  value={course.description}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Total Seats</label>
                <input
                  type="number"
                  name="totalSeats"
                  className="form-control"
                  placeholder="Enter total seats"
                  value={course.totalSeats}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  className="form-control"
                  value={course.startDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  className="form-control"
                  value={course.endDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <button className="btn btn-success w-100">
                Create Course
              </button>

            </form>

          </div>

        </div>

      </div>

    </div>

  );
}

export default CreateCourse;