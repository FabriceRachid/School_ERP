import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard, School, Users, GraduationCap, BookOpen, Calendar,
  CreditCard, FileText, BarChart3, ClipboardList, UserCheck, Settings, Bell, LogOut, Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const superAdminItems = [
  { title: "Dashboard", url: "/super-admin", icon: LayoutDashboard },
  { title: "Écoles", url: "/super-admin/schools", icon: School },
  { title: "Supervision", url: "/super-admin/overview", icon: BarChart3 },
  { title: "Notifications", url: "/super-admin/notifications", icon: Bell },
];

const adminSchoolItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Gestion École", url: "/admin/students", icon: Users },
  { title: "Emploi du temps", url: "/admin/timetable", icon: Calendar },
  { title: "Évaluations", url: "/admin/bulletins", icon: ClipboardList },
  { title: "Finances", url: "/admin/payments", icon: CreditCard },
  { title: "Années Académiques", url: "/admin/academic-years", icon: Award },
  { title: "Rapports", url: "/admin/reports", icon: BarChart3 },
  { title: "Configuration", url: "/admin/settings", icon: Settings },
  { title: "Notifications", url: "/admin/notifications", icon: Bell },
];

const teacherItems = [
  { title: "Dashboard", url: "/teacher", icon: LayoutDashboard },
  { title: "Mes Classes", url: "/teacher/classes", icon: BookOpen },
  { title: "Évaluations", url: "/teacher/grades", icon: ClipboardList },
  { title: "Emploi du temps", url: "/teacher/timetable", icon: Calendar },
  { title: "Notifications", url: "/teacher/notifications", icon: Bell },
];

export function AppSidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const items = user.role === "super_admin" ? superAdminItems
    : user.role === "admin_school" ? adminSchoolItems
    : teacherItems;

  const roleLabel = user.role === "super_admin" ? "Super Admin"
    : user.role === "admin_school" ? "Admin École"
    : "Enseignant";

  return (
    <Sidebar className="border-r-0">
      <div className="p-4 flex items-center gap-3 border-b border-sidebar-border">
        <div className="w-9 h-9 rounded-xl bg-sidebar-primary flex items-center justify-center">
          <GraduationCap className="w-5 h-5 text-sidebar-primary-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-display font-bold text-sm text-sidebar-foreground truncate">NexaCampus ERP</p>
          <p className="text-xs text-sidebar-foreground/60">{roleLabel}</p>
        </div>
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/50 text-xs uppercase tracking-wider">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map(item => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/super-admin" || item.url === "/admin" || item.url === "/teacher"}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    >
                      <item.icon className="w-4 h-4 shrink-0" />
                      <span className="text-sm">{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-sidebar-primary/20 flex items-center justify-center text-xs font-bold text-sidebar-primary">
            {user.name.split(" ").map(n => n[0]).join("")}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">{user.name}</p>
            <p className="text-xs text-sidebar-foreground/50 truncate">{user.email}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="w-full justify-start text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent" onClick={logout}>
          <LogOut className="w-4 h-4 mr-2" />
          Déconnexion
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}


