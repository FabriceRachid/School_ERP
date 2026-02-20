import { DashboardLayout } from "@/components/DashboardLayout";
import { StatCard, PageHeader } from "@/components/shared/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { getClassesBySchool, getStudentsBySchool, getTeachersBySchool, getPaymentsBySchool, getSchoolById } from "@/data/mock-data";
import { Users, GraduationCap, BookOpen, CreditCard, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const AdminDashboard = () => {
  const { user } = useAuth();
  const schoolId = user?.schoolId || "s1";
  const school = getSchoolById(schoolId);

  const students = getStudentsBySchool(schoolId);
  const teachers = getTeachersBySchool(schoolId);
  const classes = getClassesBySchool(schoolId);
  const payments = getPaymentsBySchool(schoolId);

  const totalRevenue = payments.reduce((a, p) => a + p.paidAmount, 0);
  const paidCount = payments.filter(p => p.status === "paid").length;
  const unpaidCount = payments.filter(p => p.status === "unpaid").length;

  const classChartData = classes.map(c => ({
    name: c.name,
    effectif: c.studentsCount,
    capacité: c.capacity,
  }));

  return (
    <DashboardLayout>
      <PageHeader
        title={`Dashboard ${school?.name || "École"}`}
        description={`Vue d'ensemble de ${school?.name || "votre établissement"}`}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 animate-fade-in">
        <StatCard title="Élèves inscrits" value={students.length} icon={Users} color="primary" />
        <StatCard title="Enseignants" value={teachers.length} icon={GraduationCap} color="accent" />
        <StatCard title="Classes" value={classes.length} icon={BookOpen} color="warning" />
        <StatCard title="Recettes" value={`${totalRevenue.toLocaleString()} FCFA`} icon={CreditCard} color="primary" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="font-display text-lg">Effectifs par classe</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={classChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="effectif" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                <Bar dataKey="capacité" fill="hsl(220, 13%, 91%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="font-display text-lg">Paiements</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-accent/10">
              <span className="text-sm">Payés</span>
              <span className="font-bold text-accent">{paidCount}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-warning/10">
              <span className="text-sm">Partiels</span>
              <span className="font-bold text-warning">{payments.filter(p => p.status === "partial").length}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-destructive/10">
              <span className="text-sm">Impayés</span>
              <span className="font-bold text-destructive">{unpaidCount}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;

