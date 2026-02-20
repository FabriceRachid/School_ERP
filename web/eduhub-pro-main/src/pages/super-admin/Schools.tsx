import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/shared/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ToastAction } from "@/components/ui/toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { schools, users } from "@/data/mock-data";
import { Plus, Search, School, Edit, Power, PowerOff } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { createSchoolWithAdmin, refreshWebBootstrap, updateFrontendSchool } from "@/lib/api";

const SchoolsPage = () => {
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

  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [schoolName, setSchoolName] = useState("");
  const [schoolAddress, setSchoolAddress] = useState("");
  const [schoolPhone, setSchoolPhone] = useState("");
  const [schoolEmail, setSchoolEmail] = useState("");
  const [adminFirstName, setAdminFirstName] = useState("");
  const [adminLastName, setAdminLastName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPhone, setAdminPhone] = useState("");

  const filtered = schools.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.address.toLowerCase().includes(search.toLowerCase()));

  const getAdminName = (adminId: string | null) => users.find(u => u.id === adminId)?.name || "Non assigné";

  const resetForm = () => {
    setSchoolName("");
    setSchoolAddress("");
    setSchoolPhone("");
    setSchoolEmail("");
    setAdminFirstName("");
    setAdminLastName("");
    setAdminEmail("");
    setAdminPhone("");
  };

  const handleCreateSchool = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const result = await createSchoolWithAdmin({
        name: schoolName,
        address: schoolAddress,
        phone: schoolPhone,
        email: schoolEmail,
        admin: adminEmail ? {
          first_name: adminFirstName,
          last_name: adminLastName,
          email: adminEmail,
          phone: adminPhone
        } : undefined
      });
      await refreshWebBootstrap();

      const tempPwd = result.admin?.onboarding?.temporary_password;
      toast({
        title: "École créée",
        description: tempPwd
          ? `Admin créé. Mot de passe temporaire: ${tempPwd}`
          : "École et admin créés avec succès",
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

  const toggleSchoolStatus = async (schoolId: string, enabled: boolean) => {
    try {
      await updateFrontendSchool(schoolId, { isActive: enabled });
      await refreshWebBootstrap();
      const school = schools.find((s) => s.id === schoolId);
      if (school) school.isActive = enabled;
      toast({
        title: enabled ? "École activée" : "École désactivée",
        description: "Statut mis à jour"
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Action impossible";
      toast({ title: "Erreur", description: message, variant: "destructive" });
    }
  };

  return (
    <DashboardLayout>
      <PageHeader title="Gestion des Écoles" description="Créer, modifier et superviser les écoles">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" />Nouvelle école</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Ajouter une école</DialogTitle></DialogHeader>
            <form className="space-y-4" onSubmit={handleCreateSchool}>
              <div className="space-y-2"><Label>Nom</Label><Input placeholder="Nom de l'école" value={schoolName} onChange={(e) => setSchoolName(e.target.value)} required /></div>
              <div className="space-y-2"><Label>Adresse</Label><Input placeholder="Adresse complète" value={schoolAddress} onChange={(e) => setSchoolAddress(e.target.value)} required /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Téléphone</Label><Input placeholder="+225 ..." value={schoolPhone} onChange={(e) => setSchoolPhone(e.target.value)} /></div>
                <div className="space-y-2"><Label>Email</Label><Input type="email" placeholder="email@ecole.edu" value={schoolEmail} onChange={(e) => setSchoolEmail(e.target.value)} /></div>
              </div>
              <div className="rounded-lg border p-3 space-y-3">
                <p className="text-sm font-medium">Créer aussi l'admin de l'école</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Prénom Admin</Label><Input value={adminFirstName} onChange={(e) => setAdminFirstName(e.target.value)} /></div>
                  <div className="space-y-2"><Label>Nom Admin</Label><Input value={adminLastName} onChange={(e) => setAdminLastName(e.target.value)} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Email Admin</Label><Input type="email" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} /></div>
                  <div className="space-y-2"><Label>Téléphone Admin</Label><Input value={adminPhone} onChange={(e) => setAdminPhone(e.target.value)} /></div>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={saving}>{saving ? "Création..." : "Créer l'école"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <Card className="animate-fade-in">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input className="pl-9" placeholder="Rechercher une école..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>École</TableHead>
                <TableHead>Admin</TableHead>
                <TableHead>Élèves</TableHead>
                <TableHead>Enseignants</TableHead>
                <TableHead>Classes</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(school => (
                <TableRow key={school.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center"><School className="w-4 h-4 text-primary" /></div>
                      <div>
                        <p className="font-medium">{school.name}</p>
                        <p className="text-xs text-muted-foreground">{school.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{getAdminName(school.adminId)}</TableCell>
                  <TableCell>{school.studentsCount}</TableCell>
                  <TableCell>{school.teachersCount}</TableCell>
                  <TableCell>{school.classesCount}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="w-3.5 h-3.5" /></Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-green-600"
                        onClick={() => toggleSchoolStatus(school.id, true)}
                      >
                        <Power className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => toggleSchoolStatus(school.id, false)}
                      >
                        <PowerOff className="w-3.5 h-3.5" />
                      </Button>
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

export default SchoolsPage;
