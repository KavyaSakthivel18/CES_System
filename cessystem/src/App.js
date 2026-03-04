import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Signup from './pages/Signup';
import EnrollmentsPage from './pages/EnrollmentsPage';
import CreateCourse from './pages/CreateCourse';

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/signup" element={<Signup />} />

        <Route path="/enrollments" element={<EnrollmentsPage />} />

        <Route path="/create-course" element={<CreateCourse />} />

      </Routes>

    </BrowserRouter>
  );
}

export default App;
