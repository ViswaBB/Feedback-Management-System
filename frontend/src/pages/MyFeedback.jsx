import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyFeedback } from "../services/api";
import "./MyFeedback.css";

function MyFeedback() {
  const navigate = useNavigate();

  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeedback();
  }, []);

  const loadFeedback = async () => {
    try {
      const data = await getMyFeedback();

      console.log("MY FEEDBACK:", data);

      setFeedback(data);
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="my-feedback-page">
        <h2>Loading your feedback...</h2>
      </div>
    );
  }

  return (
    <div className="my-feedback-page">

      <div className="my-feedback-header">

        <div>
          <h1>My Feedback</h1>
          <p>
            Track the feedback you have submitted.
          </p>
        </div>

        <button
          onClick={() => navigate("/employee")}
        >
          Back to Dashboard
        </button>

      </div>

      {feedback.length === 0 ? (
        <div className="empty-feedback">

          <h2>No feedback yet</h2>

          <p>
            You haven't submitted any feedback.
          </p>

          <button
            onClick={() =>
              navigate("/employee/submit")
            }
          >
            Submit Feedback
          </button>

        </div>
      ) : (
        feedback.map((item) => (

          <div
            className="feedback-item"
            key={item.id}
          >

            <div className="feedback-item-header">

              <h2>{item.title}</h2>

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

            </div>

            <p>
              <strong>Category:</strong>{" "}
              {item.category}
            </p>

            <p>
              {item.description}
            </p>

            <p className="feedback-date">
              Submitted:{" "}
              {new Date(
                item.created_at
              ).toLocaleString()}
            </p>

            <button
              onClick={() => {
                console.log(
                  "Opening feedback:",
                  item.id
                );

          navigate(
            `/employee/feedback/${item.id}`,
            {
              state: {
                feedback: item,
              },
            }
          );
              }}
            >
              View Details
            </button>

          </div>

        ))
      )}

    </div>
  );
}

export default MyFeedback;