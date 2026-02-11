import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/shared/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { getSchoolById, academicYears } from "@/data/mock-data";
import { Badge } from "@/components/ui/badge";

const SettingsPage = () => {
  const { user } = useAuth();
  const school = getSchoolById(user?.schoolId || "s1");

  return (
    <DashboardLayout>
      <PageHeader title="Configuration" description="Paramètres de l'établissement" />

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
            {academicYears.map(ay => (
              <div key={ay.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/40">
                <div>
                  <p className="font-medium">{ay.label}</p>
                  <p className="text-xs text-muted-foreground">{ay.startDate} → {ay.endDate}</p>
                </div>
                {ay.isCurrent && <Badge>En cours</Badge>}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
