import { useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader, StatCard } from "@/components/shared/StatCard";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { getClassById, getStudentsBySchool, Student } from "@/data/mock-data";
import { CreditCard, Search, CheckCircle, AlertCircle, Plus, FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { createPayment, refreshWebBootstrap } from "@/lib/api";

type StatusType = "paid" | "partial" | "unpaid";

type RowPayment = {
  id: string;
  studentId: string;
  totalDue: number;
  paidAmount: number;
  status: StatusType;
  date: string;
  method: string;
  feeName?: string;
};

const statusColors = { paid: "default", partial: "secondary", unpaid: "destructive" } as const;
const statusLabels = { paid: "Payé", partial: "Partiel", unpaid: "Impayé" };

const PaymentsPage = () => {
  const { user } = useAuth();
  const schoolId = user?.schoolId || "s1";
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [studentId, setStudentId] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [reference, setReference] = useState("");
  const [label, setLabel] = useState("Frais scolaires");
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().slice(0, 10));
  const [students, setStudents] = useState<Student[]>(() => getStudentsBySchool(schoolId));
  const [allPayments, setAllPayments] = useState<RowPayment[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const bundle = await refreshWebBootstrap();
        if (!mounted) return;
        setStudents(getStudentsBySchool(schoolId));
        setAllPayments(
          (bundle.payments || []).map((p: any) => ({
            id: p.id,
            studentId: p.studentId,
            totalDue: Number(p.totalDue || 0),
            paidAmount: Number(p.paidAmount || 0),
            status: p.status as StatusType,
            date: p.date || "",
            method: p.method || "",
            feeName: p.feeName || "Frais scolaires"
          }))
        );
      } catch {
        // keep fallback snapshot
      }
    })();
    return () => {
      mounted = false;
    };
  }, [schoolId]);

  const totalDue = useMemo(() => allPayments.reduce((a, p) => a + p.totalDue, 0), [allPayments]);
  const totalPaid = useMemo(() => allPayments.reduce((a, p) => a + p.paidAmount, 0), [allPayments]);

  const getStudent = (sid: string) => students.find((s) => s.id === sid);

  const filtered = allPayments.filter((p) => {
    const st = getStudent(p.studentId);
    return st ? `${st.firstName} ${st.lastName} ${st.matricule}`.toLowerCase().includes(search.toLowerCase()) : false;
  });

  const exportTxt = () => {
    let content = `SUIVI DES PAIEMENTS\n${"=".repeat(80)}\n`;
    content += `Date export: ${new Date().toLocaleString("fr-FR")}\n`;
    content += `Total dû: ${totalDue.toLocaleString()} FCFA\n`;
    content += `Total payé: ${totalPaid.toLocaleString()} FCFA\n`;
    content += `Reste: ${(totalDue - totalPaid).toLocaleString()} FCFA\n\n`;
    content += `ELEVE`.padEnd(28) + `CLASSE`.padEnd(18) + `PAYE`.padEnd(12) + `DU`.padEnd(12) + `STATUT\n`;
    content += `${"-".repeat(80)}\n`;
    for (const p of filtered) {
      const st = getStudent(p.studentId);
      const studentName = st ? `${st.firstName} ${st.lastName}` : "-";
      const className = st ? (getClassById(st.classId)?.name || "-") : "-";
      content += `${studentName.padEnd(28)}${className.padEnd(18)}${String(p.paidAmount).padEnd(12)}${String(p.totalDue).padEnd(12)}${statusLabels[p.status]}\n`;
    }
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `paiements_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Export réussi", description: "Fichier TXT téléchargé" });
  };

  const handleCreatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await createPayment({
        student_id: studentId,
        amount,
        payment_date: paymentDate,
        payment_method: paymentMethod,
        reference_number: reference || undefined,
        label: label || "Frais scolaires"
      });

      const bundle = await refreshWebBootstrap();
      setAllPayments(
        (bundle.payments || []).map((p: any) => ({
          id: p.id,
          studentId: p.studentId,
          totalDue: Number(p.totalDue || 0),
          paidAmount: Number(p.paidAmount || 0),
          status: p.status as StatusType,
          date: p.date || "",
          method: p.method || "",
          feeName: p.feeName || "Frais scolaires"
        }))
      );
      setStudents(getStudentsBySchool(schoolId));
      toast({
        title: "Paiement enregistré",
        description: "Le paiement a été enregistré avec succès",
        className: "bg-emerald-600 text-white border-emerald-700"
      });
      setDialogOpen(false);
      setStudentId("");
      setAmount(0);
      setReference("");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Impossible d'enregistrer le paiement";
      toast({ title: "Erreur", description: message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <PageHeader title="Suivi des Paiements" description="Gestion de la scolarité">
        <Button variant="outline" onClick={exportTxt}>
          <FileText className="w-4 h-4 mr-2" />
          Exporter TXT
        </Button>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Enregistrer un paiement
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nouveau paiement</DialogTitle>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleCreatePayment}>
              <div className="space-y-2">
                <Label>Élève</Label>
                <select
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  required
                >
                  <option value="">Sélectionner un élève</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>{`${s.firstName} ${s.lastName} - ${s.matricule}`}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Libellé</Label>
                <Input value={label} onChange={(e) => setLabel(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Montant (FCFA)</Label>
                  <Input type="number" min="1" value={amount} onChange={(e) => setAmount(Number(e.target.value))} required />
                </div>
                <div className="space-y-2">
                  <Label>Date paiement</Label>
                  <Input type="date" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Méthode</Label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="cash">Espèces</option>
                    <option value="mobile_money">Mobile Money</option>
                    <option value="bank_transfer">Virement</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Référence</Label>
                  <Input value={reference} onChange={(e) => setReference(e.target.value)} placeholder="Optionnelle" />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={saving}>
                {saving ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 animate-fade-in">
        <StatCard title="Total dû" value={`${(totalDue / 1000000).toFixed(1)}M`} icon={CreditCard} color="primary" />
        <StatCard title="Total encaissé" value={`${(totalPaid / 1000000).toFixed(1)}M`} icon={CheckCircle} color="accent" />
        <StatCard title="Reste à percevoir" value={`${((totalDue - totalPaid) / 1000000).toFixed(1)}M`} icon={AlertCircle} color="warning" />
      </div>

      <Card className="animate-fade-in">
        <CardHeader className="pb-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="Rechercher un élève..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Élève</TableHead>
                <TableHead>Classe</TableHead>
                <TableHead>Libellé</TableHead>
                <TableHead>Total dû</TableHead>
                <TableHead>Payé</TableHead>
                <TableHead>Reste</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((payment) => {
                const st = getStudent(payment.studentId);
                return (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">{st ? `${st.firstName} ${st.lastName}` : "-"}</TableCell>
                    <TableCell className="text-sm">{st ? getClassById(st.classId)?.name : "-"}</TableCell>
                    <TableCell>{payment.feeName || "Frais scolaires"}</TableCell>
                    <TableCell>{payment.totalDue.toLocaleString()}</TableCell>
                    <TableCell className="text-accent font-medium">{payment.paidAmount.toLocaleString()}</TableCell>
                    <TableCell className="text-destructive">{(payment.totalDue - payment.paidAmount).toLocaleString()}</TableCell>
                    <TableCell><Badge variant={statusColors[payment.status]}>{statusLabels[payment.status]}</Badge></TableCell>
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

export default PaymentsPage;
