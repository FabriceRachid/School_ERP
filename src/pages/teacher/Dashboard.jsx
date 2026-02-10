import TeacherLayout from "../../components/TeacherLayout";

const Dashboard = () => {
  const classes = ["3A", "4B", "5C"];

  return (
    <TeacherLayout>
      <h2>Teacher Dashboard</h2>
      <p>My Classes:</p>
      <ul>
        {classes.map(c => <li key={c}>{c}</li>)}
      </ul>
    </TeacherLayout>
  );
};

export default Dashboard;
