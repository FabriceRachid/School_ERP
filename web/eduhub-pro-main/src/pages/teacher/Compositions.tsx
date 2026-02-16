import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/shared/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { listCompositions, upsertCompositionUpload, type CompositionItem } from "@/lib/api";
import { getSubjectsBySchool } from "@/data/mock-data";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

const TeacherCompositionsPage = () => {
  const { user } = useAuth();
  const schoolId = user?.schoolId || "s1";
  const subjects = getSubjectsBySchool(schoolId);

  const [rows, setRows] = useState<CompositionItem[]>([]);
  const [compositionId, setCompositionId] = useState("");
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || "");
  const [subjectTitle, setSubjectTitle] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [notesSummary, setNotesSummary] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const data = await listCompositions();
      setRows(data);
      if (!compositionId && data[0]?.id) setCompositionId(data[0].id);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Chargement impossible";
      toast({ title: "Erreur", description: msg, variant: "destructive" });
    }
  };

  useEffect(() => { load(); }, []);

  const saveUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await upsertCompositionUpload(compositionId, {
        subject_id: subjectId,
        subject_title: subjectTitle,
        file_url: fileUrl,
        notes_summary: notesSummary,
        notes_uploaded: true,
      });
      toast({ title: "Upload envoyé", description: "Sujet + état des notes transmis au Directeur", className: "bg-emerald-600 text-white border-emerald-700" });
      setFileUrl("");
      setNotesSummary("");
      await load();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Envoi impossible";
      toast({ title: "Erreur", description: msg, variant: "destructive" });
    } finally { setSaving(false); }
  };

  return (
    <DashboardLayout>
      <PageHeader title="Compositions" description="Uploader les sujets et informer la direction sur les notes" />
      <Card className="animate-fade-in">
        <CardHeader><CardTitle>Transmission enseignant</CardTitle></CardHeader>
        <CardContent>
          <form className="space-y-3" onSubmit={saveUpload}>
            <div className="space-y-2">
              <Label>Composition</Label>
              <Select value={compositionId} onValueChange={setCompositionId}>
                <SelectTrigger><SelectValue placeholder="Choisir une composition" /></SelectTrigger>
                <SelectContent>{rows.map((r) => <SelectItem key={r.id} value={r.id}>{`${r.class_name || r.class_id} - ${r.trimester} - ${r.exam_date}`}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Matière</Label>
              <Select value={subjectId} onValueChange={setSubjectId}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{subjects.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Titre du sujet</Label><Input value={subjectTitle} onChange={(e) => setSubjectTitle(e.target.value)} placeholder="Ex: Composition de Mathématiques" /></div>
            <div className="space-y-2"><Label>Lien du sujet (Drive/PDF)</Label><Input value={fileUrl} onChange={(e) => setFileUrl(e.target.value)} placeholder="https://..." /></div>
            <div className="space-y-2"><Label>Résumé notes saisies</Label><Textarea rows={4} value={notesSummary} onChange={(e) => setNotesSummary(e.target.value)} placeholder="Moyenne de classe, difficultés, absents..." /></div>
            <Button type="submit" disabled={saving || !compositionId || !subjectId}>{saving ? "Envoi..." : "Envoyer au Directeur"}</Button>
          </form>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default TeacherCompositionsPage;
