import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllFeedback,
  getFeedback,
  updateFeedbackStatus,
  respondToFeedback,
} from "../services/api";
import "./ManagerDashboard.css";

function ManagerDashboard() {
  const navigate = useNavigate();

  const [feedback, setFeedback] = useState([]);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [responseText, setResponseText] = useState("");
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    loadFeedback();
  }, []);

  const loadFeedback = async () => {
    try {
      const data = await getAllFeedback();
      setFeedback(data);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (status) => {
    try {
      await updateFeedbackStatus(
        selectedFeedback.id,
        status
      );

      setSelectedFeedback({
        ...selectedFeedback,
        status: status,
      });

      setFeedback((prev) =>
        prev.map((item) =>
          item.id === selectedFeedback.id
            ? { ...item, status: status }
            : item
        )
      );

      alert("Status updated!");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleResponse = async () => {
    if (!responseText.trim()) {
      alert("Please enter a response.");
      return;
    }

    try {
      await respondToFeedback(
        selectedFeedback.id,
        responseText
      );

      alert("Response submitted!");

      setResponseText("");

      await loadFeedback();
    } catch (error) {
      alert(error.message);
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_role");

    navigate("/login");
  };

  const filteredFeedback = feedback.filter((item) => {
    const matchesSearch =
      item.title
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      item.description
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <h2>Loading feedback...</h2>;
  }

  return (
    <div className="manager-page">

      {/* Header */}
      <div className="manager-header">

        <div>
          <h1>Manager Dashboard</h1>
          <p>
            Review and manage employee feedback.
          </p>
        </div>

        <button
          className="logout-btn"
          onClick={logout}
        >
          Logout
        </button>

      </div>

      <hr />

      {/* Search and Filter */}
      <div className="manager-toolbar">

        <input
          type="text"
          placeholder="Search feedback..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
        >
          <option value="All">
            All Statuses
          </option>

          <option value="Pending">
            Pending
          </option>

          <option value="Under Review">
            Under Review
          </option>

          <option value="Responded">
            Responded
          </option>

          <option value="Resolved">
            Resolved
          </option>
        </select>

      </div>

      <p>
        Showing {filteredFeedback.length} of{" "}
        {feedback.length} feedback items
      </p>

      {/* Feedback List */}
      {filteredFeedback.length === 0 ? (
        <p>No feedback found.</p>
      ) : (
        filteredFeedback.map((item) => (
          <div
            className="manager-card"
            key={item.id}
          >

            <h3>{item.title}</h3>

            <p>
              <strong>Category:</strong>{" "}
              {item.category}
            </p>

            <p>
              <strong>Status:</strong>{" "}

              <span
                className={`status ${
                  item.status === "Pending"
                    ? "status-pending"
                    : item.status === "Under Review"
                    ? "status-review"
                    : item.status === "Responded"
                    ? "status-responded"
                    : "status-resolved"
                }`}
              >
                {item.status}
              </span>

            </p>

      <button
        onClick={() => {
          setSelectedFeedback(item);
          setResponseText("");
        }}
      >
        View Feedback
      </button>

          </div>
        ))
      )}

      {/* Feedback Details */}
      {selectedFeedback && (
        <div className="manager-card">

          <h2>Feedback Details</h2>

          <h3>
            {selectedFeedback.title}
          </h3>

          <p>
            <strong>Category:</strong>{" "}
            {selectedFeedback.category}
          </p>

          <p>
            <strong>Description:</strong>
          </p>

          <p>
            {selectedFeedback.description}
          </p>

          <p>
            <strong>Status:</strong>{" "}

            <span
              className={`status ${
                selectedFeedback.status === "Pending"
                  ? "status-pending"
                  : selectedFeedback.status ===
                    "Under Review"
                  ? "status-review"
                  : selectedFeedback.status ===
                    "Responded"
                  ? "status-responded"
                  : "status-resolved"
              }`}
            >
              {selectedFeedback.status}
            </span>
          </p>

          <hr />

          {/* Status Update */}
          <h3>Update Status</h3>

          <select
            value={selectedFeedback.status}
            onChange={(e) =>
              handleStatusChange(
                e.target.value
              )
            }
          >
            <option value="Pending">
              Pending
            </option>

            <option value="Under Review">
              Under Review
            </option>

            <option value="Responded">
              Responded
            </option>

            <option value="Resolved">
              Resolved
            </option>
          </select>

          <hr />

          {/* Manager Response */}
          <h3>Respond to Employee</h3>

          <textarea
            rows="5"
            value={responseText}
            onChange={(e) =>
              setResponseText(
                e.target.value
              )
            }
            placeholder="Write your response..."
          />

          <br />
          <br />

          <button onClick={handleResponse}>
            Send Response
          </button>

          <br />
          <br />

          <button
            onClick={() =>
              setSelectedFeedback(null)
            }
          >
            Close
          </button>

        </div>
      )}

    </div>
  );
}

export default ManagerDashboard; 