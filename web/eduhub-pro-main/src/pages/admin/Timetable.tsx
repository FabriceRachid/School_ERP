import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/shared/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { getClassesBySchool, getTimeSlotsByClass, getSubjectById, getTeacherById, getSubjectsBySchool, getTeachersBySchool } from "@/data/mock-data";
import { useEffect, useState, Fragment } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Calendar, Clock, User, Loader2, Plus, Edit, Trash2, GripVertical } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { createTimetableSlot, deleteTimetableSlot, refreshWebBootstrap, updateTimetableSlot } from "@/lib/api";
import { teacherQualificationService } from "@/services/teacherQualificationService";
import { timetableService } from "@/services/timetableService";

const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"] as const;
const timeSlots = [
  { id: "slot1", start: "07:30", end: "09:00" },
  { id: "slot2", start: "09:00", end: "10:30" },
  { id: "slot3", start: "10:30", end: "12:00", isBreak: true },
  { id: "slot4", start: "12:00", end: "13:30", isBreak: true },
  { id: "slot5", start: "13:30", end: "15:00" },
  { id: "slot6", start: "15:00", end: "16:30" },
];

const TimetablePage = () => {
  const { user } = useAuth();
  const schoolId = user?.schoolId || "s1";
  const [classes, setClasses] = useState(() => getClassesBySchool(schoolId));
  const [subjects, setSubjects] = useState(() => getSubjectsBySchool(schoolId));
  const [teachers, setTeachers] = useState(() => getTeachersBySchool(schoolId));
  const [classAssignments, setClassAssignments] = useState<{subject_id: string, teachers: any[]}[]>([]);
  const [selectedClass, setSelectedClass] = useState(classes[0]?.id || "");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [day, setDay] = useState<typeof days[number] | "">("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [teacherId, setTeacherId] = useState("");

  const slots = getTimeSlotsByClass(selectedClass);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await refreshWebBootstrap();
        if (!mounted) return;
        const refreshedClasses = getClassesBySchool(schoolId);
        const refreshedSubjects = getSubjectsBySchool(schoolId);
        const refreshedTeachers = getTeachersBySchool(schoolId);
        
        // Load teacher qualifications with error handling
        const teachersWithQualifications = await Promise.all(
          refreshedTeachers.map(async (teacher) => {
            try {
              const qualifiedSubjects = await teacherQualificationService.getQualifiedSubjects(teacher.id);
              return {
                ...teacher,
                subjects: qualifiedSubjects.map(s => s.id)
              };
            } catch (error) {
              console.warn(`Failed to load qualifications for teacher ${teacher.id}:`, error);
              return {
                ...teacher,
                subjects: [] // Fallback to empty array
              };
            }
          })
        );
        
        // Load current class assignments to show assigned teachers
        try {
          const loadedClassAssignments = await timetableService.getClassSubjectTeachers(selectedClass);
          setClassAssignments(loadedClassAssignments);
        } catch (error) {
          console.warn('Failed to load class assignments:', error);
          setClassAssignments([]);
        }
        
        setClasses(refreshedClasses);
        setSubjects(refreshedSubjects);
        setTeachers(teachersWithQualifications);
        if (!selectedClass && refreshedClasses[0]?.id) {
          setSelectedClass(refreshedClasses[0].id);
        }
      } catch (error) {
        console.error('Error loading timetable data:', error);
        // keep current local snapshot if refresh fails
      }
    })();
    return () => {
      mounted = false;
    };
  }, [schoolId, selectedClass]);

  const handleCreateClick = () => {
    setEditingSlot(null);
    setDay("");
    setStartTime("");
    setEndTime("");
    setSubjectId("");
    setTeacherId("");
    setDialogOpen(true);
  };

  const handleEditClick = (slot: any) => {
    setEditingSlot(slot);
    setDay(slot.day);
    setStartTime(slot.startTime);
    setEndTime(slot.endTime);
    setSubjectId(slot.subjectId);
    setTeacherId(slot.teacherId);
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (editingSlot?.id) {
        await updateTimetableSlot(editingSlot.id, {
          class_id: selectedClass,
          subject_id: subjectId,
          teacher_id: teacherId,
          day: day as "Lundi" | "Mardi" | "Mercredi" | "Jeudi" | "Vendredi",
          start_time: startTime,
          end_time: endTime
        });
      } else {
        await createTimetableSlot({
          class_id: selectedClass,
          subject_id: subjectId,
          teacher_id: teacherId,
          day: day as "Lundi" | "Mardi" | "Mercredi" | "Jeudi" | "Vendredi",
          start_time: startTime,
          end_time: endTime
        });
      }
      await refreshWebBootstrap();
      const refreshedClasses = getClassesBySchool(schoolId);
      const refreshedSubjects = getSubjectsBySchool(schoolId);
      const refreshedTeachers = getTeachersBySchool(schoolId);
      
      // Reload teacher qualifications
      const teachersWithQualifications = await Promise.all(
        refreshedTeachers.map(async (teacher) => {
          const qualifiedSubjects = await teacherQualificationService.getQualifiedSubjects(teacher.id);
          return {
            ...teacher,
            subjects: qualifiedSubjects.map(s => s.id)
          };
        })
      );
      
      const loadedClassAssignments = await timetableService.getClassSubjectTeachers(selectedClass);
      setClassAssignments(loadedClassAssignments);
      
      setClasses(refreshedClasses);
      setSubjects(refreshedSubjects);
      setTeachers(teachersWithQualifications);
      const action = editingSlot ? "modifié" : "créé";
      toast({
        title: `Cours ${action}`,
        description: `Le cours a été ${action} avec succès`,
        className: "bg-emerald-600 text-white border-emerald-700"
      });
      setDialogOpen(false);
      setEditingSlot(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Opération impossible";
      toast({ title: "Erreur", description: message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSlot = async (id: string) => {
    try {
      await deleteTimetableSlot(id);
      await refreshWebBootstrap();
      setClasses(getClassesBySchool(schoolId));
      setSubjects(getSubjectsBySchool(schoolId));
      setTeachers(getTeachersBySchool(schoolId));
      toast({
        title: "Cours supprimé",
        description: "Le cours a été supprimé",
        className: "bg-emerald-600 text-white border-emerald-700"
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Suppression impossible";
      toast({ title: "Erreur", description: message, variant: "destructive" });
    }
  };

  return (
    <DashboardLayout>
      <PageHeader 
        title="Emploi du Temps" 
        description="Planification visuelle par glisser-déposer"
      >
        <div className="flex gap-3">
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-56">
              <BookOpen className="w-4 h-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Choisir une classe" />
            </SelectTrigger>
            <SelectContent>
              {classes.map(c => (
                <SelectItem key={c.id} value={c.id}>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    {c.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleCreateClick} className="gap-2">
            <Plus className="w-4 h-4" />
            Ajouter manuellement
          </Button>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        {/* Subjects Palette */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <GripVertical className="w-4 h-4" />
              Matières à assigner
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {subjects.map(subject => {
              const subjectTeachers = teachers.filter(t => t.subjects.includes(subject.id));
              return (
                <div 
                  key={subject.id} 
                  className="p-3 rounded-lg border bg-background hover:bg-muted/50 cursor-move transition-colors"
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('subjectId', subject.id);
                    e.dataTransfer.setData('subjectName', subject.name);
                    e.dataTransfer.setData('coefficient', subject.coefficient.toString());
                  }}
                >
                  <div className="font-medium text-sm">{subject.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">Coef. {subject.coefficient}</div>
                  
                  {/* Qualified teachers count */}
                  <div className="text-xs text-muted-foreground mt-1">
                    {subjectTeachers.length} professeur{subjectTeachers.length > 1 ? 's' : ''} qualifié{subjectTeachers.length > 1 ? 's' : ''}
                  </div>
                  
                  {/* List qualified teachers */}
                  {subjectTeachers.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {subjectTeachers.slice(0, 2).map(teacher => (
                        <div key={teacher.id} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                          👤 {teacher.firstName} {teacher.lastName}
                        </div>
                      ))}
                      {subjectTeachers.length > 2 && (
                        <div className="text-xs text-muted-foreground italic">
                          +{subjectTeachers.length - 2} autre{subjectTeachers.length - 2 > 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Show currently assigned teachers for this class */}
                  {classAssignments && classAssignments.find(s => s.subject_id === subject.id)?.teachers.map(teacher => (
                    <div key={teacher.id} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded mt-1 flex items-center">
                      <span className="mr-1">✓</span> {teacher.name}
                    </div>
                  ))}
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Timetable Grid */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Grille horaire - {classes.find(c => c.id === selectedClass)?.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="min-w-[800px]">

                <div className="grid grid-cols-7 gap-1">
                  {/* Header Row */}
                  <div className="p-3"></div>
                  {days.map(day => (
                    <div key={day} className="p-3 text-center font-semibold bg-primary/5 rounded-t-lg">
                      {day}
                    </div>
                  ))}
                  
                  {/* Time Slots */}
                  {timeSlots.map((timeSlot, slotIndex) => (
                    <Fragment key={timeSlot.id}>
                      {/* Time Label */}
                      <div className={`p-3 text-right text-sm ${timeSlot.isBreak ? 'bg-yellow-50 text-yellow-800' : 'bg-muted/30'}`}>
                        {timeSlot.start}<br />
                        <span className="text-xs text-muted-foreground">{timeSlot.end}</span>
                      </div>
                      
                      {/* Day Cells */}
                      {days.map(day => {
                        const existingSlot = slots.find(s => 
                          s.day === day && 
                          s.startTime === timeSlot.start && 
                          s.endTime === timeSlot.end
                        );
                        
                        if (timeSlot.isBreak) {
                          return (
                            <div 
                              key={`${day}-${timeSlot.id}`} 
                              className="p-2 bg-yellow-50 rounded text-center text-xs text-yellow-800 font-medium"
                            >
                              {timeSlot.start === "10:30" ? ".pause Café" : ".pause Déjeuner"}
                            </div>
                          );
                        }
                        
                        return (
                          <div 
                            key={`${day}-${timeSlot.id}`}
                            className={`min-h-[80px] p-2 rounded border-2 border-dashed transition-all ${
                              existingSlot 
                                ? 'border-primary/30 bg-primary/5 hover:border-primary/50' 
                                : 'border-muted-foreground/20 hover:border-primary/30 hover:bg-primary/5'
                            }`}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                              e.preventDefault();
                              if (existingSlot) return;
                              
                              const subjectId = e.dataTransfer.getData('subjectId');
                              const subjectName = e.dataTransfer.getData('subjectName');
                              
                              // Show teacher selection dialog
                              setDay(day as typeof days[number]);
                              setStartTime(timeSlot.start);
                              setEndTime(timeSlot.end);
                              setSubjectId(subjectId);
                              setDialogOpen(true);
                            }}
                          >
                            {existingSlot ? (
                              <div className="h-full flex flex-col justify-between">
                                <div>
                                  <div className="font-medium text-sm flex items-center gap-1">
                                    <BookOpen className="w-3 h-3" />
                                    {getSubjectById(existingSlot.subjectId)?.name || "-"}
                                  </div>
                                  <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                    <User className="w-3 h-3" />
                                    {getTeacherById(existingSlot.teacherId)?.firstName || "-"}
                                  </div>
                                </div>
                                <div className="flex justify-end gap-1 mt-2">
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-6 w-6 p-1"
                                    onClick={() => handleEditClick(existingSlot)}
                                  >
                                    <Edit className="w-3 h-3" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-6 w-6 p-1 text-destructive"
                                    onClick={() => handleDeleteSlot(existingSlot.id)}
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div className="h-full flex items-center justify-center text-muted-foreground text-xs">
                                Glisser une matière ici
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </Fragment>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Timetable Entry Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              {editingSlot ? "Modifier le cours" : "Assigner une matière"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Jour</Label>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <span className="font-medium">{day}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium">Horaire</Label>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <span className="font-medium">{startTime} - {endTime}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subject" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Matière
              </Label>
              {editingSlot ? (
                <div className="p-3 bg-muted/50 rounded-lg">
                  <span className="font-medium">{getSubjectById(subjectId)?.name || "-"}</span>
                </div>
              ) : (
                <Select 
                  value={subjectId} 
                  onValueChange={(value) => setSubjectId(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir une matière" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map(sub => (
                      <SelectItem key={sub.id} value={sub.id}>
                        <div className="flex justify-between w-full">
                          <span>{sub.name}</span>
                          <span className="text-muted-foreground text-xs">coef. {sub.coefficient}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="teacher" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Enseignant
              </Label>
              <Select 
                value={teacherId} 
                onValueChange={(value) => setTeacherId(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un enseignant" />
                </SelectTrigger>
                <SelectContent>
                  {subjectId 
                    ? teachers
                        .filter(t => t.subjects.includes(subjectId))
                        .map(teacher => {
                          // Check if this teacher is already assigned to this time slot
                          const isAlreadyAssigned = slots.some(slot => 
                            slot.teacherId === teacher.id && 
                            slot.day === day &&
                            slot.startTime === startTime &&
                            slot.endTime === endTime
                          );
                          
                          return (
                            <SelectItem 
                              key={teacher.id} 
                              value={teacher.id}
                              disabled={isAlreadyAssigned}
                            >
                              <div className="flex justify-between w-full items-center">
                                <span>{teacher.firstName} {teacher.lastName}</span>
                                {isAlreadyAssigned && (
                                  <span className="text-xs text-muted-foreground ml-2">
                                    (déjà assigné à ce créneau)
                                  </span>
                                )}
                              </div>
                            </SelectItem>
                          );
                        })
                    : teachers.map(teacher => (
                        <SelectItem key={teacher.id} value={teacher.id}>
                          {teacher.firstName} {teacher.lastName}
                        </SelectItem>
                      ))
                  }
                </SelectContent>
              </Select>
              
              {subjectId && teachers.filter(t => t.subjects.includes(subjectId)).length === 0 && (
                <p className="text-sm text-yellow-600 bg-yellow-50 p-2 rounded">
                  ⚠️ Aucun enseignant qualifié pour cette matière. Veuillez d'abord qualifier des enseignants.
                </p>
              )}
              {subjectId && (
                <p className="text-xs text-muted-foreground">
                  Seuls les enseignants qualifiés pour cette matière sont affichés
                </p>
              )}
            </div>
            
            <div className="flex justify-end gap-3 pt-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setDialogOpen(false);
                  setEditingSlot(null);
                  setSubjectId("");
                  setTeacherId("");
                }}
                disabled={saving}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={saving || !teacherId} className="gap-2">
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  <>{editingSlot ? "Modifier" : "Assigner"}</>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default TimetablePage;
