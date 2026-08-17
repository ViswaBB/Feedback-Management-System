import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../services/api";
import "./SubmitFeedback.css";

function SubmitFeedback() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      await apiFetch("/feedback/", {
        method: "POST",
        body: JSON.stringify({
          title,
          description,
          category,
        }),
      });

      alert("Feedback submitted successfully!");

      navigate("/employee/feedback");

    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="feedback-page">

      <div className="feedback-form-card">

        <h1>Submit Feedback</h1>

        <p>
          Share your feedback, suggestions, or concerns.
        </p>

        <form
          className="feedback-form"
          onSubmit={handleSubmit}
        >

          <label>Title</label>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Improve team communication"
            required
          />

          <label>Description</label>

          <textarea
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            placeholder="Describe your feedback..."
            rows="6"
            required
          />

          <label>Category</label>

          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
            required
          >
            <option value="">
              Select a category
            </option>

            <option value="team">
              Team
            </option>

            <option value="management">
              Management
            </option>

            <option value="workload">
              Workload
            </option>

            <option value="work_environment">
              Work Environment
            </option>

            <option value="other">
              Other
            </option>
          </select>

          <div className="form-buttons">

            <button
              type="button"
              className="back-btn"
              onClick={() => navigate("/employee")}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
              {loading
                ? "Submitting..."
                : "Submit Feedback"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default SubmitFeedback;