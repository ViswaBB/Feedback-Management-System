import { useLocation, useNavigate } from "react-router-dom";
import "./FeedbackDetails.css";

function FeedbackDetails() {
  const navigate = useNavigate();
  const location = useLocation();

  const feedback = location.state?.feedback;

  if (!feedback) {
    return (
      <div className="feedback-details-page">
        <div className="feedback-details-card">
          <h2>Feedback not found</h2>

          <p>
            Please open the feedback from the My Feedback page.
          </p>

          <button
            className="back-button"
            onClick={() => navigate("/employee/feedback")}
          >
            ← Back to My Feedback
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="feedback-details-page">

      <button
        className="back-button"
        onClick={() => navigate("/employee/feedback")}
      >
        ← Back to My Feedback
      </button>

      <div className="feedback-details-card">

        {/* Header */}
        <div className="details-header">
          <h1>{feedback.title}</h1>

          <span
            className={`status ${
              feedback.status === "Pending"
                ? "status-pending"
                : feedback.status === "Under Review"
                ? "status-review"
                : feedback.status === "Responded"
                ? "status-responded"
                : "status-resolved"
            }`}
          >
            {feedback.status}
          </span>
        </div>

        <hr />

        {/* Category */}
        <p>
          <strong>Category:</strong>{" "}
          {feedback.category}
        </p>

        {/* Description */}
        <h3>Description</h3>

        <p className="description">
          {feedback.description}
        </p>

        {/* Date */}
        <p className="feedback-date">
          Submitted:{" "}
          {new Date(
            feedback.created_at
          ).toLocaleString()}
        </p>

        <hr />

        {/* Manager Response */}
        <h2>Manager Response</h2>

        {feedback.responses &&
        feedback.responses.length > 0 ? (
          feedback.responses.map((response) => (
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
            </div>
          ))
        ) : (
          <p className="no-response">
            No response from the manager yet.
          </p>
        )}

      </div>
    </div>
  );
}

export default FeedbackDetails;