import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/shared/StatCard";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { getClassesBySchool, classes as mockClasses } from "@/data/mock-data";
import { Plus, Edit, Power } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { ClassRoom } from "@/data/mock-data";

const ClassesPage = () => {
  const { user } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [classesList, setClassesList] = useState<ClassRoom[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    capacity: "",
    fees: "",
  });

  useEffect(() => {
    const classes = getClassesBySchool(user?.schoolId || "s1");
    setClassesList(classes);
  }, [user?.schoolId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddClass = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.capacity || !formData.fees) {
      toast({ title: "Erreur", description: "Veuillez remplir tous les champs", variant: "destructive" });
      return;
    }

    const newClass: ClassRoom = {
      id: `c${Date.now()}`,
      name: formData.name,
      capacity: parseInt(formData.capacity),
      studentsCount: 0,
      classId: `CLS${String(classesList.length + 1).padStart(4, "0")}`,
      cycleId: "cy1", // Default cycle
      schoolId: user?.schoolId || "s1",
      fees: parseInt(formData.fees),
    };

    setClassesList([...classesList, newClass]);
    toast({ title: "Succès", description: "Classe ajoutée avec succès" });
    setFormData({ name: "", capacity: "", fees: "" });
    setDialogOpen(false);
  };

  const handleToggleClassStatus = (id: string) => {
    // This would toggle active/inactive status
    toast({ title: "Statut modifié", description: "Le statut de la classe a été modifié" });
  };

  const handleDeleteClass = (id: string) => {
    // Suppression de la fonction de suppression comme demandé
    toast({ title: "Information", description: "La suppression de classes est désactivée pour maintenir la cohérence des données" });
  };

  return (
    <DashboardLayout>
      <PageHeader title="Classes" description={`Liste des classes de l'établissement (${classesList.length} classes)`}>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-2" />Ajouter une classe</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Nouvelle classe</DialogTitle></DialogHeader>
            <form className="space-y-4" onSubmit={handleAddClass}>
              <div className="space-y-2">
                <Label>Nom de la classe *</Label>
                <Input 
                  name="name"
                  placeholder="Ex: Terminale A"
                  value={formData.name}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Capacité *</Label>
                  <Input 
                    type="number"
                    name="capacity"
                    placeholder="40"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Frais (FCFA) *</Label>
                  <Input 
                    type="number"
                    name="fees"
                    placeholder="150000"
                    value={formData.fees}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">Ajouter la classe</Button>
            </form>
          </DialogContent>
        </Dialog>
      </PageHeader>
      <Card className="animate-fade-in">
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Classe</TableHead>
                <TableHead>Effectif</TableHead>
                <TableHead>Capacité</TableHead>
                <TableHead>Taux remplissage</TableHead>
                <TableHead>Frais (FCFA)</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classesList.map(c => {
                const rate = Math.round((c.studentsCount / c.capacity) * 100);
                return (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell>{c.studentsCount}</TableCell>
                    <TableCell>{c.capacity}</TableCell>
                    <TableCell>
                      <Badge variant={rate > 90 ? "destructive" : rate > 70 ? "secondary" : "default"}>{rate}%</Badge>
                    </TableCell>
                    <TableCell>{c.fees.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 w-8 p-0"
                          onClick={() => handleToggleClassStatus(c.id)}
                          title="Activer/Désactiver"
                        >
                          <Power className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default ClassesPage;
