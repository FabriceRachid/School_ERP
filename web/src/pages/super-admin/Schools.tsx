import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/shared/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { schools, users } from "@/data/mock-data";
import { Plus, Search, School, Edit, Power, PowerOff, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { School as SchoolType } from "@/data/mock-data";
import { getSchools, saveSchools, addSchool, updateSchool, toggleSchoolStatus } from "@/services/schools";

const SchoolsPage = () => {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [schoolsList, setSchoolsList] = useState<SchoolType[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    adminId: "",
    studentsCount: 0,
    teachersCount: 0,
    classesCount: 0,
  });
  const [editingSchool, setEditingSchool] = useState<SchoolType | null>(null);

  useEffect(() => {
    // Initialize with mock data if localStorage is empty
    const stored = getSchools();
    if (stored.length === 0) {
      saveSchools(schools);
      setSchoolsList(schools);
    } else {
      setSchoolsList(stored);
    }
  }, []);

  const filtered = schoolsList.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.address.toLowerCase().includes(search.toLowerCase())
  );

  const getAdminName = (adminId: string) => users.find(u => u.id === adminId)?.name || "Non assigné";

  const handleCreateSchool = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.address || !formData.email) {
      toast({ title: "Erreur", description: "Veuillez remplir les champs obligatoires", variant: "destructive" });
      return;
    }

    const newSchool = addSchool({
      ...formData,
      studentsCount: 0,
      teachersCount: 0,
      classesCount: 0,
      status: "active"
    });

    setSchoolsList([...schoolsList, newSchool]);
    setFormData({
      name: "",
      address: "",
      phone: "",
      email: "",
      adminId: "",
      studentsCount: 0,
      teachersCount: 0,
      classesCount: 0,
    });
    setDialogOpen(false);
    toast({ title: "Succès", description: "École créée avec succès" });
  };

  const handleEditSchool = (school: SchoolType) => {
    setEditingSchool(school);
    setFormData({
      name: school.name,
      address: school.address,
      phone: school.phone,
      email: school.email,
      adminId: school.adminId,
      studentsCount: school.studentsCount,
      teachersCount: school.teachersCount,
      classesCount: school.classesCount,
    });
    setEditDialogOpen(true);
  };

  const handleUpdateSchool = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingSchool) return;

    const updated = updateSchool(editingSchool.id, formData);
    if (updated) {
      setSchoolsList(schoolsList.map(s => s.id === updated.id ? updated : s));
      setEditDialogOpen(false);
      setEditingSchool(null);
      setFormData({
        name: "",
        address: "",
        phone: "",
        email: "",
        adminId: "",
        studentsCount: 0,
        teachersCount: 0,
        classesCount: 0,
      });
      toast({ title: "Succès", description: "École mise à jour avec succès" });
    }
  };

  const handleToggleStatus = (id: string) => {
    const updated = toggleSchoolStatus(id);
    if (updated) {
      setSchoolsList(schoolsList.map(s => s.id === updated.id ? updated : s));
      toast({ 
        title: "Statut modifié", 
        description: `L'école est maintenant ${updated.status === "active" ? "active" : "inactive"}` 
      });
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
              <div className="space-y-2">
                <Label>Nom *</Label>
                <Input 
                  placeholder="Nom de l'école" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label>Adresse *</Label>
                <Input 
                  placeholder="Adresse complète" 
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  required 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Téléphone</Label>
                  <Input 
                    placeholder="+225 ..." 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email *</Label>
                  <Input 
                    type="email" 
                    placeholder="email@ecole.edu" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Administrateur</Label>
                <Select value={formData.adminId} onValueChange={(value) => setFormData({...formData, adminId: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un admin" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.filter(u => u.role === "admin_school").map(user => (
                      <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">Créer l'école</Button>
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
                <TableHead>Statut</TableHead>
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
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <School className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{school.name}</p>
                        <p className="text-xs text-muted-foreground">{school.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{getAdminName(school.adminId)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        school.status === "active" ? "bg-green-500" : "bg-red-500"
                      }`} />
                      <span className={`font-medium ${
                        school.status === "active" ? "text-green-700" : "text-red-700 line-through"
                      }`}>
                        {school.status === "active" ? "Actif" : "Inactif"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{school.studentsCount}</TableCell>
                  <TableCell>{school.teachersCount}</TableCell>
                  <TableCell>{school.classesCount}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => handleEditSchool(school)}
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className={`h-8 w-8 ${school.status === "active" ? "text-red-600 hover:text-red-700" : "text-green-600 hover:text-green-700"}`}
                        onClick={() => handleToggleStatus(school.id)}
                        title={school.status === "active" ? "Désactiver l'école" : "Activer l'école"}
                      >
                        {school.status === "active" ? <X className="w-4 h-4" /> : <Power className="w-4 h-4" />}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Modifier l'école</DialogTitle></DialogHeader>
          <form className="space-y-4" onSubmit={handleUpdateSchool}>
            <div className="space-y-2">
              <Label>Nom *</Label>
              <Input 
                placeholder="Nom de l'école" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label>Adresse *</Label>
              <Input 
                placeholder="Adresse complète" 
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                required 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Téléphone</Label>
                <Input 
                  placeholder="+225 ..." 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Email *</Label>
                <Input 
                  type="email" 
                  placeholder="email@ecole.edu" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Administrateur</Label>
              <Select value={formData.adminId} onValueChange={(value) => setFormData({...formData, adminId: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un admin" />
                </SelectTrigger>
                <SelectContent>
                  {users.filter(u => u.role === "admin_school").map(user => (
                    <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full">Mettre à jour l'école</Button>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default SchoolsPage;
