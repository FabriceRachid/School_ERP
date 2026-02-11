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
import { getStudentsBySchool, getClassById, classes, students as mockStudents } from "@/data/mock-data";
import { Plus, Search, Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Student } from "@/data/mock-data";
import { getStudents, saveStudents, addStudent, getStudentsByClass } from "@/services/students";

const StudentsPage = () => {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [studentsList, setStudentsList] = useState<Student[]>([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "M" as "M" | "F",
    classId: "",
    parentName: "",
    parentPhone: "",
  });

  useEffect(() => {
    // Initialize with mock data if localStorage is empty
    const stored = getStudents();
    if (stored.length === 0) {
      const schoolStudents = mockStudents.filter(s => s.schoolId === user?.schoolId);
      saveStudents(schoolStudents);
      setStudentsList(schoolStudents);
    } else {
      setStudentsList(stored.filter(s => s.schoolId === user?.schoolId));
    }
  }, [user?.schoolId]);

  const schoolClasses = classes.filter(c => c.schoolId === user?.schoolId);
  const filtered = studentsList.filter(s =>
    `${s.firstName} ${s.lastName} ${s.matricule}`.toLowerCase().includes(search.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleClassChange = (value: string) => {
    setFormData({ ...formData, classId: value });
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.dateOfBirth || !formData.classId || !formData.parentName) {
      toast({ title: "Erreur", description: "Veuillez remplir les champs obligatoires", variant: "destructive" });
      return;
    }

    const newStudent = addStudent({
      ...formData,
      schoolId: user?.schoolId || "s1",
    });

    setStudentsList([...studentsList, newStudent]);
    
    // Update class student count
    const classStudents = getStudentsByClass(formData.classId);
    // This would ideally update the class data in localStorage as well
    
    setFormData({
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "M",
      classId: "",
      parentName: "",
      parentPhone: "",
    });
    setDialogOpen(false);
    toast({ title: "Succès", description: "Élève inscrit avec succès" });
  };

  const handleExport = () => {
    const csvContent = [
      ["Matricule", "Prénom", "Nom", "Date de naissance", "Genre", "Classe", "Parent", "Téléphone"],
      ...filtered.map(s => [
        s.matricule,
        s.firstName,
        s.lastName,
        s.dateOfBirth,
        s.gender === "M" ? "Masculin" : "Féminin",
        getClassById(s.classId)?.name || "",
        s.parentName,
        s.parentPhone
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `eleves_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({ title: "Export réussi", description: "La liste des élèves a été exportée" });
  };

  return (
    <DashboardLayout>
      <PageHeader title="Gestion des Élèves" description={`${studentsList.length} élèves inscrits`}>
        <Button variant="outline" onClick={handleExport}><Download className="w-4 h-4 mr-2" />Exporter</Button>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-2" />Inscrire un élève</Button></DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Inscription d'un élève</DialogTitle></DialogHeader>
            <form className="space-y-4" onSubmit={handleAddStudent}>
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date de naissance *</Label>
                  <Input 
                    type="date" 
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Genre *</Label>
                  <Select value={formData.gender} onValueChange={(value) => setFormData({...formData, gender: value as "M" | "F"})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="M">Masculin</SelectItem>
                      <SelectItem value="F">Féminin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Classe *</Label>
                <Select value={formData.classId} onValueChange={handleClassChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une classe" />
                  </SelectTrigger>
                  <SelectContent>
                    {schoolClasses.map(cls => (
                      <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Parent/Tuteur *</Label>
                <Input 
                  name="parentName"
                  placeholder="Nom du parent" 
                  value={formData.parentName}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label>Téléphone parent</Label>
                <Input 
                  name="parentPhone"
                  placeholder="+225 ..." 
                  value={formData.parentPhone}
                  onChange={handleInputChange}
                />
              </div>
              <Button type="submit" className="w-full">Inscrire</Button>
            </form>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <Card className="animate-fade-in">
        <CardHeader className="pb-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="Rechercher un élève..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Matricule</TableHead>
                <TableHead>Nom complet</TableHead>
                <TableHead>Classe</TableHead>
                <TableHead>Genre</TableHead>
                <TableHead>Parent</TableHead>
                <TableHead>Téléphone</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(student => (
                <TableRow key={student.id}>
                  <TableCell><Badge variant="secondary" className="font-mono text-xs">{student.matricule}</Badge></TableCell>
                  <TableCell className="font-medium">{student.firstName} {student.lastName}</TableCell>
                  <TableCell>{getClassById(student.classId)?.name || "-"}</TableCell>
                  <TableCell>{student.gender === "M" ? "Masculin" : "Féminin"}</TableCell>
                  <TableCell className="text-sm">{student.parentName}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{student.parentPhone}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default StudentsPage;
