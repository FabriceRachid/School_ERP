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
import { getTeachersBySchool, getSubjectById, getClassById, Teacher } from "@/data/mock-data";
import { Plus, Search } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { provisionUser, refreshWebBootstrap } from "@/lib/api";

const TeachersPage = () => {
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
        description: "Le mot de passe temporaire a été copié",
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
  const [phone, setPhone] = useState("");
  const [specialization, setSpecialization] = useState("");

  const [allTeachers, setAllTeachers] = useState<Teacher[]>(() => getTeachersBySchool(user?.schoolId || "s1"));
  const filtered = allTeachers.filter(t => `${t.firstName} ${t.lastName}`.toLowerCase().includes(search.toLowerCase()));

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await refreshWebBootstrap();
        if (mounted) {
          setAllTeachers(getTeachersBySchool(user?.schoolId || "s1"));
        }
      } catch {
        // keep current local snapshot if refresh fails
      }
    })();
    return () => {
      mounted = false;
    };
  }, [user?.schoolId]);

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setSpecialization("");
  };

  const handleCreateTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const result = await provisionUser({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim().toLowerCase(),
        role: "teacher",
        phone: phone.trim() || undefined,
        specialization: specialization.trim() || undefined
      });
      await refreshWebBootstrap();
      setAllTeachers(getTeachersBySchool(user?.schoolId || "s1"));

      const tempPwd = result.onboarding?.temporary_password;
      toast({
        title: "Enseignant créé",
        description: tempPwd ? `Mot de passe temporaire: ${tempPwd}` : "Compte enseignant provisionné",
        className: "bg-emerald-600 text-white border-emerald-700",
        action: tempPwd ? (
          <ToastAction altText="Copier le mot de passe" onClick={() => copyText(tempPwd)}>
            Copier
          </ToastAction>
        ) : undefined
      });
      setDialogOpen(false);
      resetForm();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Création impossible";
      toast({ title: "Erreur", description: message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <PageHeader title="Gestion des Enseignants" description={`${allTeachers.length} enseignants`}>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-2" />Ajouter un enseignant</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Nouvel enseignant</DialogTitle></DialogHeader>
            <form className="space-y-4" onSubmit={handleCreateTeacher}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Prénom</Label><Input value={firstName} onChange={(e) => setFirstName(e.target.value)} required /></div>
                <div className="space-y-2"><Label>Nom</Label><Input value={lastName} onChange={(e) => setLastName(e.target.value)} required /></div>
              </div>
              <div className="space-y-2"><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
              <div className="space-y-2"><Label>Téléphone</Label><Input value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
              <div className="space-y-2"><Label>Spécialité</Label><Input value={specialization} onChange={(e) => setSpecialization(e.target.value)} /></div>
              <Button type="submit" className="w-full" disabled={saving}>{saving ? "Création..." : "Créer le compte"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <Card className="animate-fade-in">
        <CardHeader className="pb-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead>Matières</TableHead>
                <TableHead>Classes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(teacher => (
                <TableRow key={teacher.id}>
                  <TableCell className="font-medium">{teacher.firstName} {teacher.lastName}</TableCell>
                  <TableCell className="text-sm">{teacher.phone}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {teacher.subjects.length > 0
                        ? teacher.subjects.map(sid => <Badge key={sid} variant="secondary" className="text-xs">{getSubjectById(sid)?.name || sid}</Badge>)
                        : <Badge variant="outline" className="text-xs">Aucune</Badge>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {teacher.classes.length > 0
                        ? teacher.classes.map(cid => <Badge key={cid} variant="outline" className="text-xs">{getClassById(cid)?.name || cid}</Badge>)
                        : <Badge variant="outline" className="text-xs">Aucune</Badge>}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default TeachersPage;
