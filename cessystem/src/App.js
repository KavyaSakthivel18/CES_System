import { BrowserRouter, Routes, Route } from "react-router-dom";

import Signup from "./pages/Signup";
import EnrollmentsPage from "./pages/EnrollmentsPage";
import CreateCourse from "./pages/CreateCourse";

import AdminRoute from "./components/AdminRoute";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route path="/signup" element={<Signup />} />

        <Route path="/enrollments" element={<EnrollmentsPage />} />

        {/* ADMIN ONLY ROUTE */}
        <Route
          path="/create-course"
          element={
            <AdminRoute>
              <CreateCourse />
            </AdminRoute>
          }
        />

      </Routes>

    </BrowserRouter>

  );
}

export default App;