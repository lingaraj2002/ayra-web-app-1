import { useState } from "react";
import "./Login.scss";
import { handleAdminLoginApi } from "../../services/api";
const Login = ({ onSuccess }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      const res = await handleAdminLoginApi(password);

      console.log(res, "response");
      if (res.data.status === "error") {
        return setError(res.data.message);
      }
      localStorage.setItem("adminPassword", password);
      onSuccess();
    } catch {
      setError("Server error");
    }
  };

  return (
    <div className="login-main">
      <input
        type="password"
        placeholder="Enter admin password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          setError("");
        }}
      />

      {error && <p className="error">{error}</p>}

      <button onClick={handleSubmit}>Login</button>
    </div>
  );
};

export default Login;
