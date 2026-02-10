import api from './api';

const authService = {
  login: async (email, password) => {
    try {
      console.log('🔄 Tentative de connexion...');
      const response = await api.post('/auth/login', { email, password });
      
      if (response.data.success && response.data.data.accessToken) {
        // Stocker le token et les informations utilisateur
        localStorage.setItem('token', response.data.data.accessToken);
        localStorage.setItem('refreshToken', response.data.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        
        console.log('✅ Connexion réussie');
        return {
          success: true,
          message: 'Connexion réussie',
          user: response.data.data.user
        };
      } else {
        throw new Error(response.data.message || 'Erreur de connexion');
      }
    } catch (error) {
      console.error('❌ Erreur de connexion:', error);
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Impossible de se connecter au serveur';
      
      return {
        success: false,
        message: errorMessage
      };
    }
  },

  logout: () => {
    console.log('👋 Déconnexion...');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
    console.log('✅ Déconnexion réussie');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    return !!token;
  },

  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) return null;

      const response = await api.post('/auth/refresh-token', { refreshToken });
      if (response.data.success && response.data.data.accessToken) {
        localStorage.setItem('token', response.data.data.accessToken);
        return response.data.data.accessToken;
      }
    } catch (error) {
      console.error('❌ Impossible de rafraîchir le token:', error);
      authService.logout();
    }
    return null;
  }
};

export default authService;
