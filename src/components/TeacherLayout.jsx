import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";

const TeacherLayout = ({ children }) => {
  const { logout } = useAuth();

  return (
    <div style={{ display: "flex" }}>
      <div style={{ width: 220, background: "#2563eb", color: "#fff", minHeight: "100vh", padding: 20 }}>
        <h3>Teacher Panel</h3>
        <Link to="/teacher/dashboard" style={{ color: "#fff" }}>Dashboard</Link><br />
        <Link to="/teacher/grades" style={{ color: "#fff" }}>Enter Grades</Link><br /><br />
        <button onClick={logout}>Logout</button>
      </div>
      <div style={{ padding: 20, width: "100%" }}>
        {children}
      </div>
    </div>
  );
};

export default TeacherLayout;
