import { useState } from "react";
import AdminLayout from "../../components/AdminLayout";

const Dashboard = () => {
  const schools = ["Lycée A", "Collège B", "Institut C"];
  const [school, setSchool] = useState(schools[0]);

  return (
    <AdminLayout>
      <h1>Admin Dashboard</h1>

      <label>Select School:</label>
      <select value={school} onChange={e => setSchool(e.target.value)}>
        {schools.map(s => <option key={s}>{s}</option>)}
      </select>

      <p>Current School: {school}</p>

      <ul>
        <li>Students: 120</li>
        <li>Teachers: 15</li>
        <li>Classes: 8</li>
        <li>Fees Paid: 75%</li>
      </ul>
    </AdminLayout>
  );
};

export default Dashboard;
