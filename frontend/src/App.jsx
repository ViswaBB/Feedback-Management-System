import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import SubmitFeedback from "./pages/SubmitFeedback";
import MyFeedback from "./pages/MyFeedback";
import FeedbackDetails from "./pages/FeedbackDetails";
import ManagerDashboard from "./pages/ManagerDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* Employee */}
        <Route
          path="/employee"
          element={
            <ProtectedRoute allowedRole="employee">
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employee/submit"
          element={
            <ProtectedRoute allowedRole="employee">
              <SubmitFeedback />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employee/feedback"
          element={
            <ProtectedRoute allowedRole="employee">
              <MyFeedback />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employee/feedback/:feedbackId"
          element={
            <ProtectedRoute allowedRole="employee">
              <FeedbackDetails />
            </ProtectedRoute>
          }
        />

        {/* Manager */}
        <Route
          path="/manager"
          element={
            <ProtectedRoute allowedRole="manager">
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Anything unknown */}
        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;