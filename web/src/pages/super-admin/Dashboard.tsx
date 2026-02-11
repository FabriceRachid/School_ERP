import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatCard, PageHeader } from "@/components/shared/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { schools, students, teachers, payments } from "@/data/mock-data";
import { School, Users, GraduationCap, DollarSign, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { getSchools } from "@/services/schools";

const SuperAdminDashboard = () => {
  const [schoolsList, setSchoolsList] = useState(schools);

  useEffect(() => {
    const stored = getSchools();
    if (stored.length > 0) {
      setSchoolsList(stored);
    }
  }, []);

  const activeSchools = schoolsList.filter(s => s.status === "active");
  const totalStudents = activeSchools.reduce((a, s) => a + s.studentsCount, 0);
  const totalTeachers = activeSchools.reduce((a, s) => a + s.teachersCount, 0);
  const totalRevenue = payments.filter(p => p.paidAmount > 0).reduce((a, p) => a + p.paidAmount, 0);

  const schoolChartData = activeSchools.map(s => ({ name: s.name.split(" ").slice(0, 2).join(" "), élèves: s.studentsCount, enseignants: s.teachersCount }));

  const paymentStatus = [
    { name: "Payé", value: payments.filter(p => p.status === "paid").length, color: "hsl(152, 60%, 48%)" },
    { name: "Partiel", value: payments.filter(p => p.status === "partial").length, color: "hsl(36, 95%, 55%)" },
    { name: "Impayé", value: payments.filter(p => p.status === "unpaid").length, color: "hsl(0, 72%, 51%)" },
  ];

  return (
    <DashboardLayout>
      <PageHeader title="Tableau de bord" description="Vue d'ensemble de toutes les écoles" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 animate-fade-in">
        <StatCard title="Écoles" value={activeSchools.length} icon={School} color="primary" description="Écoles actives" />
        <StatCard title="Élèves" value={totalStudents.toLocaleString()} icon={Users} color="accent" trend="+12% vs année préc." />
        <StatCard title="Enseignants" value={totalTeachers} icon={GraduationCap} color="warning" />
        <StatCard title="Recettes" value={`${(totalRevenue / 1000000).toFixed(1)}M FCFA`} icon={DollarSign} color="primary" trend="+8% ce trimestre" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
        <Card>
          <CardHeader><CardTitle className="font-display text-lg">Effectifs par école</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={schoolChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="élèves" fill="hsl(234, 89%, 56%)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="enseignants" fill="hsl(152, 60%, 48%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="font-display text-lg">État des paiements</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={paymentStatus} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {paymentStatus.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 animate-fade-in">
        <CardHeader><CardTitle className="font-display text-lg">Écoles enregistrées</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {schoolsList.map(school => (
              <div key={school.id} className={`flex items-center justify-between p-4 rounded-xl ${school.status === "active" ? "bg-muted/40 hover:bg-muted" : "bg-red-50/50 hover:bg-red-100/50"} transition-colors`}>
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${school.status === "active" ? "bg-primary/10" : "bg-red-100"}`}>
                    <School className={`w-5 h-5 ${school.status === "active" ? "text-primary" : "text-red-600"}`} />
                  </div>
                  <div>
                    <p className={`font-medium ${school.status === "active" ? "text-foreground" : "text-red-700 line-through"}`}>{school.name}</p>
                    <p className="text-sm text-muted-foreground">{school.address}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <span>{school.studentsCount} élèves</span>
                  <span>{school.teachersCount} enseignants</span>
                  <span>{school.classesCount} classes</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    school.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}>
                    {school.status === "active" ? "Actif" : "Inactif"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default SuperAdminDashboard;
