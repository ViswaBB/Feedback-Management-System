import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getFeedback } from "../services/api";

function FeedbackDetails() {
  const { feedbackId } = useParams();
  const navigate = useNavigate();

  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeedback();
  }, [feedbackId]);

  const loadFeedback = async () => {
    try {
      const data = await getFeedback(feedbackId);
      console.log("FEEDBACK DATA:", data);

      setFeedback(data);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (!feedback) {
    return <h2>Feedback not found</h2>;
  }

  return (
    <div>
      <button onClick={() => navigate("/employee/feedback")}>
        ← Back
      </button>

      <h1>{feedback.title}</h1>

      <p>
        <strong>Category:</strong> {feedback.category}
      </p>

      <p>
        <strong>Description:</strong>
      </p>

      <p>{feedback.description}</p>

      <p>
        <strong>Status:</strong> {feedback.status}
      </p>

      <hr />

      <h2>Manager Response</h2>

      {feedback.responses && feedback.responses.length > 0 ? (
        feedback.responses.map((response) => (
          <div key={response.id}>
            <p>{response.response_text}</p>

            <small>
              Responded on{" "}
              {new Date(
                response.created_at
              ).toLocaleDateString()}
            </small>
          </div>
        ))
      ) : (
        <p>No response from manager yet.</p>
      )}
    </div>
  );
}

export default FeedbackDetails;