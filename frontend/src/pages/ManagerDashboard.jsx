import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getAllFeedback,
  updateFeedbackStatus,
  respondToFeedback,
  deleteResponse,
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

  // -----------------------------
  // UPDATE STATUS
  // -----------------------------

  const handleStatusChange = async (status) => {
    try {
      await updateFeedbackStatus(
        selectedFeedback.id,
        status
      );

      setSelectedFeedback((prev) => ({
        ...prev,
        status: status,
      }));

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

  // -----------------------------
  // SEND RESPONSE
  // -----------------------------

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

      // Refresh selected feedback
      const updatedFeedback = feedback.find(
        (item) => item.id === selectedFeedback.id
      );

      if (updatedFeedback) {
        setSelectedFeedback(updatedFeedback);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  // -----------------------------
  // DELETE RESPONSE
  // -----------------------------

  const handleDeleteResponse = async (responseId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this response?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteResponse(
        selectedFeedback.id,
        responseId
      );

      alert("Response deleted successfully!");

      setSelectedFeedback((prev) => ({
        ...prev,
        responses: (prev.responses || []).filter(
          (response) =>
            response.id !== responseId
        ),
      }));

      setFeedback((prev) =>
        prev.map((item) =>
          item.id === selectedFeedback.id
            ? {
                ...item,
                responses: (
                  item.responses || []
                ).filter(
                  (response) =>
                    response.id !== responseId
                ),
              }
            : item
        )
      );
    } catch (error) {
      alert(error.message);
    }
  };

  // -----------------------------
  // LOGOUT
  // -----------------------------

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_role");

    navigate("/login");
  };

  // -----------------------------
  // SEARCH + FILTER
  // -----------------------------

  const filteredFeedback = feedback.filter(
    (item) => {
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

      return (
        matchesSearch && matchesStatus
      );
    }
  );

  if (loading) {
    return (
      <div className="manager-page">
        <h2>Loading feedback...</h2>
      </div>
    );
  }

  return (
    <div className="manager-page">

      {/* HEADER */}

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

      {/* TOOLBAR */}

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

      <p className="feedback-count">
        Showing {filteredFeedback.length} of{" "}
        {feedback.length} feedback items
      </p>

      {/* FEEDBACK LIST */}

      {filteredFeedback.length === 0 ? (

        <div className="empty-state">
          <h3>No feedback found</h3>

          <p>
            Try changing your search or filter.
          </p>
        </div>

      ) : (

        <div className="feedback-list">

          {filteredFeedback.map((item) => (

            <div
              className="manager-card"
              key={item.id}
            >

              <div className="card-header">

                <h3>
                  {item.title}
                </h3>

                <span
                  className={`status ${
                    item.status === "Pending"
                      ? "status-pending"
                      : item.status ===
                        "Under Review"
                      ? "status-review"
                      : item.status ===
                        "Responded"
                      ? "status-responded"
                      : "status-resolved"
                  }`}
                >
                  {item.status}
                </span>

              </div>

              <p>
                <strong>
                  Category:
                </strong>{" "}
                {item.category}
              </p>

              <p className="feedback-description">
                {item.description}
              </p>

              <button
                className="view-btn"
                onClick={() => {
                  setSelectedFeedback(item);
                  setResponseText("");
                }}
              >
                View Feedback
              </button>

            </div>

          ))}

        </div>
      )}

      {/* FEEDBACK DETAILS */}

      {selectedFeedback && (

        <div className="details-card">

          <div className="details-header">

            <div>
              <h2>
                Feedback Details
              </h2>

              <h3>
                {selectedFeedback.title}
              </h3>
            </div>

            <button
              className="close-btn"
              onClick={() =>
                setSelectedFeedback(null)
              }
            >
              ✕
            </button>

          </div>

          <hr />

          <p>
            <strong>
              Category:
            </strong>{" "}
            {selectedFeedback.category}
          </p>

          <p>
            <strong>
              Description:
            </strong>
          </p>

          <p className="details-description">
            {selectedFeedback.description}
          </p>

          <p>
            <strong>
              Status:
            </strong>{" "}

            <span
              className={`status ${
                selectedFeedback.status ===
                "Pending"
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

          {/* STATUS UPDATE */}

          <h3>
            Update Status
          </h3>

          <select
            className="status-select"
            value={
              selectedFeedback.status
            }
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

          {/* EXISTING RESPONSES */}

          <h3>
            Manager Responses
          </h3>

          {selectedFeedback.responses &&
          selectedFeedback.responses.length >
            0 ? (

            <div className="responses-list">

              {selectedFeedback.responses.map(
                (response) => (

                  <div
                    className="response-box"
                    key={response.id}
                  >

                    <p>
                      {response.response_text}
                    </p>

                    <small>
                      Responded on{" "}
                      {new Date(
                        response.created_at
                      ).toLocaleString()}
                    </small>

                    <button
                      className="delete-response-btn"
                      onClick={() =>
                        handleDeleteResponse(
                          response.id
                        )
                      }
                    >
                      Delete Response
                    </button>

                  </div>

                )
              )}

            </div>

          ) : (

            <p className="no-response">
              No response yet.
            </p>

          )}

          <hr />

          {/* NEW RESPONSE */}

          <h3>
            Respond to Employee
          </h3>

          <textarea
            className="response-input"
            rows="5"
            value={responseText}
            onChange={(e) =>
              setResponseText(
                e.target.value
              )
            }
            placeholder="Write your response..."
          />

          <button
            className="send-response-btn"
            onClick={handleResponse}
          >
            Send Response
          </button>

        </div>

      )}

    </div>
  );
}

export default ManagerDashboard;