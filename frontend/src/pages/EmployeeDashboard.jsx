import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function EmployeeDashboard() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_role");

    navigate("/login");
  };

  return (
    <div className="dashboard">

      <div className="dashboard-header">

        <div>
          <h1>Employee Dashboard</h1>
          <p>Manage your feedback and suggestions.</p>
        </div>

        <button
          className="logout-btn"
          onClick={logout}
        >
          Logout
        </button>

      </div>

      <div className="dashboard-actions">

        <button
          className="primary-btn"
          onClick={() => navigate("/employee/submit")}
        >
          + Submit Feedback
        </button>

        <button
          className="secondary-btn"
          onClick={() => navigate("/employee/feedback")}
        >
          My Feedback
        </button>

      </div>

      <div className="feedback-card">

        <h3>Welcome 👋</h3>

        <p>
          Use this dashboard to submit feedback,
          track its status, and view manager responses.
        </p>

      </div>

    </div>
  );
}

export default EmployeeDashboard;