import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/shared/StatCard";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ToastAction } from "@/components/ui/toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { getStudentsBySchool, getClassById, schools, getClassesBySchool, Student } from "@/data/mock-data";
import { Plus, Search, FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { enrollStudent, refreshWebBootstrap } from "@/lib/api";

const StudentsPage = () => {
  const copyText = async (text: string) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      toast({
        title: "Copié",
        description: "Les mots de passe temporaires ont été copiés",
        className: "bg-emerald-600 text-white border-emerald-700"
      });
    } catch {
      toast({ title: "Erreur", description: "Impossible de copier", variant: "destructive" });
    }
  };

  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [classId, setClassId] = useState("");
  const [parentName, setParentName] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [parentEmail, setParentEmail] = useState("");

  const schoolId = user?.schoolId || "s1";
  const [schoolClasses, setSchoolClasses] = useState(() => getClassesBySchool(schoolId));
  const [allStudents, setAllStudents] = useState<Student[]>(() => getStudentsBySchool(schoolId));
  const filtered = allStudents.filter(s =>
    `${s.firstName} ${s.lastName} ${s.matricule}`.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await refreshWebBootstrap();
        if (!mounted) return;
        setAllStudents(getStudentsBySchool(schoolId));
        setSchoolClasses(getClassesBySchool(schoolId));
      } catch {
        // keep current local snapshot if refresh fails
      }
    })();

    return () => {
      mounted = false;
    };
  }, [schoolId]);

  const exportToTxt = () => {
    const school = schools.find(s => s.id === user?.schoolId);
    let content = `LISTE DES ÉLÈVES\n${"=".repeat(50)}\n`;
    content += `Établissement: ${school?.name || "Inconnu"}\n`;
    content += `Date: ${new Date().toLocaleDateString("fr-FR")}\n`;
    content += `Total élèves: ${allStudents.length}\n\n`;
    content += `${"─".repeat(80)}\n`;
    content += `MATRICULE`.padEnd(15) + `NOM COMPLET`.padEnd(25) + `CLASSE`.padEnd(15) + `GENRE`.padEnd(10) + `TELEPHONE PARENT\n`;
    content += `${"─".repeat(80)}\n`;
    
    for (const student of allStudents) {
      const className = getClassById(student.classId)?.name || "-";
      const gender = student.gender === "M" ? "Masculin" : "Féminin";
      content += `${student.matricule.padEnd(15)}${`${student.firstName} ${student.lastName}`.padEnd(25)}${className.padEnd(15)}${gender.padEnd(10)}${student.parentPhone}\n`;
    }
    
    content += `${"─".repeat(80)}\n`;
    content += `\nGénéré le ${new Date().toLocaleString("fr-FR")}`;
    
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `liste_eleves_${school?.name.replace(/[^a-zA-Z0-9]/g, "_")}_${new Date().toISOString().split("T")[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Export réussi", description: "La liste des élèves (TXT) a été téléchargée" });
  };

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setDob("");
    setGender("male");
    setClassId("");
    setParentName("");
    setParentPhone("");
    setParentEmail("");
  };

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const result = await enrollStudent({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim().toLowerCase(),
        class_id: classId || undefined,
        date_of_birth: dob || undefined,
        gender,
        parent_name: parentName || undefined,
        parent_phone: parentPhone || undefined,
        parent_email: parentEmail || undefined
      });
      await refreshWebBootstrap();
      setSchoolClasses(getClassesBySchool(schoolId));
      setAllStudents(getStudentsBySchool(schoolId));

      const tempPwd = result.onboarding?.credentials_fallback?.student_temporary_password;
      const parentTempPwd = result.onboarding?.credentials_fallback?.parent_temporary_password;
      const copyPayload =
        tempPwd && parentTempPwd
          ? `MDP eleve: ${tempPwd}\nMDP parent: ${parentTempPwd}`
          : tempPwd
            ? `MDP eleve: ${tempPwd}`
            : "";
      toast({
        title: "Élève inscrit",
        description:
          tempPwd && parentTempPwd
            ? `MDP élève: ${tempPwd} | MDP parent: ${parentTempPwd}`
            : tempPwd
              ? `Mot de passe temporaire élève: ${tempPwd}`
              : "Inscription effectuée",
        className: "bg-emerald-600 text-white border-emerald-700",
        action: copyPayload ? (
          <ToastAction altText="Copier les mots de passe" onClick={() => copyText(copyPayload)}>
            Copier
          </ToastAction>
        ) : undefined
      });
      setDialogOpen(false);
      resetForm();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Inscription impossible";
      toast({ title: "Erreur", description: message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <PageHeader title="Gestion des Élèves" description={`${allStudents.length} élèves inscrits`}>
        <Button variant="outline" onClick={exportToTxt}><FileText className="w-4 h-4 mr-2" />Exporter TXT</Button>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-2" />Inscrire un élève</Button></DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Inscription d'un élève</DialogTitle></DialogHeader>
            <form className="space-y-4" onSubmit={handleCreateStudent}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Prénom</Label><Input value={firstName} onChange={(e) => setFirstName(e.target.value)} required /></div>
                <div className="space-y-2"><Label>Nom</Label><Input value={lastName} onChange={(e) => setLastName(e.target.value)} required /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Date de naissance</Label><Input type="date" value={dob} onChange={(e) => setDob(e.target.value)} required /></div>
                <div className="space-y-2"><Label>Genre</Label>
                  <select value={gender} onChange={(e) => setGender(e.target.value as "male" | "female")} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"><option value="male">Masculin</option><option value="female">Féminin</option></select>
                </div>
              </div>
              <div className="space-y-2"><Label>Email élève</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
              <div className="space-y-2"><Label>Classe</Label>
                <select value={classId} onChange={(e) => setClassId(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option value="">Sélectionner une classe</option>
                  {schoolClasses.map((cls) => <option key={cls.id} value={cls.id}>{cls.name}</option>)}
                </select>
              </div>
              <div className="space-y-2"><Label>Parent/Tuteur</Label><Input placeholder="Nom du parent" value={parentName} onChange={(e) => setParentName(e.target.value)} required /></div>
              <div className="space-y-2"><Label>Téléphone parent</Label><Input placeholder="+225 ..." value={parentPhone} onChange={(e) => setParentPhone(e.target.value)} /></div>
              <div className="space-y-2"><Label>Email parent</Label><Input type="email" value={parentEmail} onChange={(e) => setParentEmail(e.target.value)} /></div>
              <Button type="submit" className="w-full" disabled={saving}>{saving ? "Inscription..." : "Inscrire"}</Button>
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
