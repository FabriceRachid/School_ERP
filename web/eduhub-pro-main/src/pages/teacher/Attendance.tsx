import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/shared/StatCard";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { teachers, getClassById, students } from "@/data/mock-data";
import { Badge } from "@/components/ui/badge";
import { Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";

type Status = "present" | "absent" | "late";

const TeacherAttendancePage = () => {
  const { user } = useAuth();
  const teacher = teachers.find(t => t.userId === user?.id);
  const teacherClasses = teacher?.classes.map(cid => getClassById(cid)).filter(Boolean) || [];
  const [selectedClass, setSelectedClass] = useState(teacherClasses[0]?.id || "");
  const [statuses, setStatuses] = useState<Record<string, Status>>({});

  const classStudents = students.filter(s => s.classId === selectedClass);

  const statusColors = { present: "default", absent: "destructive", late: "secondary" } as const;
  const statusLabels = { present: "Présent", absent: "Absent", late: "En retard" };

  const handleSave = () => {
    toast({
      title: "Présences enregistrées",
      description: `${Object.keys(statuses).length} marquages sauvegardés`,
      className: "bg-emerald-600 text-white border-emerald-700"
    });
  };

  return (
    <DashboardLayout>
      <PageHeader title="Appel / Présences" description="Marquer les présences et absences">
        <Select value={selectedClass} onValueChange={c => { setSelectedClass(c); setStatuses({}); }}>
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
                <TableHead>Élève</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classStudents.map(s => {
                const status = statuses[s.id] || "present";
                return (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.firstName} {s.lastName}</TableCell>
                    <TableCell><Badge variant={statusColors[status]}>{statusLabels[status]}</Badge></TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {(["present", "absent", "late"] as Status[]).map(st => (
                          <Button key={st} size="sm" variant={status === st ? "default" : "outline"} className="text-xs h-7" onClick={() => setStatuses(prev => ({ ...prev, [s.id]: st }))}>
                            {statusLabels[st]}
                          </Button>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <div className="mt-4 flex justify-end">
            <Button onClick={handleSave}><Save className="w-4 h-4 mr-2" />Enregistrer</Button>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default TeacherAttendancePage;
