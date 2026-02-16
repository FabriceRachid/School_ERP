import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/shared/StatCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/contexts/AuthContext";
import { getSubjectsBySchool, Subject } from "@/data/mock-data";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { createSubject, deleteSubject, refreshWebBootstrap, updateSubject } from "@/lib/api";

const SubjectsPage = () => {
  const { user } = useAuth();
  const schoolId = user?.schoolId || "s1";
  const [subs, setSubs] = useState<Subject[]>(() => getSubjectsBySchool(schoolId));
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [coefficient, setCoefficient] = useState<number>(1);

  const handleCreateClick = () => {
    setEditingSubject(null);
    setName("");
    setCoefficient(1);
    setDialogOpen(true);
  };

  const handleEditClick = (subject: any) => {
    setEditingSubject(subject);
    setName(subject.name || "");
    setCoefficient(Number(subject.coefficient || 1));
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (editingSubject?.id) {
        await updateSubject(editingSubject.id, {
          name: name.trim(),
          coefficient
        });
      } else {
        await createSubject({
          name: name.trim(),
          coefficient
        });
      }
      await refreshWebBootstrap();
      setSubs(getSubjectsBySchool(schoolId));
      const action = editingSubject ? "modifiée" : "créée";
      toast({
        title: `Matière ${action}`,
        description: `La matière a été ${action} avec succès`,
        className: "bg-emerald-600 text-white border-emerald-700"
      });
      setDialogOpen(false);
      setEditingSubject(null);
      setName("");
      setCoefficient(1);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Opération impossible";
      toast({ title: "Erreur", description: message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, subjectName: string) => {
    try {
      await deleteSubject(id);
      await refreshWebBootstrap();
      setSubs(getSubjectsBySchool(schoolId));
      toast({
        title: "Matière supprimée",
        description: `${subjectName} a été supprimée`,
        className: "bg-emerald-600 text-white border-emerald-700"
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Suppression impossible";
      toast({ title: "Erreur", description: message, variant: "destructive" });
    }
  };

  return (
    <DashboardLayout>
      <PageHeader title="Matières" description="Matières enseignées dans l'établissement">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreateClick}>
              <Plus className="w-4 h-4 mr-2" />Ajouter une matière
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingSubject ? "Modifier la matière" : "Nouvelle matière"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subjectName">Nom de la matière</Label>
                <Input 
                  id="subjectName" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Mathématiques" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="coefficient">Coefficient</Label>
                <Input 
                  id="coefficient" 
                  type="number" 
                  min="1" 
                  max="10" 
                  step="0.5" 
                  value={coefficient}
                  onChange={(e) => setCoefficient(Number(e.target.value))}
                  required 
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  disabled={saving}
                  onClick={() => {
                    setDialogOpen(false);
                    setEditingSubject(null);
                  }}
                >
                  Annuler
                </Button>
                <Button type="submit" disabled={saving}>{saving ? "Enregistrement..." : (editingSubject ? "Modifier" : "Créer")}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </PageHeader>
      <Card className="animate-fade-in">
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
              {subs.map(s => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell>{s.coefficient}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8" 
                        onClick={() => handleEditClick(s)}
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-destructive"
                        onClick={() => handleDelete(s.id, s.name)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
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

export default SubjectsPage;
