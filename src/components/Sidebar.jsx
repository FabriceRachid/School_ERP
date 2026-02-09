import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Sidebar = () => {
  const { logout } = useAuth();

  return (
    <div style={{ width: 220, background: "#111827", color: "#fff", minHeight: "100vh", padding: 20 }}>
      <h3>School ERP</h3>
      <nav>
        <Link to="/admin/dashboard">Dashboard</Link><br />
        <Link to="/admin/students">Students</Link><br />
        <Link to="/admin/teachers">Teachers</Link><br />
        <Link to="/admin/classes">Classes</Link><br />
        <Link to="/admin/payments">Payments</Link><br />
      </nav>
      <br />
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Sidebar;
