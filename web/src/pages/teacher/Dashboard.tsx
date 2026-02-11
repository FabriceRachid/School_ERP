import { DashboardLayout } from "@/components/DashboardLayout";
import { StatCard, PageHeader } from "@/components/shared/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { teachers, classes, getClassById, getSubjectById, students, getStudentsBySchool } from "@/data/mock-data";
import { BookOpen, Users, ClipboardList } from "lucide-react";

const TeacherDashboard = () => {
  const { user } = useAuth();
  const teacher = teachers.find(t => t.userId === user?.id);

  if (!teacher) return <DashboardLayout><p>Enseignant non trouvé</p></DashboardLayout>;

  const teacherClasses = teacher.classes.map(cid => getClassById(cid)).filter(Boolean);
  const totalStudents = teacherClasses.reduce((a, c) => a + (c?.studentsCount || 0), 0);

  return (
    <DashboardLayout>
      <PageHeader title={`Bonjour, ${teacher.firstName}`} description="Votre espace enseignant" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 animate-fade-in">
        <StatCard title="Mes classes" value={teacher.classes.length} icon={BookOpen} color="primary" />
        <StatCard title="Mes élèves" value={totalStudents} icon={Users} color="accent" />
        <StatCard title="Mes matières" value={teacher.subjects.length} icon={ClipboardList} color="warning" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
        <Card>
          <CardHeader><CardTitle className="font-display text-lg">Mes Classes</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {teacherClasses.map(c => c && (
              <div key={c.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/40 hover:bg-muted transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.studentsCount} élèves</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="font-display text-lg">Mes Matières</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {teacher.subjects.map(sid => {
              const sub = getSubjectById(sid);
              return sub && (
                <div key={sub.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/40">
                  <p className="font-medium">{sub.name}</p>
                  <span className="text-sm text-muted-foreground">Coef. {sub.coefficient}</span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TeacherDashboard;
