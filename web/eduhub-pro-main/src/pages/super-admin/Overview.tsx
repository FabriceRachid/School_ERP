import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader, StatCard } from "@/components/shared/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { schools, students, teachers, payments } from "@/data/mock-data";
import { School, Users, GraduationCap, TrendingUp } from "lucide-react";

const OverviewPage = () => {
  return (
    <DashboardLayout>
      <PageHeader title="Supervision" description="Indicateurs clés par école" />
      <div className="space-y-6 animate-fade-in">
        {schools.map(school => {
          const schoolStudents = students.filter(s => s.schoolId === school.id).length;
          const schoolTeachers = teachers.filter(t => t.schoolId === school.id).length;
          const schoolPayments = payments.filter(p => p.schoolId === school.id);
          const revenue = schoolPayments.reduce((a, p) => a + p.paidAmount, 0);
          const paidRate = schoolPayments.length > 0 ? Math.round(schoolPayments.filter(p => p.status === "paid").length / schoolPayments.length * 100) : 0;

          return (
            <Card key={school.id}>
              <CardHeader>
                <CardTitle className="font-display flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center"><School className="w-4 h-4 text-primary" /></div>
                  {school.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatCard title="Élèves" value={schoolStudents} icon={Users} color="primary" />
                  <StatCard title="Enseignants" value={schoolTeachers} icon={GraduationCap} color="accent" />
                  <StatCard title="Recettes" value={`${revenue.toLocaleString()} FCFA`} icon={TrendingUp} color="warning" />
                  <StatCard title="Taux paiement" value={`${paidRate}%`} icon={TrendingUp} color={paidRate > 50 ? "accent" : "destructive"} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </DashboardLayout>
  );
};

export default OverviewPage;
