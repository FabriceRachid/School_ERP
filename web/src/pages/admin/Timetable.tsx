import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/shared/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { getClassesBySchool, getTimeSlotsByClass, getSubjectById, getTeacherById, subjects, teachers, timeSlots as mockTimeSlots } from "@/data/mock-data";
import { Plus, Edit, Trash2, Clock } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { TimeSlot } from "@/data/mock-data";

const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"] as const;

const TimetablePage = () => {
  const { user } = useAuth();
  const classes = getClassesBySchool(user?.schoolId || "s1");
  const [selectedClass, setSelectedClass] = useState(classes[0]?.id || "");
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<TimeSlot | null>(null);
  const [formData, setFormData] = useState({
    day: "Lundi",
    startTime: "",
    endTime: "",
    subjectId: "",
    teacherId: "",
  });

  const schoolSubjects = subjects.filter(s => s.schoolId === user?.schoolId);
  const schoolTeachers = teachers.filter(t => t.schoolId === user?.schoolId);

  useEffect(() => {
    const classSlots = getTimeSlotsByClass(selectedClass);
    setSlots(classSlots);
  }, [selectedClass]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDayChange = (value: string) => {
    setFormData({ ...formData, day: value });
  };

  const handleSubjectChange = (value: string) => {
    setFormData({ ...formData, subjectId: value });
  };

  const handleTeacherChange = (value: string) => {
    setFormData({ ...formData, teacherId: value });
  };

  const handleAddSlot = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.day || !formData.startTime || !formData.endTime || !formData.subjectId || !formData.teacherId) {
      toast({ title: "Erreur", description: "Veuillez remplir tous les champs", variant: "destructive" });
      return;
    }

    const newSlot: TimeSlot = {
      id: `ts${Date.now()}`,
      classId: selectedClass,
      subjectId: formData.subjectId,
      teacherId: formData.teacherId,
      day: formData.day as any,
      startTime: formData.startTime,
      endTime: formData.endTime,
    };

    if (editingSlot) {
      // Update existing slot
      const updatedSlots = slots.map(s => s.id === editingSlot.id ? newSlot : s);
      setSlots(updatedSlots);
      toast({ title: "Succès", description: "Créneau horaire modifié avec succès" });
    } else {
      // Add new slot
      setSlots([...slots, newSlot]);
      toast({ title: "Succès", description: "Créneau horaire ajouté avec succès" });
    }

    resetForm();
  };

  const handleEditSlot = (slot: TimeSlot) => {
    setEditingSlot(slot);
    setFormData({
      day: slot.day,
      startTime: slot.startTime,
      endTime: slot.endTime,
      subjectId: slot.subjectId,
      teacherId: slot.teacherId,
    });
    setDialogOpen(true);
  };

  const handleDeleteSlot = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce créneau horaire ?")) {
      const updatedSlots = slots.filter(s => s.id !== id);
      setSlots(updatedSlots);
      toast({ title: "Succès", description: "Créneau horaire supprimé avec succès" });
    }
  };

  const resetForm = () => {
    setFormData({
      day: "Lundi",
      startTime: "",
      endTime: "",
      subjectId: "",
      teacherId: "",
    });
    setEditingSlot(null);
    setDialogOpen(false);
  };

  return (
    <DashboardLayout>
      <PageHeader title="Emploi du Temps" description="Visualisation par classe">
        <div className="flex gap-2">
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-48"><SelectValue placeholder="Choisir une classe" /></SelectTrigger>
            <SelectContent>
              {classes.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="w-4 h-4 mr-2" />Ajouter un créneau</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingSlot ? "Modifier le créneau" : "Ajouter un créneau horaire"}</DialogTitle>
              </DialogHeader>
              <form className="space-y-4" onSubmit={handleAddSlot}>
                <div className="space-y-2">
                  <Label>Jour *</Label>
                  <Select value={formData.day} onValueChange={handleDayChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {days.map(day => (
                        <SelectItem key={day} value={day}>{day}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Heure de début *</Label>
                    <Input 
                      type="time"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Heure de fin *</Label>
                    <Input 
                      type="time"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Matière *</Label>
                  <Select value={formData.subjectId} onValueChange={handleSubjectChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une matière" />
                    </SelectTrigger>
                    <SelectContent>
                      {schoolSubjects.map(subject => (
                        <SelectItem key={subject.id} value={subject.id}>{subject.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Enseignant *</Label>
                  <Select value={formData.teacherId} onValueChange={handleTeacherChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un enseignant" />
                    </SelectTrigger>
                    <SelectContent>
                      {schoolTeachers.map(teacher => (
                        <SelectItem key={teacher.id} value={teacher.id}>
                          {teacher.firstName} {teacher.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    {editingSlot ? "Modifier" : "Ajouter"}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Annuler
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </PageHeader>

      <Card className="animate-fade-in">
        <CardContent className="pt-6">
          <div className="grid grid-cols-5 gap-2">
            {days.map(day => (
              <div key={day}>
                <div className="text-center font-display font-semibold text-sm text-foreground mb-3 p-2 bg-primary/5 rounded-lg">{day}</div>
                <div className="space-y-2">
                  {slots.filter(s => s.day === day).sort((a, b) => a.startTime.localeCompare(b.startTime)).map(slot => {
                    const subject = getSubjectById(slot.subjectId);
                    const teacher = getTeacherById(slot.teacherId);
                    return (
                      <div key={slot.id} className="p-3 rounded-lg bg-primary/5 border border-primary/10 text-xs space-y-1 relative group">
                        <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0"
                            onClick={() => handleEditSlot(slot)}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteSlot(slot.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                        <p className="font-semibold text-foreground">{subject?.name || "-"}</p>
                        <p className="text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {slot.startTime} - {slot.endTime}
                        </p>
                        {teacher && <p className="text-muted-foreground">{teacher.firstName} {teacher.lastName[0]}.</p>}
                      </div>
                    );
                  })}
                  {slots.filter(s => s.day === day).length === 0 && (
                    <div className="p-3 rounded-lg bg-muted/30 text-xs text-muted-foreground text-center">-</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default TimetablePage;
