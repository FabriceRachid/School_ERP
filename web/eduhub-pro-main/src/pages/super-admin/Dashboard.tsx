import { DashboardLayout } from "@/components/DashboardLayout";
import { StatCard, PageHeader } from "@/components/shared/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { schools, payments, School as SchoolType } from "@/data/mock-data";
import { School, Users, GraduationCap, DollarSign, Edit, Power, PowerOff } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { updateFrontendSchool } from "@/lib/api";

const SuperAdminDashboard = () => {
  const totalStudents = schools.reduce((a, s) => a + s.studentsCount, 0);
  const totalTeachers = schools.reduce((a, s) => a + s.teachersCount, 0);
  const totalRevenue = payments.filter(p => p.paidAmount > 0).reduce((a, p) => a + p.paidAmount, 0);

  const schoolChartData = schools.map(s => ({ name: s.name.split(" ").slice(0, 2).join(" "), élèves: s.studentsCount, enseignants: s.teachersCount }));
  
  // State for school modification dialog
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentSchool, setCurrentSchool] = useState<SchoolType | null>(null);
  const [isActive, setIsActive] = useState(true);
  const [schoolName, setSchoolName] = useState("");
  const [schoolAddress, setSchoolAddress] = useState("");
  const [schoolPhone, setSchoolPhone] = useState("");
  const [schoolEmail, setSchoolEmail] = useState("");
  const [saving, setSaving] = useState(false);

  const handleEditClick = (school: SchoolType) => {
    setCurrentSchool(school);
    setSchoolName(school.name);
    setSchoolAddress(school.address);
    setSchoolPhone(school.phone);
    setSchoolEmail(school.email);
    setIsActive(school.isActive !== false);
    setEditDialogOpen(true);
  };

  const handleSaveSchool = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSchool) return;

    try {
      setSaving(true);
      await updateFrontendSchool(currentSchool.id, {
        name: schoolName,
        address: schoolAddress,
        phone: schoolPhone,
        email: schoolEmail,
        isActive,
      });

      currentSchool.name = schoolName;
      currentSchool.address = schoolAddress;
      currentSchool.phone = schoolPhone;
      currentSchool.email = schoolEmail;
      currentSchool.isActive = isActive;

      toast({ title: "École modifiée", description: `${currentSchool.name} a été mise à jour` });
      setEditDialogOpen(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Mise à jour impossible";
      toast({ title: "Erreur", description: message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const toggleSchoolStatus = async (school: SchoolType, nextStatus: boolean) => {
    try {
      await updateFrontendSchool(school.id, { isActive: nextStatus });
      school.isActive = nextStatus;
      const status = nextStatus ? "activée" : "désactivée";
      toast({ title: `École ${status}`, description: `L'école a été ${status} avec succès` });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Action impossible";
      toast({ title: "Erreur", description: message, variant: "destructive" });
    }
  };

  const paymentStatus = [
    { name: "Payé", value: payments.filter(p => p.status === "paid").length, color: "hsl(152, 60%, 48%)" },
    { name: "Partiel", value: payments.filter(p => p.status === "partial").length, color: "hsl(36, 95%, 55%)" },
    { name: "Impayé", value: payments.filter(p => p.status === "unpaid").length, color: "hsl(0, 72%, 51%)" },
  ];

  return (
    <DashboardLayout>
      <PageHeader title="Tableau de bord" description="Vue d'ensemble de toutes les écoles" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 animate-fade-in">
        <StatCard title="Écoles" value={schools.length} icon={School} color="primary" description="Écoles actives" />
        <StatCard title="Élèves" value={totalStudents.toLocaleString()} icon={Users} color="accent" trend="+12% vs année préc." />
        <StatCard title="Enseignants" value={totalTeachers} icon={GraduationCap} color="warning" />
        <StatCard title="Recettes" value={`${totalRevenue.toLocaleString()} FCFA`} icon={DollarSign} color="primary" trend="+8% ce trimestre" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
        <Card>
          <CardHeader><CardTitle className="font-display text-lg">Effectifs par école</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={schoolChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="élèves" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                <Bar dataKey="enseignants" fill="hsl(152, 60%, 48%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="font-display text-lg">État des paiements</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={paymentStatus} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {paymentStatus.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 animate-fade-in">
        <CardHeader><CardTitle className="font-display text-lg">Écoles enregistrées</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {schools.map(school => (
              <div key={school.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/40 hover:bg-muted transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <School className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{school.name}</p>
                    <p className="text-sm text-muted-foreground">{school.address}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <span>{school.studentsCount} élèves</span>
                  <span>{school.teachersCount} enseignants</span>
                  <span>{school.classesCount} classes</span>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleEditClick(school)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => toggleSchoolStatus(school, true)}
                      className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                    >
                      <Power className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => toggleSchoolStatus(school, false)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <PowerOff className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Edit School Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier l'école</DialogTitle>
          </DialogHeader>
          {currentSchool && (
            <form onSubmit={handleSaveSchool} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="schoolName">Nom de l'école</Label>
                <Input 
                  id="schoolName" 
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Adresse</Label>
                <Input 
                  id="address" 
                  value={schoolAddress}
                  onChange={(e) => setSchoolAddress(e.target.value)}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input 
                  id="phone" 
                  value={schoolPhone}
                  onChange={(e) => setSchoolPhone(e.target.value)}
                  type="tel" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  value={schoolEmail}
                  onChange={(e) => setSchoolEmail(e.target.value)}
                  type="email" 
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="active">Actif</Label>
                <Switch 
                  id="active" 
                  checked={isActive} 
                  onCheckedChange={setIsActive} 
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  disabled={saving}
                  onClick={() => setEditDialogOpen(false)}
                >
                  Annuler
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? "Enregistrement..." : "Enregistrer"}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default SuperAdminDashboard;

