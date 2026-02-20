import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/shared/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { teachers, getClassById, getSubjectById, students, grades } from "@/data/mock-data";
import { Save, Upload, FileText, Calendar, BookOpen } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const TeacherGradesPage = () => {
  const { user } = useAuth();
  const teacher = teachers.find(t => t.userId === user?.id);
  const teacherClasses = teacher?.classes.map(cid => getClassById(cid)).filter(Boolean) || [];
  const teacherSubjects = teacher?.subjects.map(sid => getSubjectById(sid)).filter(Boolean) || [];

  const [selectedClass, setSelectedClass] = useState(teacherClasses[0]?.id || "");
  const [selectedSubject, setSelectedSubject] = useState(teacherSubjects[0]?.id || "");
  const [localGrades, setLocalGrades] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState("grades");
  
  // Exam management states
  const [examDialogOpen, setExamDialogOpen] = useState(false);
  const [examForm, setExamForm] = useState({
    title: "",
    date: "",
    type: "control" as "control" | "exam" | "tp",
    maxScore: 20
  });

  const classStudents = students.filter(s => s.classId === selectedClass);

  const getExistingGrade = (studentId: string) => {
    return grades.find(g => g.studentId === studentId && g.subjectId === selectedSubject && g.classId === selectedClass);
  };

  const handleSave = () => {
    toast({
      title: "Notes enregistrées",
      description: `${Object.keys(localGrades).length} notes sauvegardées`,
      className: "bg-emerald-600 text-white border-emerald-700"
    });
    setLocalGrades({});
  };

  const handleCreateExam = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Composition créée",
      description: `${examForm.title} a été programmée pour le ${examForm.date}`,
      className: "bg-emerald-600 text-white border-emerald-700"
    });
    setExamDialogOpen(false);
    setExamForm({ title: "", date: "", type: "control", maxScore: 20 });
  };

  const handleUploadSubject = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      toast({
        title: "Sujet téléchargé",
        description: `${file.name} a été enregistré`,
        className: "bg-emerald-600 text-white border-emerald-700"
      });
    }
  };

  return (
    <DashboardLayout>
      <PageHeader 
        title="Évaluations et Notes" 
        description="Gérer les compositions, sujets et notes"
      >
        <div className="flex gap-3">
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-44">
              <BookOpen className="w-4 h-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Classe" />
            </SelectTrigger>
            <SelectContent>
              {teacherClasses.map(c => c && (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="w-48">
              <FileText className="w-4 h-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Matière" />
            </SelectTrigger>
            <SelectContent>
              {teacherSubjects.map(s => s && (
                <SelectItem key={s.id} value={s.id}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </PageHeader>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="grades" className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            Saisie Notes
          </TabsTrigger>
          <TabsTrigger value="exams" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Compositions
          </TabsTrigger>
          <TabsTrigger value="subjects" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Sujets
          </TabsTrigger>
        </TabsList>

        {/* Grades Tab */}
        <TabsContent value="grades" className="space-y-4">
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Saisie des Notes</CardTitle>
            </CardHeader>
            <CardContent>
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
        </TabsContent>

        {/* Exams Tab */}
        <TabsContent value="exams" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Programmation des compositions</h3>
            <Dialog open={examDialogOpen} onOpenChange={setExamDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Calendar className="w-4 h-4 mr-2" />
                  Nouvelle composition
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Programmer une composition</DialogTitle>
                </DialogHeader>
                <form className="space-y-4" onSubmit={handleCreateExam}>
                  <div className="space-y-2">
                    <Label>Titre de la composition</Label>
                    <Input 
                      value={examForm.title}
                      onChange={(e) => setExamForm({...examForm, title: e.target.value})}
                      placeholder="Ex: Contrôle de Mathématiques" 
                      required 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <Input 
                        type="date" 
                        value={examForm.date}
                        onChange={(e) => setExamForm({...examForm, date: e.target.value})}
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Type</Label>
                      <Select 
                        value={examForm.type} 
                        onValueChange={(value) => setExamForm({...examForm, type: value as "control" | "exam" | "tp"})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="control">Contrôle</SelectItem>
                          <SelectItem value="exam">Examen</SelectItem>
                          <SelectItem value="tp">TP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Note maximale</Label>
                    <Input 
                      type="number" 
                      min="1" 
                      max="100" 
                      value={examForm.maxScore}
                      onChange={(e) => setExamForm({...examForm, maxScore: Number(e.target.value)})}
                      required 
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Programmer la composition
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Aucune composition programmée</p>
                <p className="text-sm mt-1">Cliquez sur "Nouvelle composition" pour commencer</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Subjects Tab */}
        <TabsContent value="subjects" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Gestion des sujets</h3>
            <Button>
              <Upload className="w-4 h-4 mr-2" />
              Télécharger un sujet
            </Button>
          </div>
          
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                  <p className="font-medium mb-1">Glissez-déposez un fichier ici</p>
                  <p className="text-sm text-muted-foreground mb-4">Formats supportés: PDF, DOC, DOCX</p>
                  <input 
                    type="file" 
                    accept=".pdf,.doc,.docx" 
                    onChange={handleUploadSubject}
                    className="hidden" 
                    id="subject-upload" 
                  />
                  <label htmlFor="subject-upload">
                    <Button asChild>
                      <span>Parcourir les fichiers</span>
                    </Button>
                  </label>
                </div>
                
                <div className="text-center py-4 text-muted-foreground">
                  <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>Aucun sujet téléchargé</p>
                  <p className="text-sm mt-1">Les sujets apparaitront ici après téléchargement</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default TeacherGradesPage;
