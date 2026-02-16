import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader, StatCard } from "@/components/shared/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { getStudentsBySchool, getTeachersBySchool, getClassesBySchool, getPaymentsBySchool, grades as allGrades } from "@/data/mock-data";
import { Users, GraduationCap, TrendingUp, AlertCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const ReportsPage = () => {
  const { user } = useAuth();
  const schoolId = user?.schoolId || "s1";
  const students = getStudentsBySchool(schoolId);
  const teachers = getTeachersBySchool(schoolId);
  const classes = getClassesBySchool(schoolId);
  const payments = getPaymentsBySchool(schoolId);

  const unpaidStudents = payments.filter(p => p.status === "unpaid").length;

  const classData = classes.map(c => {
    const classGrades = allGrades.filter(g => g.classId === c.id);
    const avg = classGrades.length > 0 ? classGrades.reduce((a, g) => a + (g.value / g.maxValue) * 20, 0) / classGrades.length : 0;
    return { name: c.name, moyenne: parseFloat(avg.toFixed(1)), effectif: c.studentsCount };
  });

  return (
    <DashboardLayout>
      <PageHeader title="Rapports" description="Statistiques et indicateurs" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 animate-fade-in">
        <StatCard title="Total élèves" value={students.length} icon={Users} color="primary" />
        <StatCard title="Enseignants" value={teachers.length} icon={GraduationCap} color="accent" />
        <StatCard title="Élèves en impayés" value={unpaidStudents} icon={AlertCircle} color="destructive" />
        <StatCard title="Recettes" value={`${(payments.reduce((a, p) => a + p.paidAmount, 0) / 1000).toFixed(0)}K`} icon={TrendingUp} color="warning" />
      </div>

      <Card className="animate-fade-in">
        <CardHeader><CardTitle className="font-display">Moyenne par classe</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={classData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 20]} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="moyenne" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default ReportsPage;

