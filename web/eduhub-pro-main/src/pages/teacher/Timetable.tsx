import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/shared/StatCard";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { teachers, getClassById, getTimeSlotsByClass, getSubjectById, getSchoolById } from "@/data/mock-data";

const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"] as const;

const TeacherTimetablePage = () => {
  const { user } = useAuth();
  const teacher = teachers.find(t => t.userId === user?.id);

  if (!teacher) return <DashboardLayout><p>Enseignant non trouvé</p></DashboardLayout>;

  // Collect all slots from teacher's classes, filtered to this teacher
  const allSlots = teacher.classes.flatMap(cid => getTimeSlotsByClass(cid).filter(ts => ts.teacherId === teacher.id));

  return (
    <DashboardLayout>
      <PageHeader title="Mon Emploi du Temps" description="Votre planning hebdomadaire" />

      <Card className="animate-fade-in">
        <CardContent className="pt-6">
          <div className="grid grid-cols-5 gap-2">
            {days.map(day => (
              <div key={day}>
                <div className="text-center font-display font-semibold text-sm text-foreground mb-3 p-2 bg-primary/5 rounded-lg">{day}</div>
                <div className="space-y-2">
                  {allSlots.filter(s => s.day === day).sort((a, b) => a.startTime.localeCompare(b.startTime)).map(slot => {
                    const subject = getSubjectById(slot.subjectId);
                    const cls = getClassById(slot.classId);
                    return (
                      <div key={slot.id} className="p-3 rounded-lg bg-primary/5 border border-primary/10 text-xs space-y-1">
                        <p className="font-semibold text-foreground">{subject?.name || "-"}</p>
                        <p className="text-muted-foreground">{slot.startTime} - {slot.endTime}</p>
                        <p className="text-primary font-medium">{cls?.name}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {getSchoolById(cls?.schoolId || "")?.name || "École non définie"}
                        </p>
                      </div>
                    );
                  })}
                  {allSlots.filter(s => s.day === day).length === 0 && (
                    <div className="p-3 rounded-lg bg-muted/30 text-xs text-muted-foreground text-center">Libre</div>
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

export default TeacherTimetablePage;
