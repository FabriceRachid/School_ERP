import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/shared/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { getClassesBySchool, getStudentsBySchool, getGradesByClass, getSubjectsBySchool, students as allStudents, subjects as allSubjects, grades as allGrades, schools, teachers as allTeachers, getTeacherById } from "@/data/mock-data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Download, Eye } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const BulletinsPage = () => {
  const { user } = useAuth();
  const schoolId = user?.schoolId || "s1";
  const classes = getClassesBySchool(schoolId);
  const [selectedClass, setSelectedClass] = useState(classes[0]?.id || "");
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<typeof allStudents[0] | null>(null);

  const classStudents = allStudents.filter(s => s.classId === selectedClass);
  const schoolSubjects = allSubjects.filter(s => s.schoolId === schoolId);

  const getStudentAverage = (studentId: string) => {
    const studentGrades = allGrades.filter(g => g.studentId === studentId);
    if (studentGrades.length === 0) return null;
    const total = studentGrades.reduce((a, g) => a + (g.value / g.maxValue) * 20, 0);
    return (total / studentGrades.length).toFixed(2);
  };

  const generateTxt = (studentId: string) => {
    const student = allStudents.find(s => s.id === studentId);
    if (!student) return;

    const studentGrades = allGrades.filter(g => g.studentId === studentId);
    let content = `BULLETIN SCOLAIRE\n${"=".repeat(70)}\n`;
    content += `Établissement: ${schools.find(s => s.id === schoolId)?.name || "Inconnu"}\n`;
    content += `Élève: ${student.firstName} ${student.lastName}\n`;
    content += `Matricule: ${student.matricule}\n`;
    content += `Classe: ${classes.find(c => c.id === student.classId)?.name}\n`;
    content += `Année scolaire: 2024-2025\n`;
    content += `\n${"─".repeat(70)}\n`;
    content += `Matière`.padEnd(25) + `Note/Max`.padEnd(12) + `Coef`.padEnd(8) + `Note sur 20\n`;
    content += `${"─".repeat(70)}\n`;

    let totalWeighted = 0;
    let totalCoeff = 0;

    for (const grade of studentGrades) {
      const sub = allSubjects.find(s => s.id === grade.subjectId);
      const noteSur20 = ((grade.value / grade.maxValue) * 20).toFixed(2);
      content += `${(sub?.name || "-").padEnd(25)}${`${grade.value}/${grade.maxValue}`.padEnd(12)}${String(sub?.coefficient || "-").padEnd(8)}${noteSur20}\n`;
      
      if (sub?.coefficient) {
        totalWeighted += parseFloat(noteSur20) * sub.coefficient;
        totalCoeff += sub.coefficient;
      }
    }

    content += `${"─".repeat(70)}\n`;
    const moyenne = totalCoeff > 0 ? (totalWeighted / totalCoeff).toFixed(2) : "N/A";
    content += `Moyenne générale: ${moyenne}/20\n`;
    content += `\nAppréciation: ${parseFloat(moyenne) >= 10 ? "Admis" : "Ajourné"}\n`;
    content += `${"─".repeat(70)}\n`;
    content += `\nGénéré le ${new Date().toLocaleString("fr-FR")}`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bulletin_${student.matricule}_${new Date().toISOString().split("T")[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Bulletin généré", description: `Bulletin TXT de ${student.firstName} ${student.lastName}` });
  };

  const viewBulletin = (studentId: string) => {
    const student = allStudents.find(s => s.id === studentId);
    if (!student) return;
    setSelectedStudent(student);
    setViewDialogOpen(true);
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
                  <div className="flex gap-1">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => viewBulletin(student.id)}
                    >
                      <Eye className="w-3.5 h-3.5 mr-1" />Voir
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => generateTxt(student.id)}
                    >
                      <Download className="w-3.5 h-3.5 mr-1" />TXT
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Bulletin View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Bulletin Scolaire</DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <div className="font-mono text-sm">
              <div className="border-b pb-3 mb-3">
                <h3 className="text-lg font-bold text-center mb-2">BULLETIN SCOLAIRE</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><strong>Établissement:</strong> {schools.find(s => s.id === schoolId)?.name || "Inconnu"}</div>
                  <div><strong>Année scolaire:</strong> 2024-2025</div>
                  <div><strong>Élève:</strong> {selectedStudent.firstName} {selectedStudent.lastName}</div>
                  <div><strong>Matricule:</strong> {selectedStudent.matricule}</div>
                  <div><strong>Classe:</strong> {classes.find(c => c.id === selectedStudent.classId)?.name}</div>
                </div>
              </div>
              
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b bg-muted">
                    <th className="text-left p-3 font-semibold">Matière</th>
                    <th className="text-center p-3 font-semibold">Note/Max</th>
                    <th className="text-center p-3 font-semibold">Coef</th>
                    <th className="text-center p-3 font-semibold">Note/20</th>
                    <th className="text-left p-3 font-semibold">Professeur</th>
                  </tr>
                </thead>
                <tbody>
                  {allGrades.filter(g => g.studentId === selectedStudent.id).map((grade, idx) => {
                    const sub = allSubjects.find(s => s.id === grade.subjectId);
                    const teacher = allTeachers.find(t => t.id === grade.teacherId);
                    const noteSur20 = ((grade.value / grade.maxValue) * 20).toFixed(2);
                    return (
                      <tr key={idx} className="border-b hover:bg-muted/50">
                        <td className="p-3 font-medium">{sub?.name || "-"}</td>
                        <td className="p-3 text-center">{grade.value}/{grade.maxValue}</td>
                        <td className="p-3 text-center font-medium">{sub?.coefficient || "-"}</td>
                        <td className="p-3 text-center font-bold">{noteSur20}</td>
                        <td className="p-3">
                          {teacher ? `${teacher.firstName} ${teacher.lastName}` : "-"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              
              <div className="mt-4 pt-3 border-t">
                <div className="text-right">
                  <p className="font-bold text-lg">
                    Moyenne générale: <span className={getStudentAverage(selectedStudent.id) && parseFloat(getStudentAverage(selectedStudent.id)!) >= 10 ? "text-green-600" : "text-red-600"}>
                      {getStudentAverage(selectedStudent.id) || "N/A"}/20
                    </span>
                  </p>
                  <p className="mt-2">
                    Appréciation: {getStudentAverage(selectedStudent.id) && parseFloat(getStudentAverage(selectedStudent.id)!) >= 10 ? "✅ Admis" : "❌ Ajourné"}
                  </p>
                </div>
              </div>
              
              <div className="mt-4 text-xs text-muted-foreground text-center">
                Généré le {new Date().toLocaleString("fr-FR")}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default BulletinsPage;
