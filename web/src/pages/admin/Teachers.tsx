import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/shared/StatCard";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { getTeachersBySchool, getSubjectById, getClassById, subjects, classes, teachers as mockTeachers } from "@/data/mock-data";
import { Plus, Search } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Teacher } from "@/data/mock-data";
import { getTeachers, saveTeachers, addTeacher, getTeachersBySchool as getTeachersBySchoolService } from "@/services/teachers";

const TeachersPage = () => {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [teachersList, setTeachersList] = useState<Teacher[]>([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    subjects: [] as string[],
    classes: [] as string[],
  });

  useEffect(() => {
    // Initialize with mock data if localStorage is empty
    const stored = getTeachers();
    if (stored.length === 0) {
      const schoolTeachers = mockTeachers.filter(t => t.schoolId === user?.schoolId);
      saveTeachers(schoolTeachers);
      setTeachersList(schoolTeachers);
    } else {
      setTeachersList(stored.filter(t => t.schoolId === user?.schoolId));
    }
  }, [user?.schoolId]);

  const schoolSubjects = subjects.filter(s => s.schoolId === user?.schoolId);
  const schoolClasses = classes.filter(c => c.schoolId === user?.schoolId);
  const filtered = teachersList.filter(t => `${t.firstName} ${t.lastName}`.toLowerCase().includes(search.toLowerCase()));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubjectsChange = (values: string[]) => {
    setFormData({ ...formData, subjects: values });
  };

  const handleClassesChange = (values: string[]) => {
    setFormData({ ...formData, classes: values });
  };

  const handleAddTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast({ title: "Erreur", description: "Veuillez remplir les champs obligatoires", variant: "destructive" });
      return;
    }

    const newTeacher = addTeacher({
      ...formData,
      schoolId: user?.schoolId || "s1",
    });

    setTeachersList([...teachersList, newTeacher]);
    setFormData({
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      subjects: [],
      classes: [],
    });
    setDialogOpen(false);
    toast({ title: "Succès", description: "Enseignant ajouté avec succès" });
  };

  return (
    <DashboardLayout>
      <PageHeader title="Gestion des Enseignants" description={`${teachersList.length} enseignants`}>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-2" />Ajouter un enseignant</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Nouvel enseignant</DialogTitle></DialogHeader>
            <form className="space-y-4" onSubmit={handleAddTeacher}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Prénom *</Label>
                  <Input 
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Nom *</Label>
                  <Input 
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Email *</Label>
                <Input 
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label>Téléphone</Label>
                <Input 
                  name="phone"
                  placeholder="+225 ..."
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label>Matières</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner les matières" />
                  </SelectTrigger>
                  <SelectContent>
                    {schoolSubjects.map(subject => (
                      <SelectItem key={subject.id} value={subject.id}>{subject.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Classes</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner les classes" />
                  </SelectTrigger>
                  <SelectContent>
                    {schoolClasses.map(cls => (
                      <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">Créer le compte</Button>
            </form>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <Card className="animate-fade-in">
        <CardHeader className="pb-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead>Matières</TableHead>
                <TableHead>Classes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(teacher => (
                <TableRow key={teacher.id}>
                  <TableCell className="font-medium">{teacher.firstName} {teacher.lastName}</TableCell>
                  <TableCell className="text-sm">{teacher.phone}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {teacher.subjects.map(sid => <Badge key={sid} variant="secondary" className="text-xs">{getSubjectById(sid)?.name || sid}</Badge>)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {teacher.classes.map(cid => <Badge key={cid} variant="outline" className="text-xs">{getClassById(cid)?.name || cid}</Badge>)}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default TeachersPage;
