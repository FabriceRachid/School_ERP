import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { User, Mail, Phone, Calendar, DollarSign, BookOpen, Plus, Edit, Trash2 } from "lucide-react";
import { teacherManagementService } from "@/services/teacherManagementService";

interface Subject {
  id: string;
  name: string;
  code: string;
  coefficient: number;
}

interface TeacherFormData {
  user_id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialization?: string;
  hire_date?: string;
  salary?: number;
  qualified_subjects: string[];
}

const TeacherManagement = () => {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState<TeacherFormData>({
    user_id: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    specialization: "",
    hire_date: "",
    salary: undefined,
    qualified_subjects: []
  });

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load subjects for qualification selection
        const loadedSubjects = await teacherManagementService.getAllSubjects();
        setSubjects(loadedSubjects);
        
        // Load existing teachers (you'll need to implement this API endpoint)
        // For now, using mock data
        const mockTeachers = [
          {
            id: "t1",
            firstName: "Ibrahim",
            lastName: "Traoré",
            email: "ibrahim.traore@school.com",
            phone: "+225 07 11 22 33",
            subjects: ["sub1", "sub3"],
            specialization: "Mathématiques"
          },
          {
            id: "t2", 
            firstName: "Aminata",
            lastName: "Diallo",
            email: "aminata.diallo@school.com",
            phone: "+225 07 44 55 66",
            subjects: ["sub2", "sub7"],
            specialization: "Lettres"
          }
        ];
        setTeachers(mockTeachers);
      } catch (error) {
        console.error("Error loading data:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les données",
          variant: "destructive"
        });
      }
    };
    
    loadData();
  }, []);

  const handleCreateClick = () => {
    setEditingTeacher(null);
    setFormData({
      user_id: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      specialization: "",
      hire_date: "",
      salary: undefined,
      qualified_subjects: []
    });
    setDialogOpen(true);
  };

  const handleEditClick = (teacher: any) => {
    setEditingTeacher(teacher);
    setFormData({
      user_id: teacher.id,
      firstName: teacher.firstName,
      lastName: teacher.lastName,
      email: teacher.email,
      phone: teacher.phone,
      specialization: teacher.specialization || "",
      hire_date: teacher.hire_date || "",
      salary: teacher.salary || undefined,
      qualified_subjects: teacher.subjects || []
    });
    setDialogOpen(true);
  };

  const handleSubjectToggle = (subjectId: string) => {
    setFormData(prev => ({
      ...prev,
      qualified_subjects: prev.qualified_subjects.includes(subjectId)
        ? prev.qualified_subjects.filter(id => id !== subjectId)
        : [...prev.qualified_subjects, subjectId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      
      if (editingTeacher) {
        // Update existing teacher qualifications
        const success = await teacherManagementService.updateTeacherQualifications(
          formData.user_id,
          formData.qualified_subjects
        );
        
        if (success) {
          toast({
            title: "Enseignant mis à jour",
            description: "Les qualifications ont été mises à jour avec succès",
            className: "bg-emerald-600 text-white border-emerald-700"
          });
          
          // Update local state
          setTeachers(prev => prev.map(t => 
            t.id === editingTeacher.id 
              ? { ...t, subjects: formData.qualified_subjects }
              : t
          ));
        }
      } else {
        // Create new teacher
        const teacherData = {
          user_id: formData.user_id,
          specialization: formData.specialization,
          hire_date: formData.hire_date,
          salary: formData.salary,
          qualified_subjects: formData.qualified_subjects
        };
        
        const newTeacher = await teacherManagementService.createTeacherWithQualifications(teacherData);
        
        if (newTeacher) {
          toast({
            title: "Enseignant créé",
            description: "L'enseignant a été créé avec succès",
            className: "bg-emerald-600 text-white border-emerald-700"
          });
          
          // Add to local state
          setTeachers(prev => [...prev, {
            ...newTeacher,
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone
          }]);
        }
      }
      
      setDialogOpen(false);
    } catch (error) {
      console.error("Error saving teacher:", error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder l'enseignant",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const getQualifiedSubjectNames = (subjectIds: string[]) => {
    return subjectIds
      .map(id => subjects.find(s => s.id === id)?.name)
      .filter(Boolean)
      .join(", ") || "Aucune matière assignée";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestion des Enseignants</h1>
        <Button onClick={handleCreateClick} className="gap-2">
          <Plus className="w-4 h-4" />
          Nouvel Enseignant
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teachers.map(teacher => (
          <Card key={teacher.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  {teacher.firstName} {teacher.lastName}
                </span>
                <div className="flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleEditClick(teacher)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span>{teacher.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span>{teacher.phone}</span>
              </div>
              {teacher.specialization && (
                <div className="flex items-center gap-2 text-sm">
                  <BookOpen className="w-4 h-4 text-muted-foreground" />
                  <span>Spécialité: {teacher.specialization}</span>
                </div>
              )}
              <div className="pt-2 border-t">
                <p className="text-sm font-medium mb-2">Matières qualifiées:</p>
                <p className="text-sm text-muted-foreground">
                  {getQualifiedSubjectNames(teacher.subjects)}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Teacher Creation/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              {editingTeacher ? "Modifier l'Enseignant" : "Nouvel Enseignant"}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName">Nom</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="specialization">Spécialité</Label>
                <Input
                  id="specialization"
                  value={formData.specialization}
                  onChange={(e) => setFormData(prev => ({ ...prev, specialization: e.target.value }))}
                  placeholder="Ex: Mathématiques, Lettres..."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="hire_date">Date d'embauche</Label>
                <Input
                  id="hire_date"
                  type="date"
                  value={formData.hire_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, hire_date: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="salary">Salaire (FCFA)</Label>
                <Input
                  id="salary"
                  type="number"
                  value={formData.salary || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, salary: Number(e.target.value) || undefined }))}
                  placeholder="Ex: 250000"
                />
              </div>
            </div>
            
            <div className="space-y-3">
              <Label className="text-lg font-medium">Matières que l'enseignant peut enseigner</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto p-2 border rounded">
                {subjects.map(subject => (
                  <div key={subject.id} className="flex items-center space-x-2 p-2 hover:bg-muted rounded">
                    <Checkbox
                      id={`subject-${subject.id}`}
                      checked={formData.qualified_subjects.includes(subject.id)}
                      onCheckedChange={() => handleSubjectToggle(subject.id)}
                    />
                    <Label 
                      htmlFor={`subject-${subject.id}`} 
                      className="flex-1 cursor-pointer text-sm"
                    >
                      <div className="font-medium">{subject.name}</div>
                      <div className="text-xs text-muted-foreground">
                        Coef. {subject.coefficient} • {subject.code}
                      </div>
                    </Label>
                  </div>
                ))}
              </div>
              {formData.qualified_subjects.length === 0 && (
                <p className="text-sm text-muted-foreground italic">
                  Sélectionnez au moins une matière que cet enseignant peut enseigner
                </p>
              )}
            </div>
            
            <div className="flex justify-end gap-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setDialogOpen(false)}
                disabled={saving}
              >
                Annuler
              </Button>
              <Button 
                type="submit" 
                disabled={saving || formData.qualified_subjects.length === 0}
                className="gap-2"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {editingTeacher ? "Mise à jour..." : "Création..."}
                  </>
                ) : (
                  <>{editingTeacher ? "Mettre à jour" : "Créer l'enseignant"}</>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeacherManagement;