import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/shared/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { getSchoolById, academicYears } from "@/data/mock-data";
import { Plus, Calendar, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const SettingsPage = () => {
  const { user } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    label: "",
    startDate: "",
    endDate: "",
  });
  
  const school = getSchoolById(user?.schoolId || "s1");
  
  // Fonction pour déterminer le statut d'une année scolaire
  const getAcademicYearStatus = (startDate: string, endDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (now < start) return "À venir";
    if (now > end) return "Terminé";
    return "En cours";
  };
  
  // Fonction pour obtenir le trimestre actuel
  const getCurrentTrimester = (startDate: string, endDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    
    // Trimestre 1: Octobre - Décembre
    const t1Start = new Date(start.getFullYear(), 9, 1); // 1er Octobre
    const t1End = new Date(start.getFullYear(), 11, 31); // 31 Décembre
    
    // Trimestre 2: Janvier - Mars
    const t2Start = new Date(start.getFullYear(), 0, 1); // 1er Janvier
    const t2End = new Date(start.getFullYear(), 2, 31); // 31 Mars
    
    // Trimestre 3: Avril - Juin
    const t3Start = new Date(start.getFullYear(), 3, 1); // 1er Avril
    const t3End = new Date(start.getFullYear(), 5, 30); // 30 Juin
    
    if (now >= t1Start && now <= t1End) return "1er Trimestre (Oct-Déc)";
    if (now >= t2Start && now <= t2End) return "2ème Trimestre (Jan-Mar)";
    if (now >= t3Start && now <= t3End) return "3ème Trimestre (Avr-Juin)";
    return "Vacances";
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleAddYear = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.label || !formData.startDate || !formData.endDate) {
      toast({ title: "Erreur", description: "Veuillez remplir tous les champs", variant: "destructive" });
      return;
    }
    
    // This would ideally save to localStorage
    toast({ title: "Succès", description: "Année scolaire ajoutée avec succès" });
    setFormData({ label: "", startDate: "", endDate: "" });
    setDialogOpen(false);
  };

  return (
    <DashboardLayout>
      <PageHeader title="Configuration" description="Paramètres de l'établissement">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" />Ajouter une année scolaire</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nouvelle année scolaire</DialogTitle>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleAddYear}>
              <div className="space-y-2">
                <Label>Libellé *</Label>
                <Input 
                  name="label"
                  placeholder="Ex: 2024-2025"
                  value={formData.label}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date de début *</Label>
                  <Input 
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Date de fin *</Label>
                  <Input 
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">Ajouter l'année</Button>
            </form>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
        <Card>
          <CardHeader><CardTitle className="font-display">Informations de l'école</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div><p className="text-sm text-muted-foreground">Nom</p><p className="font-medium">{school?.name}</p></div>
            <div><p className="text-sm text-muted-foreground">Adresse</p><p className="font-medium">{school?.address}</p></div>
            <div><p className="text-sm text-muted-foreground">Téléphone</p><p className="font-medium">{school?.phone}</p></div>
            <div><p className="text-sm text-muted-foreground">Email</p><p className="font-medium">{school?.email}</p></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="font-display">Années scolaires</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {academicYears.map(ay => {
              const status = getAcademicYearStatus(ay.startDate, ay.endDate);
              const currentTrimester = getCurrentTrimester(ay.startDate, ay.endDate);
              const isCurrent = status === "En cours";
              
              return (
                <div key={ay.id} className={`p-4 rounded-lg border ${isCurrent ? 'bg-primary/5 border-primary/20' : 'bg-muted/40'}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-lg">{ay.label}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {ay.startDate} → {ay.endDate}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Badge variant={isCurrent ? "default" : status === "Terminé" ? "secondary" : "outline"}>
                        {isCurrent && <CheckCircle className="w-3 h-3 mr-1" />}
                        {status}
                      </Badge>
                    </div>
                  </div>
                  
                  {isCurrent && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm font-medium text-blue-800 mb-1">Trimestre actuel</p>
                      <p className="text-sm text-blue-600">{currentTrimester}</p>
                    </div>
                  )}
                  
                  <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                    <div className="p-2 bg-gray-50 rounded text-center">
                      <p className="font-medium">T1</p>
                      <p className="text-muted-foreground">Oct-Déc</p>
                    </div>
                    <div className="p-2 bg-gray-50 rounded text-center">
                      <p className="font-medium">T2</p>
                      <p className="text-muted-foreground">Jan-Mar</p>
                    </div>
                    <div className="p-2 bg-gray-50 rounded text-center">
                      <p className="font-medium">T3</p>
                      <p className="text-muted-foreground">Avr-Juin</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
