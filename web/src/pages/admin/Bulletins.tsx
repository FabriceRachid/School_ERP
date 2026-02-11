import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/shared/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { getClassesBySchool, getStudentsBySchool, getGradesByClass, getSubjectsBySchool, students as allStudents, subjects as allSubjects, grades as allGrades } from "@/data/mock-data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { FileText, Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const BulletinsPage = () => {
  const { user } = useAuth();
  const schoolId = user?.schoolId || "s1";
  const classes = getClassesBySchool(schoolId);
  const [selectedClass, setSelectedClass] = useState(classes[0]?.id || "");

  const classStudents = allStudents.filter(s => s.classId === selectedClass);
  const schoolSubjects = allSubjects.filter(s => s.schoolId === schoolId);

  const getStudentAverage = (studentId: string) => {
    const studentGrades = allGrades.filter(g => g.studentId === studentId);
    if (studentGrades.length === 0) return null;
    const total = studentGrades.reduce((a, g) => a + (g.value / g.maxValue) * 20, 0);
    return (total / studentGrades.length).toFixed(2);
  };

  const generatePDF = (studentId: string) => {
    const student = allStudents.find(s => s.id === studentId);
    if (!student) return;

    const studentGrades = allGrades.filter(g => g.studentId === studentId);
    let content = `BULLETIN SCOLAIRE\n${"=".repeat(50)}\n`;
    content += `Élève: ${student.firstName} ${student.lastName}\n`;
    content += `Matricule: ${student.matricule}\n`;
    content += `Classe: ${classes.find(c => c.id === student.classId)?.name}\n`;
    content += `\n${"─".repeat(50)}\n`;
    content += `Matière`.padEnd(25) + `Note`.padEnd(10) + `Coef\n`;
    content += `${"─".repeat(50)}\n`;

    for (const grade of studentGrades) {
      const sub = allSubjects.find(s => s.id === grade.subjectId);
      content += `${(sub?.name || "-").padEnd(25)}${`${grade.value}/${grade.maxValue}`.padEnd(10)}${sub?.coefficient || "-"}\n`;
    }

    content += `${"─".repeat(50)}\n`;
    content += `Moyenne générale: ${getStudentAverage(studentId) || "N/A"}/20\n`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bulletin_${student.matricule}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Bulletin généré", description: `Bulletin de ${student.firstName} ${student.lastName}` });
  };

  return (
    <DashboardLayout>
      <PageHeader title="Bulletins Scolaires" description="Génération et consultation des bulletins">
        <Select value={selectedClass} onValueChange={setSelectedClass}>
          <SelectTrigger className="w-48"><SelectValue placeholder="Classe" /></SelectTrigger>
          <SelectContent>
            {classes.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
        {classStudents.map(student => {
          const avg = getStudentAverage(student.id);
          return (
            <Card key={student.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">{student.firstName} {student.lastName}</p>
                    <p className="text-xs text-muted-foreground font-mono">{student.matricule}</p>
                    <p className="text-sm mt-2">
                      Moyenne: <span className={`font-bold ${avg && parseFloat(avg) >= 10 ? "text-accent" : "text-destructive"}`}>{avg || "N/A"}/20</span>
                    </p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => generatePDF(student.id)}>
                    <Download className="w-3.5 h-3.5 mr-1" />PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </DashboardLayout>
  );
};

export default BulletinsPage;
