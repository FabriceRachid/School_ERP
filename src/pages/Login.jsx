import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (role) => {
    login({ name: "User", role });
    navigate(role === "admin" ? "/admin/dashboard" : "/teacher/dashboard");
  };

  return (
    <div style={{ padding: 50 }}>
      <h2>Login</h2>
      <button onClick={() => handleLogin("admin")}>Login as Admin</button>
      <br /><br />
      <button onClick={() => handleLogin("teacher")}>Login as Teacher</button>
    </div>
  );
};

export default Login;
