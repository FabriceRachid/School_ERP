import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/shared/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { 
  getStudentsBySchool, 
  getTeachersBySchool, 
  getClassesBySchool, 
  getPaymentsBySchool,
  schools
} from "@/data/mock-data";
import { 
  Plus, Calendar, Users, GraduationCap, BookOpen, 
  TrendingUp, Award, BarChart3, PieChart, CheckCircle, XCircle
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from "recharts";
import { toast } from "@/hooks/use-toast";

const AcademicYearsPage = () => {
  const { user } = useAuth();
  const schoolId = user?.schoolId || "s1";
  const school = schools.find(s => s.id === schoolId);
  
  // Mock academic years data
  const [academicYears, setAcademicYears] = useState([
    {
      id: "ay1",
      label: "2024-2025",
      startDate: "2024-09-02",
      endDate: "2025-06-30",
      isCurrent: true,
      isCompleted: false,
      students: 450,
      teachers: 28,
      classes: 12,
      revenue: 67500000,
      paidRate: 85
    },
    {
      id: "ay2",
      label: "2023-2024",
      startDate: "2023-09-04",
      endDate: "2024-06-28",
      isCurrent: false,
      isCompleted: true,
      students: 420,
      teachers: 25,
      classes: 11,
      revenue: 63000000,
      paidRate: 82
    },
    {
      id: "ay3",
      label: "2022-2023",
      startDate: "2022-09-05",
      endDate: "2023-06-30",
      isCurrent: false,
      isCompleted: true,
      students: 380,
      teachers: 22,
      classes: 10,
      revenue: 57000000,
      paidRate: 78
    }
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [completionDialogOpen, setCompletionDialogOpen] = useState(false);
  const [selectedYearForCompletion, setSelectedYearForCompletion] = useState<typeof academicYears[0] | null>(null);
  const [newYearForm, setNewYearForm] = useState({
    label: "",
    startDate: "",
    endDate: ""
  });

  // Current year stats
  const currentYear = academicYears.find(y => y.isCurrent);
  const students = getStudentsBySchool(schoolId);
  const teachers = getTeachersBySchool(schoolId);
  const classes = getClassesBySchool(schoolId);
  const payments = getPaymentsBySchool(schoolId);
  
  const totalRevenue = payments.reduce((a, p) => a + p.paidAmount, 0);
  const paidCount = payments.filter(p => p.status === "paid").length;
  const paidRate = Math.round((paidCount / payments.length) * 100);

  // Charts data
  const growthData = academicYears
    .filter(y => !y.isCurrent)
    .map(y => ({
      year: y.label,
      élèves: y.students,
      enseignants: y.teachers,
      recettes: Math.round(y.revenue / 1000000)
    }))
    .reverse();

  const paymentDistribution = [
    { name: "Payé", value: payments.filter(p => p.status === "paid").length, color: "hsl(152, 60%, 48%)" },
    { name: "Partiel", value: payments.filter(p => p.status === "partial").length, color: "hsl(36, 95%, 55%)" },
    { name: "Impayé", value: payments.filter(p => p.status === "unpaid").length, color: "hsl(0, 72%, 51%)" },
  ];

  const handleCreateYear = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Année académique créée",
      description: `L'année ${newYearForm.label} a été ajoutée`,
      className: "bg-emerald-600 text-white border-emerald-700"
    });
    setDialogOpen(false);
    setNewYearForm({ label: "", startDate: "", endDate: "" });
  };

  const handleMarkAsCompleted = (year: typeof academicYears[0]) => {
    setSelectedYearForCompletion(year);
    setCompletionDialogOpen(true);
  };

  const confirmCompletion = () => {
    if (selectedYearForCompletion) {
      setAcademicYears(prev => 
        prev.map(y => 
          y.id === selectedYearForCompletion.id 
            ? { ...y, isCompleted: true } 
            : y
        )
      );
      
      toast({
        title: "Année marquée comme terminée",
        description: `L'année ${selectedYearForCompletion.label} est maintenant archivée`,
        className: "bg-emerald-600 text-white border-emerald-700"
      });
      
      setCompletionDialogOpen(false);
      setSelectedYearForCompletion(null);
    }
  };

  return (
    <DashboardLayout>
      <PageHeader 
        title="Années Académiques" 
        description={`Historique et statistiques de ${school?.name || "l'école"}`}
      >
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle année
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer une année académique</DialogTitle>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleCreateYear}>
              <div className="space-y-2">
                <Label>Libellé</Label>
                <Input 
                  value={newYearForm.label}
                  onChange={(e) => setNewYearForm({...newYearForm, label: e.target.value})}
                  placeholder="Ex: 2025-2026" 
                  required 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date de début</Label>
                  <Input 
                    type="date" 
                    value={newYearForm.startDate}
                    onChange={(e) => setNewYearForm({...newYearForm, startDate: e.target.value})}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Date de fin</Label>
                  <Input 
                    type="date" 
                    value={newYearForm.endDate}
                    onChange={(e) => setNewYearForm({...newYearForm, endDate: e.target.value})}
                    required 
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">
                Créer l'année
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </PageHeader>

      {/* Current Year Stats */}
      {currentYear && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">Année en cours: {currentYear.label}</h2>
            <Badge variant="default" className="bg-emerald-500">Active</Badge>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{currentYear.students}</p>
                    <p className="text-sm text-muted-foreground">Élèves</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{currentYear.teachers}</p>
                    <p className="text-sm text-muted-foreground">Enseignants</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{currentYear.classes}</p>
                    <p className="text-sm text-muted-foreground">Classes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{currentYear.paidRate}%</p>
                    <p className="text-sm text-muted-foreground">Taux de paiement</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Évolution des effectifs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="élèves" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="enseignants" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Répartition des paiements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie 
                  data={paymentDistribution} 
                  cx="50%" 
                  cy="50%" 
                  innerRadius={60} 
                  outerRadius={100} 
                  paddingAngle={5} 
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {paymentDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Historical Data Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Historique des années académiques
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Année</TableHead>
                <TableHead>Période</TableHead>
                <TableHead>Élèves</TableHead>
                <TableHead>Enseignants</TableHead>
                <TableHead>Classes</TableHead>
                <TableHead>Recettes (FCFA)</TableHead>
                <TableHead>Taux paiement</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {academicYears.map(year => (
                <TableRow key={year.id}>
                  <TableCell className="font-medium">{year.label}</TableCell>
                  <TableCell>
                    {new Date(year.startDate).toLocaleDateString('fr-FR')} - {new Date(year.endDate).toLocaleDateString('fr-FR')}
                  </TableCell>
                  <TableCell>{year.students}</TableCell>
                  <TableCell>{year.teachers}</TableCell>
                  <TableCell>{year.classes}</TableCell>
                  <TableCell>{year.revenue.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={year.paidRate > 80 ? "default" : year.paidRate > 60 ? "secondary" : "destructive"}>
                      {year.paidRate}%
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {year.isCurrent ? (
                      <Badge variant="default" className="bg-emerald-500">En cours</Badge>
                    ) : year.isCompleted ? (
                      <Badge variant="secondary" className="bg-gray-500 text-white">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Terminée
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-orange-500 text-orange-600">
                        En attente
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {!year.isCurrent && !year.isCompleted && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="gap-1"
                        onClick={() => handleMarkAsCompleted(year)}
                      >
                        <CheckCircle className="w-4 h-4" />
                        Marquer terminée
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Completion Confirmation Dialog */}
      <Dialog open={completionDialogOpen} onOpenChange={setCompletionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              Marquer l'année comme terminée
            </DialogTitle>
          </DialogHeader>
          {selectedYearForCompletion && (
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-medium mb-2">Confirmez-vous la clôture de l'année :</h3>
                <p className="text-lg font-bold text-primary">{selectedYearForCompletion.label}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {new Date(selectedYearForCompletion.startDate).toLocaleDateString('fr-FR')} - {new Date(selectedYearForCompletion.endDate).toLocaleDateString('fr-FR')}
                </p>
              </div>
              
              <div className="text-sm text-muted-foreground space-y-1">
                <p><strong>⚠️ Action irréversible :</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>L'année sera archivée et non modifiable</li>
                  <li>Les données seront conservées pour consultation</li>
                  <li>Les statistiques resteront disponibles</li>
                </ul>
              </div>
              
              <div className="flex justify-end gap-3 pt-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setCompletionDialogOpen(false);
                    setSelectedYearForCompletion(null);
                  }}
                >
                  Annuler
                </Button>
                <Button 
                  onClick={confirmCompletion}
                  className="gap-2 bg-emerald-600 hover:bg-emerald-700"
                >
                  <CheckCircle className="w-4 h-4" />
                  Confirmer la clôture
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default AcademicYearsPage;