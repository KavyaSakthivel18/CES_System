import { Navigate } from "react-router-dom";
// AdminRoute component that checks if the user has an admin role and either renders the child component or redirects to the home page
function AdminRoute({ children }) {
  const role = localStorage.getItem("role");

  if (role !== "ADMIN") {
    return <Navigate to="/" />;
  }

  return children;
}

export default AdminRoute;