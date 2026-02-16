import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/shared/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/contexts/AuthContext";
import { teachers, getClassById, students } from "@/data/mock-data";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const TeacherClassesPage = () => {
  const { user } = useAuth();
  const teacher = teachers.find(t => t.userId === user?.id);
  const teacherClasses = teacher?.classes.map(cid => getClassById(cid)).filter(Boolean) || [];
  const [selectedClass, setSelectedClass] = useState(teacherClasses[0]?.id || "");

  const classStudents = students.filter(s => s.classId === selectedClass);

  return (
    <DashboardLayout>
      <PageHeader title="Mes Classes" description="Liste des élèves par classe">
        <Select value={selectedClass} onValueChange={setSelectedClass}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            {teacherClasses.map(c => c && <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </PageHeader>

      <Card className="animate-fade-in">
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Matricule</TableHead>
                <TableHead>Nom complet</TableHead>
                <TableHead>Genre</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classStudents.map(s => (
                <TableRow key={s.id}>
                  <TableCell className="font-mono text-sm">{s.matricule}</TableCell>
                  <TableCell className="font-medium">{s.firstName} {s.lastName}</TableCell>
                  <TableCell>{s.gender === "M" ? "Masculin" : "Féminin"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default TeacherClassesPage;
