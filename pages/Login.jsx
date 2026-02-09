import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Lock, Mail } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (error) {
      alert('Identifiants incorrects');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-slate-800">Bienvenue</h1>
          <p className="text-slate-500 mt-2">Connectez-vous à votre espace ERP</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-slate-400" size={20} />
              <input 
                type="email" 
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Mot de passe</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-400" size={20} />
              <input 
                type="password" 
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
