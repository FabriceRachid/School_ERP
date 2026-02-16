import { useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/shared/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, CheckCheck, Clock3, Trash2 } from "lucide-react";
import {
  deleteNotification,
  getMyNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  type NotificationItem,
} from "@/lib/api";
import { toast } from "@/hooks/use-toast";

const formatDate = (value?: string) => {
  if (!value) return "-";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? value : d.toLocaleString("fr-FR");
};

const typeLabel = (type: string) => {
  const map: Record<string, string> = {
    grade: "Note",
    absence: "Absence",
    payment: "Paiement",
    announcement: "Annonce",
    schedule: "Planning",
  };
  return map[type] || type || "Info";
};

const NotificationsPage = () => {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const unreadCount = useMemo(
    () => items.filter((n) => (n.status || "unread") !== "read").length,
    [items]
  );

  const load = async () => {
    setLoading(true);
    try {
      const data = await getMyNotifications(100);
      setItems(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erreur de chargement";
      toast({ title: "Erreur", description: message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleMarkRead = async (id: string) => {
    try {
      await markNotificationAsRead(id);
      setItems((prev) => prev.map((n) => (n.id === id ? { ...n, status: "read" } : n)));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Action impossible";
      toast({ title: "Erreur", description: message, variant: "destructive" });
    }
  };

  const handleMarkAll = async () => {
    try {
      const result = await markAllNotificationsAsRead();
      setItems((prev) => prev.map((n) => ({ ...n, status: "read" })));
      toast({ title: "Notifications", description: `${result.count || 0} notification(s) marquée(s) comme lue(s)` });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Action impossible";
      toast({ title: "Erreur", description: message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNotification(id);
      setItems((prev) => prev.filter((n) => n.id !== id));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Suppression impossible";
      toast({ title: "Erreur", description: message, variant: "destructive" });
    }
  };

  return (
    <DashboardLayout>
      <PageHeader title="Notifications" description="Historique des alertes et messages" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 animate-fade-in">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="text-2xl font-bold">{items.length}</p>
            </div>
            <Bell className="w-5 h-5 text-primary" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Non lues</p>
              <p className="text-2xl font-bold">{unreadCount}</p>
            </div>
            <Clock3 className="w-5 h-5 text-warning" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-end gap-2">
            <Button variant="outline" onClick={load}>Actualiser</Button>
            <Button onClick={handleMarkAll}><CheckCheck className="w-4 h-4 mr-2" />Tout marquer lu</Button>
          </CardContent>
        </Card>
      </div>

      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle>Liste des notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {loading ? (
            <p className="text-sm text-muted-foreground">Chargement...</p>
          ) : items.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucune notification</p>
          ) : (
            items.map((n) => {
              const unread = (n.status || "unread") !== "read";
              return (
                <div key={n.id} className={`p-4 rounded-xl border ${unread ? "border-primary/40 bg-primary/5" : "border-border bg-card"}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-sm">{n.title}</p>
                        <Badge variant={unread ? "default" : "secondary"}>{unread ? "Nouveau" : "Lu"}</Badge>
                        <Badge variant="outline">{typeLabel(n.type)}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{n.message}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(n.created_at)}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {unread && (
                        <Button variant="outline" size="sm" onClick={() => handleMarkRead(n.id)}>
                          Marquer lu
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(n.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default NotificationsPage;
