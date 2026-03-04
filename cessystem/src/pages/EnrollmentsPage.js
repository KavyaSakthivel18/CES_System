import { useEffect, useState } from "react";
import { getStudentEnrollments, cancelEnrollment } from "../services/api";

function EnrollmentsPage() {

  const [enrollments, setEnrollments] = useState([]);

  const studentId = 1; // temporary

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {

    try {

      const response = await getStudentEnrollments(studentId);

      setEnrollments(response.data);

    } catch (error) {

      console.error(error);
      alert("Error fetching enrollments");

    }

  };

  const handleCancel = async (id) => {

    try {

      await cancelEnrollment(id);

      alert("Enrollment cancelled");

      fetchEnrollments();

    } catch (error) {

      console.error(error);
      alert("Error cancelling enrollment");

    }

  };

  return (

    <div className="container mt-5">

      <h2 className="text-center mb-4">My Enrollments</h2>

      <div className="row">

        {enrollments.length === 0 && (
          <p className="text-center">No enrollments found</p>
        )}

        {enrollments.map((enroll) => (

          <div className="col-md-4 mb-4" key={enroll.id}>

            <div className="card shadow-sm h-100">

              <div className="card-body">

                <h5 className="card-title">
                  {enroll.course.title}
                </h5>

                <p className="card-text">
                  Status: 
                  <span className="badge bg-success ms-2">
                    {enroll.status}
                  </span>
                </p>

                {enroll.status === "ENROLLED" && (

                  <button
                    className="btn btn-danger"
                    onClick={() => handleCancel(enroll.id)}
                  >
                    Cancel Enrollment
                  </button>

                )}

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>

  );
}

export default EnrollmentsPage;