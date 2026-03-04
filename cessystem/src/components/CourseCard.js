import { useState } from "react";
import { enrollCourse } from "../services/api";

function CourseCard({ course }) {

  const studentId = 1; // temporary
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEnroll = async () => {

    try {

      setLoading(true);

      await enrollCourse({
        studentId: studentId,
        courseId: course.id
      });

      setIsEnrolled(true);

    } catch (error) {

      console.error(error);
      alert("Enrollment failed");

    } finally {
      setLoading(false);
    }
  };

  return (

    <div
      style={{
        border: "1px solid gray",
        padding: "10px",
        margin: "10px"
      }}
    >

      <h3>{course.title}</h3>

      <p>{course.description}</p>

      <p>Total Seats: {course.totalSeats}</p>

      <p>Available Seats: {course.availableSeats}</p>

      <p>Status: {course.status}</p>

      {course.status === "OPEN" && !isEnrolled && (
        <button onClick={handleEnroll} disabled={loading}>
          {loading ? "Enrolling..." : "Enroll"}
        </button>
      )}

      {isEnrolled && (
        <button disabled style={{backgroundColor:"#4CAF50",color:"white"}}>
          Enrolled
        </button>
      )}

    </div>
  );
}

export default CourseCard;