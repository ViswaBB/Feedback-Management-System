import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyFeedback } from "../services/api";
import { Link } from "react-router-dom";
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
      setFeedback(data);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <h2>Loading feedback...</h2>;
  }

  return (
    <div>
      <h1>My Feedback</h1>

      <button onClick={() => navigate("/employee")}>
        Back to Dashboard
      </button>

      <br />
      <br />

      {feedback.length === 0 ? (
        <p>You haven't submitted any feedback yet.</p>
      ) : (
        feedback.map((item) => (
          <div key={item.id}>
            <hr />

            <h2>
            <Link to={`/employee/feedback/${item.id}`}>
              {item.title}
            </Link>
          </h2>

            <p>
              <strong>Category:</strong>{" "}
              {item.category}
            </p>

            <p>
              <strong>Description:</strong>{" "}
              {item.description}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {item.status}
            </p>

            <p>
              <strong>Submitted:</strong>{" "}
              {new Date(item.created_at).toLocaleDateString()}
            </p>

          </div>
        ))
      )}
    </div>
  );
}

export default MyFeedback;