import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Eye, EyeOff } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(email, password);
    if (success) {
      toast({ title: "Connexion réussie", description: "Bienvenue sur NexaCampus ERP" });
      navigate("/");
    } else {
      toast({ title: "Erreur", description: "Email ou mot de passe incorrect", variant: "destructive" });
    }
    setLoading(false);
  };

  const demoAccounts = [
    { label: "Super Admin", email: "superadmin@erp.edu", password: "admin123" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-primary-foreground mb-4">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-display font-bold text-foreground">NexaCampus ERP</h1>
          <p className="text-muted-foreground mt-1">Gestion scolaire multi-écoles</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-display">Connexion</CardTitle>
            <CardDescription>Entrez vos identifiants pour accéder à votre espace</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="votreemail@ecole.edu" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Connexion..." : "Se connecter"}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t">
              <p className="text-xs text-muted-foreground mb-3 font-medium">Compte de démonstration (Super Admin) :</p>
              <div className="space-y-2">
                {demoAccounts.map(acc => (
                  <button
                    key={acc.email}
                    type="button"
                    className="w-full text-left px-3 py-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-sm"
                    onClick={() => { setEmail(acc.email); setPassword(acc.password); }}
                  >
                    <span className="font-medium text-foreground">{acc.label}</span>
                    <span className="block text-xs text-muted-foreground">{acc.email}</span>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
