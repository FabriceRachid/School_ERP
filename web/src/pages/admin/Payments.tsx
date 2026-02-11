import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader, StatCard } from "@/components/shared/StatCard";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { getPaymentsBySchool, students, getClassById } from "@/data/mock-data";
import { CreditCard, Search, CheckCircle, AlertCircle, XCircle, DollarSign } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Payment } from "@/data/mock-data";

const PaymentsPage = () => {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const allPayments = getPaymentsBySchool(user?.schoolId || "s1");

  const totalDue = allPayments.reduce((a, p) => a + p.totalDue, 0);
  const totalPaid = allPayments.reduce((a, p) => a + p.paidAmount, 0);

  const statusColors = { 
    paid: { bg: "bg-green-100", text: "text-green-800", icon: CheckCircle },
    partial: { bg: "bg-yellow-100", text: "text-yellow-800", icon: AlertCircle },
    unpaid: { bg: "bg-red-100", text: "text-red-800", icon: XCircle }
  };
  const statusLabels = { paid: "Payé", partial: "Partiel", unpaid: "Impayé" };

  const getStudent = (sid: string) => students.find(s => s.id === sid);

  const filtered = allPayments.filter(p => {
    const st = getStudent(p.studentId);
    return st ? `${st.firstName} ${st.lastName} ${st.matricule}`.toLowerCase().includes(search.toLowerCase()) : false;
  });

  const handlePayment = (payment: Payment) => {
    setSelectedPayment(payment);
    setPaymentAmount("");
    setPaymentDialogOpen(true);
  };

  const processPayment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPayment || !paymentAmount) {
      toast({ title: "Erreur", description: "Veuillez entrer un montant", variant: "destructive" });
      return;
    }

    const amount = parseFloat(paymentAmount);
    const remaining = selectedPayment.totalDue - selectedPayment.paidAmount;
    
    if (amount > remaining) {
      toast({ title: "Erreur", description: "Le montant ne peut pas dépasser le reste à payer", variant: "destructive" });
      return;
    }

    // This would ideally update the payment in localStorage
    const newStatus = amount === remaining ? "paid" : "partial";
    toast({ 
      title: "Paiement enregistré", 
      description: `Paiement de ${amount.toLocaleString()} FCFA enregistré avec succès` 
    });
    
    setPaymentDialogOpen(false);
    setSelectedPayment(null);
    setPaymentAmount("");
  };

  return (
    <DashboardLayout>
      <PageHeader title="Suivi des Paiements" description="Gestion de la scolarité" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 animate-fade-in">
        <StatCard title="Total dû" value={`${(totalDue / 1000000).toFixed(1)}M FCFA`} icon={CreditCard} color="primary" />
        <StatCard title="Total encaissé" value={`${(totalPaid / 1000000).toFixed(1)}M FCFA`} icon={CheckCircle} color="accent" />
        <StatCard title="Reste à percevoir" value={`${((totalDue - totalPaid) / 1000000).toFixed(1)}M FCFA`} icon={AlertCircle} color="warning" />
      </div>

      <Card className="animate-fade-in">
        <CardHeader className="pb-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="Rechercher un élève..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Élève</TableHead>
                <TableHead>Classe</TableHead>
                <TableHead>Total dû</TableHead>
                <TableHead>Payé</TableHead>
                <TableHead>Reste à verser</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(payment => {
                const st = getStudent(payment.studentId);
                const remaining = payment.totalDue - payment.paidAmount;
                const statusConfig = statusColors[payment.status];
                return (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">{st ? `${st.firstName} ${st.lastName}` : "-"}</TableCell>
                    <TableCell className="text-sm">{st ? getClassById(st.classId)?.name : "-"}</TableCell>
                    <TableCell className="font-medium">{payment.totalDue.toLocaleString()} FCFA</TableCell>
                    <TableCell className="text-green-600 font-medium">{payment.paidAmount.toLocaleString()} FCFA</TableCell>
                    <TableCell className="text-red-600 font-medium">{remaining.toLocaleString()} FCFA</TableCell>
                    <TableCell>
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}>
                        <statusConfig.icon className="w-3 h-3" />
                        {statusLabels[payment.status]}
                      </div>
                    </TableCell>
                    <TableCell>
                      {payment.status !== "paid" && (
                        <Button 
                          size="sm" 
                          onClick={() => handlePayment(payment)}
                          className="h-8 px-3"
                        >
                          <DollarSign className="w-3 h-3 mr-1" />
                          Payer
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Payment Dialog */}
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enregistrer un paiement</DialogTitle>
          </DialogHeader>
          {selectedPayment && (
            <form className="space-y-4" onSubmit={processPayment}>
              <div className="space-y-2">
                <Label>Élève</Label>
                <div className="p-2 bg-muted rounded">
                  {getStudent(selectedPayment.studentId)?.firstName} {getStudent(selectedPayment.studentId)?.lastName}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Total dû</Label>
                  <div className="p-2 bg-muted rounded font-medium">
                    {selectedPayment.totalDue.toLocaleString()} FCFA
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Déjà payé</Label>
                  <div className="p-2 bg-muted rounded font-medium">
                    {selectedPayment.paidAmount.toLocaleString()} FCFA
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Reste à payer</Label>
                <div className="p-2 bg-red-50 text-red-700 rounded font-medium">
                  {(selectedPayment.totalDue - selectedPayment.paidAmount).toLocaleString()} FCFA
                </div>
              </div>
              <div className="space-y-2">
                <Label>Montant à payer *</Label>
                <Input 
                  type="number"
                  placeholder="Entrez le montant"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  required
                  max={selectedPayment.totalDue - selectedPayment.paidAmount}
                />
              </div>
              <Button type="submit" className="w-full">
                Enregistrer le paiement
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default PaymentsPage;
