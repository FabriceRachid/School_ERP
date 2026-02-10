import Sidebar from "./Sidebar";

const AdminLayout = ({ children }) => (
  <div style={{ display: "flex" }}>
    <Sidebar />
    <div style={{ padding: 20, width: "100%" }}>
      {children}
    </div>
  </div>
);

export default AdminLayout;
