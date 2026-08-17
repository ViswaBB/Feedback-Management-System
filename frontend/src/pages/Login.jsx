import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, getMe } from "../services/api";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const data = await login(email, password);

      localStorage.setItem(
        "access_token",
        data.access_token
      );

      const user = await getMe();

      localStorage.setItem(
        "user_role",
        user.role
      );

      if (user.role === "manager") {
        navigate("/manager");
      } else {
        navigate("/employee");
      }

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="login-card">

        <h1>FeedbackHub</h1>

        <p className="login-subtitle">
          Employee Feedback Management System
        </p>

        <form onSubmit={handleLogin}>

          <label>Email</label>

          <input
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            placeholder="Enter your email"
            required
          />

          <label>Password</label>

          <input
            type="password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            placeholder="Enter your password"
            required
          />

          {error && (
            <p className="error">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default Login;