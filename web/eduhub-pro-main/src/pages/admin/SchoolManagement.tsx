import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/shared/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";
import { 
  getStudentsBySchool, 
  getTeachersBySchool, 
  getClassesBySchool, 
  getSubjectsBySchool, 
  getClassById, 
  getSubjectById,
  Student,
  Teacher,
  ClassRoom,
  Subject
} from "@/data/mock-data";
import { 
  Plus, Search, Users, GraduationCap, BookOpen, ClipboardList, 
  Edit, Trash2, UserPlus, School, Book, Power, PowerOff, Eye 
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { provisionUser, createClass, createSubject, refreshWebBootstrap } from "@/lib/api";
import { teacherQualificationService } from "@/services/teacherQualificationService";

const SchoolManagementPage = () => {
  const { user } = useAuth();
  const schoolId = user?.schoolId || "s1";
  
  // States for all entities
  const [activeTab, setActiveTab] = useState("students");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Students state
  const [students] = useState<Student[]>(() => getStudentsBySchool(schoolId));
  const [studentDialogOpen, setStudentDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [savingStudent, setSavingStudent] = useState(false);
  
  // Teachers state
  const [teachers, setTeachers] = useState<Teacher[]>(() => getTeachersBySchool(schoolId));
  const [teacherDialogOpen, setTeacherDialogOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [savingTeacher, setSavingTeacher] = useState(false);
  const [teacherForm, setTeacherForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    specialization: ""
  });
  
  // Form validation
  const isTeacherFormValid = teacherForm.firstName.trim() !== "" && 
                            teacherForm.lastName.trim() !== "" && 
                            teacherForm.email.trim() !== "" &&
                            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(teacherForm.email);
  const [qualifiedSubjects, setQualifiedSubjects] = useState<string[]>([]);
  
  // Classes state
  const [classes, setClasses] = useState<ClassRoom[]>(() => getClassesBySchool(schoolId));
  const [classDialogOpen, setClassDialogOpen] = useState(false);
  const [savingClass, setSavingClass] = useState(false);
  const [classForm, setClassForm] = useState({
    name: "",
    capacity: 40,
    fees: 0
  });
  
  // Subjects state
  const [subjects, setSubjects] = useState<Subject[]>(() => getSubjectsBySchool(schoolId));
  const [subjectDialogOpen, setSubjectDialogOpen] = useState(false);
  const [savingSubject, setSavingSubject] = useState(false);
  const [subjectForm, setSubjectForm] = useState({
    name: "",
    coefficient: 1
  });
  const [availableSubjects, setAvailableSubjects] = useState<Subject[]>([]);

  // Student handlers
  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setStudentDialogOpen(true);
  };





  const handleEditClass = (classItem: ClassRoom) => {
    toast({
      title: "Édition de classe",
      description: `Modification de ${classItem.name}`,
      className: "bg-blue-600 text-white border-blue-700"
    });
  };

  const handleEditSubject = (subject: Subject) => {
    toast({
      title: "Édition de matière",
      description: `Modification de ${subject.name}`,
      className: "bg-blue-600 text-white border-blue-700"
    });
  };

  // Status toggle handlers for all entity types
  const handleToggleStudentStatus = (student: Student) => {
    const newStatus = !student.isActive;
    
    toast({
      title: newStatus ? "Élève activé" : "Élève désactivé",
      description: `${student.firstName} ${student.lastName} est maintenant ${newStatus ? 'actif' : 'inactif'}`,
      className: newStatus ? "bg-green-600 text-white border-green-700" : "bg-red-600 text-white border-red-700"
    });
  };

  const handleToggleTeacherStatus = (teacher: Teacher) => {
    const newStatus = !teacher.isActive;
    
    toast({
      title: newStatus ? "Enseignant activé" : "Enseignant désactivé",
      description: `${teacher.firstName} ${teacher.lastName} est maintenant ${newStatus ? 'actif' : 'inactif'}`,
      className: newStatus ? "bg-green-600 text-white border-green-700" : "bg-red-600 text-white border-red-700"
    });
  };

  const handleToggleClassStatus = (classItem: ClassRoom) => {
    const newStatus = !classItem.isActive;
    
    toast({
      title: newStatus ? "Classe activée" : "Classe désactivée",
      description: `${classItem.name} est maintenant ${newStatus ? 'active' : 'inactive'}`,
      className: newStatus ? "bg-green-600 text-white border-green-700" : "bg-red-600 text-white border-red-700"
    });
  };

  const handleToggleSubjectStatus = (subject: Subject) => {
    const newStatus = !subject.isActive;
    
    toast({
      title: newStatus ? "Matière activée" : "Matière désactivée",
      description: `${subject.name} est maintenant ${newStatus ? 'active' : 'inactive'}`,
      className: newStatus ? "bg-green-600 text-white border-green-700" : "bg-red-600 text-white border-red-700"
    });
  };

  // Filtered data
  const filteredStudents = students.filter(s =>
    `${s.firstName} ${s.lastName} ${s.matricule}`.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredTeachers = teachers.filter(t =>
    `${t.firstName} ${t.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredClasses = classes.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredSubjects = subjects.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Load available subjects for qualification selection
  useEffect(() => {
    const loadSubjects = async () => {
      try {
        await refreshWebBootstrap();
        const updatedSubjects = getSubjectsBySchool(schoolId);
        setAvailableSubjects(updatedSubjects);
        setSubjects(updatedSubjects);
      } catch (error) {
        console.error('Error loading subjects:', error);
        // Fallback to initial subjects
        setAvailableSubjects(getSubjectsBySchool(schoolId));
      }
    };
    
    loadSubjects();
  }, [schoolId]);

  // Teacher handlers
  const handleEditTeacher = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setTeacherForm({
      firstName: teacher.firstName,
      lastName: teacher.lastName,
      email: "", // Email usually not editable for security
      phone: teacher.phone,
      specialization: ""
    });
    setQualifiedSubjects(teacher.subjects);
    setTeacherDialogOpen(true);
  };

  const handleCreateTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingTeacher(true);
      
      const userData = await provisionUser({
        email: teacherForm.email,
        first_name: teacherForm.firstName,
        last_name: teacherForm.lastName,
        phone: teacherForm.phone,
        role: "teacher",
        school_id: schoolId
      });
      
      await refreshWebBootstrap();
      const updatedTeachers = getTeachersBySchool(schoolId);
      setTeachers(updatedTeachers);
      
      // Handle qualifications
      if (qualifiedSubjects.length > 0) {
        if (editingTeacher) {
          // Update existing teacher qualifications
          await teacherQualificationService.bulkUpdateQualifications(editingTeacher.id, qualifiedSubjects);
        } else {
          // Add qualifications for new teacher
          const newTeacher = updatedTeachers.find(t => 
            t.firstName === teacherForm.firstName && 
            t.lastName === teacherForm.lastName && 
            t.phone === teacherForm.phone
          );
          
          if (newTeacher) {
            for (const subjectId of qualifiedSubjects) {
              await teacherQualificationService.addSubjectQualification(newTeacher.id, subjectId);
            }
          }
        }
      }
      
      const action = editingTeacher ? "mis à jour" : "créé";
      toast({
        title: `Enseignant ${action}`,
        description: `${teacherForm.firstName} ${teacherForm.lastName} a été ${action} avec succès`,
        className: "bg-emerald-600 text-white border-emerald-700"
      });
      
      setTeacherDialogOpen(false);
      setEditingTeacher(null);
      setTeacherForm({ firstName: "", lastName: "", email: "", phone: "", specialization: "" });
      setQualifiedSubjects([]);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Création impossible";
      toast({ title: "Erreur", description: message, variant: "destructive" });
    } finally {
      setSavingTeacher(false);
    }
  };

  // Class handlers
  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingClass(true);
      
      const created = await createClass({
        name: classForm.name.trim(),
        academic_year: "2025-2026",
        level: "Général",
        capacity: classForm.capacity,
        fees: classForm.fees
      });
      
      await refreshWebBootstrap();
      setClasses(getClassesBySchool(schoolId));
      
      toast({
        title: "Classe créée",
        description: `${classForm.name} a été créée avec succès`,
        className: "bg-emerald-600 text-white border-emerald-700"
      });
      
      setClassDialogOpen(false);
      setClassForm({ name: "", capacity: 40, fees: 0 });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Création impossible";
      toast({ title: "Erreur", description: message, variant: "destructive" });
    } finally {
      setSavingClass(false);
    }
  };

  // Subject handlers
  const handleCreateSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingSubject(true);
      
      await createSubject({
        name: subjectForm.name.trim(),
        coefficient: subjectForm.coefficient
      });
      
      await refreshWebBootstrap();
      setSubjects(getSubjectsBySchool(schoolId));
      
      toast({
        title: "Matière créée",
        description: `${subjectForm.name} a été ajoutée`,
        className: "bg-emerald-600 text-white border-emerald-700"
      });
      
      setSubjectDialogOpen(false);
      setSubjectForm({ name: "", coefficient: 1 });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Création impossible";
      toast({ title: "Erreur", description: message, variant: "destructive" });
    } finally {
      setSavingSubject(false);
    }
  };

  return (
    <DashboardLayout>
      <PageHeader 
        title="Gestion de l'École" 
        description="Gérer les élèves, enseignants, classes et matières"
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="students" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Élèves
          </TabsTrigger>
          <TabsTrigger value="teachers" className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4" />
            Enseignants
          </TabsTrigger>
          <TabsTrigger value="classes" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Classes
          </TabsTrigger>
          <TabsTrigger value="subjects" className="flex items-center gap-2">
            <ClipboardList className="w-4 h-4" />
            Matières
          </TabsTrigger>
        </TabsList>

        {/* Search bar for all tabs */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            className="pl-9" 
            placeholder="Rechercher..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>

        {/* Students Tab */}
        <TabsContent value="students" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Liste des Élèves ({filteredStudents.length})</h3>
            <Button>
              <UserPlus className="w-4 h-4 mr-2" />
              Inscrire un élève
            </Button>
          </div>
          
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Matricule</TableHead>
                    <TableHead>Nom complet</TableHead>
                    <TableHead>Classe</TableHead>
                    <TableHead>Genre</TableHead>
                    <TableHead>Parent</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map(student => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <Badge variant="secondary" className="font-mono text-xs">
                          {student.matricule}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {student.firstName} {student.lastName}
                      </TableCell>
                      <TableCell>
                        {getClassById(student.classId)?.name || "-"}
                      </TableCell>
                      <TableCell>
                        {student.gender === "M" ? "Masculin" : "Féminin"}
                      </TableCell>
                      <TableCell className="text-sm">
                        {student.parentName}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleEditStudent(student)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleToggleStudentStatus(student)}
                            className={`h-8 w-8 p-0 ${student.isActive ? 'bg-green-100 text-green-700 border-green-300 hover:bg-green-200' : 'bg-red-100 text-red-700 border-red-300 hover:bg-red-200'}`}
                          >
                            {student.isActive ? 
                              <Power className="w-4 h-4" /> : 
                              <PowerOff className="w-4 h-4" />
                            }
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Teachers Tab */}
        <TabsContent value="teachers" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Liste des Enseignants ({filteredTeachers.length})</h3>
            <Dialog open={teacherDialogOpen} onOpenChange={setTeacherDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter un enseignant
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingTeacher ? "Modifier l'enseignant" : "Nouvel enseignant"}
                  </DialogTitle>
                </DialogHeader>
                <form className="space-y-4" onSubmit={handleCreateTeacher}>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Prénom</Label>
                      <Input 
                        value={teacherForm.firstName} 
                        onChange={(e) => setTeacherForm({...teacherForm, firstName: e.target.value})} 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Nom</Label>
                      <Input 
                        value={teacherForm.lastName} 
                        onChange={(e) => setTeacherForm({...teacherForm, lastName: e.target.value})} 
                        required 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Email *</Label>
                    <Input 
                      type="email" 
                      value={teacherForm.email} 
                      onChange={(e) => setTeacherForm({...teacherForm, email: e.target.value})} 
                      required 
                      className={!teacherForm.email.trim() ? "border-red-300" : 
                               /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(teacherForm.email) ? "border-green-300" : "border-yellow-300"}
                    />
                    {!teacherForm.email.trim() && (
                      <p className="text-xs text-red-500">L'email est requis</p>
                    )}
                    {teacherForm.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(teacherForm.email) && (
                      <p className="text-xs text-yellow-600">Format d'email invalide</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Téléphone</Label>
                    <Input 
                      value={teacherForm.phone} 
                      onChange={(e) => setTeacherForm({...teacherForm, phone: e.target.value})} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Spécialité</Label>
                    <Input 
                      value={teacherForm.specialization} 
                      onChange={(e) => setTeacherForm({...teacherForm, specialization: e.target.value})} 
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label className="text-base font-medium">Matières que l'enseignant peut enseigner</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto p-3 border rounded-lg bg-muted/5">
                      {availableSubjects.map(subject => (
                        <div key={subject.id} className="flex items-center space-x-2 p-2 hover:bg-background rounded">
                          <Checkbox
                            id={`subject-${subject.id}`}
                            checked={qualifiedSubjects.includes(subject.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setQualifiedSubjects(prev => [...prev, subject.id]);
                              } else {
                                setQualifiedSubjects(prev => prev.filter(id => id !== subject.id));
                              }
                            }}
                          />
                          <Label 
                            htmlFor={`subject-${subject.id}`} 
                            className="flex-1 cursor-pointer text-sm"
                          >
                            <div className="font-medium">{subject.name}</div>
                            <div className="text-xs text-muted-foreground">
                              Coefficient: {subject.coefficient}
                            </div>
                          </Label>
                        </div>
                      ))}
                    </div>
                    {qualifiedSubjects.length === 0 && (
                      <p className="text-sm text-muted-foreground italic">
                        Sélectionnez au moins une matière (facultatif)
                      </p>
                    )}
                  </div>
                  {/* Preview Section */}
                  {(teacherForm.firstName || teacherForm.lastName || teacherForm.email) && (
                    <div className="p-3 bg-muted/30 rounded-lg border">
                      <h4 className="font-medium text-sm mb-2">Aperçu :</h4>
                      <div className="text-sm space-y-1">
                        <div><span className="font-medium">Nom complet:</span> {teacherForm.firstName} {teacherForm.lastName}</div>
                        <div><span className="font-medium">Email:</span> {teacherForm.email || "Non renseigné"}</div>
                        <div><span className="font-medium">Téléphone:</span> {teacherForm.phone || "Non renseigné"}</div>
                        {qualifiedSubjects.length > 0 && (
                          <div>
                            <span className="font-medium">Matières qualifiées:</span> 
                            <span className="ml-1">
                              {qualifiedSubjects.map(id => {
                                const subject = availableSubjects.find(s => s.id === id);
                                return subject ? subject.name : id;
                              }).join(", ")}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-3 pt-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setTeacherDialogOpen(false);
                        setTeacherForm({ firstName: "", lastName: "", email: "", phone: "", specialization: "" });
                        setQualifiedSubjects([]);
                      }}
                      disabled={savingTeacher}
                      className="flex-1"
                    >
                      Annuler
                    </Button>
                    <Button 
                      type="button" 
                      variant="secondary" 
                      onClick={() => {
                        // Reset only the form but keep dialog open
                        setTeacherForm({ firstName: "", lastName: "", email: "", phone: "", specialization: "" });
                        setQualifiedSubjects([]);
                      }}
                      disabled={savingTeacher}
                      className="flex-1"
                    >
                      Réinitialiser
                    </Button>
                    <Button 
                      type="submit" 
                      className="flex-1" 
                      disabled={savingTeacher || !isTeacherFormValid}
                    >
                      {savingTeacher ? "Création..." : "Créer le compte"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Téléphone</TableHead>
                    <TableHead>Matières</TableHead>
                    <TableHead>Classes</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTeachers.map(teacher => (
                    <TableRow key={teacher.id}>
                      <TableCell className="font-medium">
                        {teacher.firstName} {teacher.lastName}
                      </TableCell>
                      <TableCell className="text-sm">
                        {teacher.phone}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {teacher.subjects.map(sid => (
                            <Badge key={sid} variant="secondary" className="text-xs">
                              {getSubjectById(sid)?.name || sid}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {teacher.classes.map(cid => (
                            <Badge key={cid} variant="outline" className="text-xs">
                              {getClassById(cid)?.name || cid}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleEditTeacher(teacher)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleToggleTeacherStatus(teacher)}
                            className={`h-8 w-8 p-0 ${teacher.isActive ? 'bg-green-100 text-green-700 border-green-300 hover:bg-green-200' : 'bg-red-100 text-red-700 border-red-300 hover:bg-red-200'}`}
                          >
                            {teacher.isActive ? 
                              <Power className="w-4 h-4" /> : 
                              <PowerOff className="w-4 h-4" />
                            }
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Classes Tab */}
        <TabsContent value="classes" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Liste des Classes ({filteredClasses.length})</h3>
            <Dialog open={classDialogOpen} onOpenChange={setClassDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Créer une classe
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Nouvelle classe</DialogTitle>
                </DialogHeader>
                <form className="space-y-4" onSubmit={handleCreateClass}>
                  <div className="space-y-2">
                    <Label>Nom de la classe *</Label>
                    <Input 
                      value={classForm.name}
                      onChange={(e) => setClassForm({...classForm, name: e.target.value})}
                      placeholder="Ex: Terminale A" 
                      required 
                      className={!classForm.name.trim() ? "border-red-300" : "border-green-300"}
                    />
                    {!classForm.name.trim() && (
                      <p className="text-xs text-red-500">Le nom de la classe est requis</p>
                    )}
                  </div>
                  
                  {/* Preview for class */}
                  {classForm.name && (
                    <div className="p-3 bg-muted/30 rounded-lg border text-sm">
                      <div><span className="font-medium">Nom:</span> {classForm.name}</div>
                      <div><span className="font-medium">Capacité:</span> {classForm.capacity} élèves</div>
                      <div><span className="font-medium">Frais:</span> {classForm.fees.toLocaleString()} FCFA</div>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Capacité</Label>
                      <Input 
                        type="number" 
                        min="1" 
                        value={classForm.capacity}
                        onChange={(e) => setClassForm({...classForm, capacity: Number(e.target.value)})}
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Frais (FCFA)</Label>
                      <Input 
                        type="number" 
                        min="0" 
                        value={classForm.fees}
                        onChange={(e) => setClassForm({...classForm, fees: Number(e.target.value)})}
                        required 
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setClassDialogOpen(false);
                        setClassForm({ name: "", capacity: 40, fees: 0 });
                      }}
                      disabled={savingClass}
                      className="flex-1"
                    >
                      Annuler
                    </Button>
                    <Button 
                      type="button" 
                      variant="secondary" 
                      onClick={() => setClassForm({ name: "", capacity: 40, fees: 0 })}
                      disabled={savingClass}
                      className="flex-1"
                    >
                      Réinitialiser
                    </Button>
                    <Button 
                      type="submit" 
                      className="flex-1" 
                      disabled={savingClass || !classForm.name.trim()}
                    >
                      {savingClass ? "Création..." : "Créer"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Classe</TableHead>
                    <TableHead>Effectif</TableHead>
                    <TableHead>Capacité</TableHead>
                    <TableHead>Taux remplissage</TableHead>
                    <TableHead>Frais (FCFA)</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClasses.map(c => {
                    const rate = Math.round((c.studentsCount / c.capacity) * 100);
                    return (
                      <TableRow key={c.id}>
                        <TableCell className="font-medium">{c.name}</TableCell>
                        <TableCell>{c.studentsCount}</TableCell>
                        <TableCell>{c.capacity}</TableCell>
                        <TableCell>
                          <Badge variant={rate > 90 ? "destructive" : rate > 70 ? "secondary" : "default"}>
                            {rate}%
                          </Badge>
                        </TableCell>
                        <TableCell>{c.fees.toLocaleString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleEditClass(c)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleToggleClassStatus(c)}
                              className={`h-8 w-8 p-0 ${c.isActive ? 'bg-green-100 text-green-700 border-green-300 hover:bg-green-200' : 'bg-red-100 text-red-700 border-red-300 hover:bg-red-200'}`}
                            >
                              {c.isActive ? 
                                <Power className="w-4 h-4" /> : 
                                <PowerOff className="w-4 h-4" />
                              }
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Subjects Tab */}
        <TabsContent value="subjects" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Liste des Matières ({filteredSubjects.length})</h3>
            <Dialog open={subjectDialogOpen} onOpenChange={setSubjectDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter une matière
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Nouvelle matière</DialogTitle>
                </DialogHeader>
                <form className="space-y-4" onSubmit={handleCreateSubject}>
                  <div className="space-y-2">
                    <Label>Nom de la matière *</Label>
                    <Input 
                      value={subjectForm.name}
                      onChange={(e) => setSubjectForm({...subjectForm, name: e.target.value})}
                      placeholder="Ex: Mathématiques" 
                      required 
                      className={!subjectForm.name.trim() ? "border-red-300" : "border-green-300"}
                    />
                    {!subjectForm.name.trim() && (
                      <p className="text-xs text-red-500">Le nom de la matière est requis</p>
                    )}
                  </div>
                  
                  {/* Preview for subject */}
                  {subjectForm.name && (
                    <div className="p-3 bg-muted/30 rounded-lg border text-sm">
                      <div><span className="font-medium">Matière:</span> {subjectForm.name}</div>
                      <div><span className="font-medium">Coefficient:</span> {subjectForm.coefficient}</div>
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label>Coefficient</Label>
                    <Input 
                      type="number" 
                      min="1" 
                      max="10" 
                      step="0.5" 
                      value={subjectForm.coefficient}
                      onChange={(e) => setSubjectForm({...subjectForm, coefficient: Number(e.target.value)})}
                      required 
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setSubjectDialogOpen(false);
                        setSubjectForm({ name: "", coefficient: 1 });
                      }}
                      disabled={savingSubject}
                      className="flex-1"
                    >
                      Annuler
                    </Button>
                    <Button 
                      type="button" 
                      variant="secondary" 
                      onClick={() => setSubjectForm({ name: "", coefficient: 1 })}
                      disabled={savingSubject}
                      className="flex-1"
                    >
                      Réinitialiser
                    </Button>
                    <Button 
                      type="submit" 
                      className="flex-1" 
                      disabled={savingSubject || !subjectForm.name.trim()}
                    >
                      {savingSubject ? "Création..." : "Créer"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Matière</TableHead>
                    <TableHead>Coefficient</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubjects.map(s => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">{s.name}</TableCell>
                      <TableCell>{s.coefficient}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleEditSubject(s)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleToggleSubjectStatus(s)}
                            className={`h-8 w-8 p-0 ${s.isActive ? 'bg-green-100 text-green-700 border-green-300 hover:bg-green-200' : 'bg-red-100 text-red-700 border-red-300 hover:bg-red-200'}`}
                          >
                            {s.isActive ? 
                              <Power className="w-4 h-4" /> : 
                              <PowerOff className="w-4 h-4" />
                            }
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default SchoolManagementPage;