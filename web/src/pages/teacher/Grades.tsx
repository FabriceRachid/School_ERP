import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/shared/StatCard";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { teachers, getClassById, getSubjectById, students, grades } from "@/data/mock-data";
import { Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const TeacherGradesPage = () => {
  const { user } = useAuth();
  const teacher = teachers.find(t => t.userId === user?.id);
  const teacherClasses = teacher?.classes.map(cid => getClassById(cid)).filter(Boolean) || [];
  const teacherSubjects = teacher?.subjects.map(sid => getSubjectById(sid)).filter(Boolean) || [];

  const [selectedClass, setSelectedClass] = useState(teacherClasses[0]?.id || "");
  const [selectedSubject, setSelectedSubject] = useState(teacherSubjects[0]?.id || "");
  const [localGrades, setLocalGrades] = useState<Record<string, string>>({});

  const classStudents = students.filter(s => s.classId === selectedClass);

  const getExistingGrade = (studentId: string) => {
    return grades.find(g => g.studentId === studentId && g.subjectId === selectedSubject && g.classId === selectedClass);
  };

  const handleSave = () => {
    toast({ title: "Notes enregistrées", description: `${Object.keys(localGrades).length} notes sauvegardées (démo)` });
    setLocalGrades({});
  };

  return (
    <DashboardLayout>
      <PageHeader title="Saisie des Notes" description="Entrez les notes de vos élèves">
        <div className="flex gap-2">
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Classe" /></SelectTrigger>
            <SelectContent>
              {teacherClasses.map(c => c && <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="w-44"><SelectValue placeholder="Matière" /></SelectTrigger>
            <SelectContent>
              {teacherSubjects.map(s => s && <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </PageHeader>

      <Card className="animate-fade-in">
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Élève</TableHead>
                <TableHead>Note existante</TableHead>
                <TableHead>Nouvelle note (/20)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classStudents.map(s => {
                const existing = getExistingGrade(s.id);
                return (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.firstName} {s.lastName}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{existing ? `${existing.value}/${existing.maxValue}` : "-"}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        max="20"
                        step="0.5"
                        className="w-24"
                        placeholder="--"
                        value={localGrades[s.id] || ""}
                        onChange={e => setLocalGrades(prev => ({ ...prev, [s.id]: e.target.value }))}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <div className="mt-4 flex justify-end">
            <Button onClick={handleSave} disabled={Object.keys(localGrades).length === 0}>
              <Save className="w-4 h-4 mr-2" />Enregistrer les notes
            </Button>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default TeacherGradesPage;
