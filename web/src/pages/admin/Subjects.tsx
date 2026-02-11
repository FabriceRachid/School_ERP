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
import { getSubjectsBySchool } from "@/data/mock-data";
import { Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Subject } from "@/data/mock-data";

const SubjectsPage = () => {
  const { user } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    coefficient: "",
  });

  const subs = getSubjectsBySchool(user?.schoolId || "s1");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.coefficient) {
      toast({ title: "Erreur", description: "Veuillez remplir tous les champs", variant: "destructive" });
      return;
    }

    // This would ideally save to localStorage
    toast({ title: "Succès", description: "Matière ajoutée avec succès" });
    setFormData({ name: "", coefficient: "" });
    setDialogOpen(false);
  };

  return (
    <DashboardLayout>
      <PageHeader title="Matières" description="Matières enseignées dans l'établissement">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-2" />Ajouter une matière</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Nouvelle matière</DialogTitle></DialogHeader>
            <form className="space-y-4" onSubmit={handleAddSubject}>
              <div className="space-y-2">
                <Label>Nom de la matière *</Label>
                <Input 
                  name="name"
                  placeholder="Ex: Mathématiques"
                  value={formData.name}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label>Coefficient *</Label>
                <Input 
                  type="number"
                  name="coefficient"
                  placeholder="5"
                  value={formData.coefficient}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              <Button type="submit" className="w-full">Ajouter la matière</Button>
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {subs.map(s => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell>{s.coefficient}</TableCell>
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
