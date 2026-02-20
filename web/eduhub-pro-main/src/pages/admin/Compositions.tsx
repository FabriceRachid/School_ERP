import { useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/shared/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { createComposition, getCompositionUploads, listCompositions, type CompositionItem, type CompositionUploadItem } from "@/lib/api";
import { getClassesBySchool } from "@/data/mock-data";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

const statusLabel: Record<string, string> = { planned: "Planifiée", ongoing: "En cours", closed: "Clôturée" };

const AdminCompositionsPage = () => {
  const { user } = useAuth();
  const schoolId = user?.schoolId || "s1";
  const classes = getClassesBySchool(schoolId);

  const [rows, setRows] = useState<CompositionItem[]>([]);
  const [uploads, setUploads] = useState<CompositionUploadItem[]>([]);
  const [selectedCompositionId, setSelectedCompositionId] = useState<string>("");
  const [saving, setSaving] = useState(false);

  const [classId, setClassId] = useState(classes[0]?.id || "");
  const [academicYear, setAcademicYear] = useState("2025-2026");
  const [trimester, setTrimester] = useState("Trimestre 1");
  const [examDate, setExamDate] = useState(new Date().toISOString().slice(0, 10));
  const [instructions, setInstructions] = useState("");

  const load = async () => {
    try {
      const data = await listCompositions();
      setRows(data);
      if (!selectedCompositionId && data[0]?.id) setSelectedCompositionId(data[0].id);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Chargement impossible";
      toast({ title: "Erreur", description: msg, variant: "destructive" });
    }
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    (async () => {
      if (!selectedCompositionId) return;
      try {
        setUploads(await getCompositionUploads(selectedCompositionId));
      } catch {
        setUploads([]);
      }
    })();
  }, [selectedCompositionId]);

  const selected = useMemo(() => rows.find((r) => r.id === selectedCompositionId), [rows, selectedCompositionId]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await createComposition({ class_id: classId, academic_year: academicYear, trimester, exam_date: examDate, instructions });
      toast({ title: "Composition créée", description: "Directive de composition enregistrée", className: "bg-emerald-600 text-white border-emerald-700" });
      setInstructions("");
      await load();
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Création impossible";
      toast({ title: "Erreur", description: msg, variant: "destructive" });
    } finally { setSaving(false); }
  };

  return (
    <DashboardLayout>
      <PageHeader title="Compositions trimestrielles" description="Date + consignes, suivi des uploads enseignants" />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 animate-fade-in">
        <Card className="xl:col-span-1">
          <CardHeader><CardTitle>Nouvelle composition</CardTitle></CardHeader>
          <CardContent>
            <form className="space-y-3" onSubmit={handleCreate}>
              <div className="space-y-2">
                <Label>Classe</Label>
                <Select value={classId} onValueChange={setClassId}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{classes.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2"><Label>Année</Label><Input value={academicYear} onChange={(e) => setAcademicYear(e.target.value)} required /></div>
                <div className="space-y-2"><Label>Trimestre</Label><Input value={trimester} onChange={(e) => setTrimester(e.target.value)} required /></div>
              </div>
              <div className="space-y-2"><Label>Date composition</Label><Input type="date" value={examDate} onChange={(e) => setExamDate(e.target.value)} required /></div>
              <div className="space-y-2"><Label>Consignes</Label><Textarea rows={5} value={instructions} onChange={(e) => setInstructions(e.target.value)} placeholder="Consignes officielles…" /></div>
              <Button className="w-full" type="submit" disabled={saving}>{saving ? "Enregistrement..." : "Créer"}</Button>
            </form>
          </CardContent>
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader><CardTitle>Suivi Directeur</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Select value={selectedCompositionId} onValueChange={setSelectedCompositionId}>
                <SelectTrigger><SelectValue placeholder="Choisir une composition" /></SelectTrigger>
                <SelectContent>
                  {rows.map((r) => (
                    <SelectItem key={r.id} value={r.id}>{`${r.class_name || r.class_id} - ${r.trimester} - ${r.exam_date}`}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={load}>Actualiser</Button>
            </div>

            {selected ? (
              <div className="p-4 rounded-xl border bg-muted/20">
                <div className="flex items-center gap-2 mb-2">
                  <Badge>{statusLabel[selected.status] || selected.status}</Badge>
                  <Badge variant="secondary">{selected.academic_year}</Badge>
                  <Badge variant="outline">{selected.trimester}</Badge>
                </div>
                <p className="text-sm"><span className="font-semibold">Date:</span> {selected.exam_date}</p>
                <p className="text-sm whitespace-pre-wrap"><span className="font-semibold">Consignes:</span> {selected.instructions || '-'}</p>
              </div>
            ) : <p className="text-sm text-muted-foreground">Aucune composition</p>}

            <div>
              <p className="text-sm font-semibold mb-2">Uploads enseignants</p>
              <div className="space-y-2">
                {uploads.length === 0 ? <p className="text-sm text-muted-foreground">Aucun upload pour le moment</p> : uploads.map((u) => (
                  <div key={u.id} className="p-3 rounded-lg border bg-background">
                    <p className="text-sm font-medium">{u.subject_name || u.subject_title || u.subject_id}</p>
                    <p className="text-xs text-muted-foreground">{u.teacher_first_name || ""} {u.teacher_last_name || ""}</p>
                    <p className="text-xs">Sujet: {u.file_url ? <a className="text-primary underline" href={u.file_url} target="_blank" rel="noreferrer">ouvrir</a> : "non fourni"}</p>
                    <p className="text-xs">Notes: {u.notes_uploaded ? "publiées" : "en attente"}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminCompositionsPage;
