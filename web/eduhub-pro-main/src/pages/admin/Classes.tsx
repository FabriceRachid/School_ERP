import { useState } from "react";
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
import { getClassesBySchool, ClassRoom } from "@/data/mock-data";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { createClass, refreshWebBootstrap } from "@/lib/api";

const ClassesPage = () => {
  const { user } = useAuth();
  const schoolId = user?.schoolId || "s1";
  const [classes, setClasses] = useState<ClassRoom[]>(() => getClassesBySchool(schoolId));
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [className, setClassName] = useState("");
  const [capacity, setCapacity] = useState<number>(40);
  const [fees, setFees] = useState<number>(0);

  const handleCreateClick = () => {
    setEditingClass(null);
    setClassName("");
    setCapacity(40);
    setFees(0);
    setDialogOpen(true);
  };

  const handleEditClick = (cls: any) => {
    setEditingClass(cls);
    setClassName(cls.name);
    setCapacity(cls.capacity);
    setFees(cls.fees);
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (editingClass) {
        editingClass.name = className;
        editingClass.capacity = capacity;
        editingClass.fees = fees;
        setClasses((prev) => [...prev]);
        toast({
          title: "Classe modifiée",
          description: "La classe a été mise à jour",
          className: "bg-emerald-600 text-white border-emerald-700"
        });
      } else {
        const created = await createClass({
          name: className.trim(),
          academic_year: "2025-2026",
          level: "Général",
          capacity,
          fees
        });
        await refreshWebBootstrap();

        setClasses((prev) => [
          ...prev,
          {
            id: created.id,
            name: created.name,
            cycleId: "",
            schoolId: created.school_id || schoolId,
            capacity: Number(created.capacity || capacity),
            studentsCount: 0,
            fees: Number(created.fees || fees)
          }
        ]);
        toast({
          title: "Classe créée",
          description: `${className} a été créée avec succès`,
          className: "bg-emerald-600 text-white border-emerald-700"
        });
      }
      setDialogOpen(false);
      setEditingClass(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Opération impossible";
      toast({ title: "Erreur", description: message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <PageHeader title="Classes" description="Liste des classes de l'établissement">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreateClick}>
              <Plus className="w-4 h-4 mr-2" />Créer une classe
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingClass ? "Modifier la classe" : "Nouvelle classe"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="className">Nom de la classe</Label>
                <Input 
                  id="className" 
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  placeholder="Ex: Terminale A" 
                  required 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacité</Label>
                  <Input 
                    id="capacity" 
                    type="number" 
                    min="1" 
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fees">Frais (FCFA)</Label>
                  <Input 
                    id="fees" 
                    type="number" 
                    min="0" 
                    value={fees}
                    onChange={(e) => setFees(Number(e.target.value))}
                    required 
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  disabled={saving}
                  onClick={() => {
                    setDialogOpen(false);
                    setEditingClass(null);
                  }}
                >
                  Annuler
                </Button>
                <Button type="submit" disabled={saving}>{saving ? "Enregistrement..." : (editingClass ? "Modifier" : "Créer")}</Button>
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
                <TableHead>Classe</TableHead>
                <TableHead>Effectif</TableHead>
                <TableHead>Capacité</TableHead>
                <TableHead>Taux remplissage</TableHead>
                <TableHead>Frais (FCFA)</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classes.map(c => {
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
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8" 
                          onClick={() => handleEditClick(c)}
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-destructive"
                          onClick={() => toast({ title: "Classe supprimée", description: `${c.name} a été supprimée` })}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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
