import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Signup = () => {
  const { loading } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'teacher'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [schools, setSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState('');

  // Fetch schools when component mounts
  useState(() => {
    const fetchSchools = async () => {
      try {
        const response = await api.get('/schools');
        if (response.data.success) {
          setSchools(response.data.data);
          if (response.data.data.length > 0) {
            setSelectedSchool(response.data.data[0].id);
          }
        }
      } catch (error) {
        console.error('Error fetching schools:', error);
      }
    };
    fetchSchools();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Prénom requis';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Nom requis';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }
    
    if (!formData.password) {
      newErrors.password = 'Mot de passe requis';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }
    
    if (!selectedSchool) {
      newErrors.school = 'Veuillez sélectionner une école';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const signupData = {
        school_id: selectedSchool,
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        email: formData.email,
        password: formData.password,
        role: formData.role
      };
      
      const response = await api.post('/auth/register', signupData);
      
      if (response.data.success) {
        // Auto-login after successful registration
        const loginResponse = await api.post('/auth/login', {
          email: formData.email,
          password: formData.password
        });
        
        if (loginResponse.data.success) {
          localStorage.setItem('token', loginResponse.data.data.accessToken);
          localStorage.setItem('refreshToken', loginResponse.data.data.refreshToken);
          localStorage.setItem('user', JSON.stringify(loginResponse.data.data.user));
          
          // Redirect based on role
          const redirectPath = formData.role === 'admin' 
            ? '/admin/dashboard' 
            : '/teacher/dashboard';
          
          navigate(redirectPath);
        }
      } else {
        setErrors({ general: response.data.message });
      }
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Une erreur inattendue est survenue';
      setErrors({ general: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e293b 0%, #581c87 50%, #1e293b 100%)',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '1200px'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', color: 'white', marginBottom: '40px' }}>
          <div style={{
            width: '96px',
            height: '96px',
            background: 'linear-gradient(135deg, #60a5fa 0%, #9333ea 100%)',
            borderRadius: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
          }}>
            <svg style={{ width: '48px', height: '48px', fill: 'white' }} viewBox="0 0 24 24">
              <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
            </svg>
          </div>
          <h1 style={{
            fontSize: '48px',
            fontWeight: 'bold',
            marginBottom: '16px',
            background: 'linear-gradient(135deg, #60a5fa 0%, #9333ea 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            School ERP
          </h1>
          <p style={{ fontSize: '20px', color: '#cbd5e1', marginBottom: '32px' }}>
            Création de compte administrateur/enseignant
          </p>
        </div>

        {/* Signup Form */}
        <div style={{
          display: 'flex',
          justifyContent: 'center'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '40px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            width: '100%',
            maxWidth: '500px'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: 'white', marginBottom: '8px' }}>
                Créer un compte
              </h2>
              <p style={{ color: '#cbd5e1' }}>Espace administrateur/enseignant</p>
            </div>

            {errors.general && (
              <div style={{
                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid #ef4444',
                color: '#fecaca',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                ❌ {errors.general}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    color: 'white', 
                    marginBottom: '8px', 
                    fontWeight: '500' 
                  }}>
                    Prénom
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Votre prénom"
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      borderRadius: '12px',
                      border: errors.firstName ? '2px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.2)',
                      background: 'rgba(255, 255, 255, 0.05)',
                      color: 'white',
                      fontSize: '16px',
                      backdropFilter: 'blur(10px)'
                    }}
                  />
                  {errors.firstName && (
                    <div style={{ 
                      color: '#ef4444', 
                      fontSize: '14px', 
                      marginTop: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <span>⚠️</span> {errors.firstName}
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    color: 'white', 
                    marginBottom: '8px', 
                    fontWeight: '500' 
                  }}>
                    Nom
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Votre nom"
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      borderRadius: '12px',
                      border: errors.lastName ? '2px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.2)',
                      background: 'rgba(255, 255, 255, 0.05)',
                      color: 'white',
                      fontSize: '16px',
                      backdropFilter: 'blur(10px)'
                    }}
                  />
                  {errors.lastName && (
                    <div style={{ 
                      color: '#ef4444', 
                      fontSize: '14px', 
                      marginTop: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <span>⚠️</span> {errors.lastName}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  color: 'white', 
                  marginBottom: '8px', 
                  fontWeight: '500' 
                }}>
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="votre@email.com"
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: '12px',
                    border: errors.email ? '2px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: 'white',
                    fontSize: '16px',
                    backdropFilter: 'blur(10px)'
                  }}
                />
                {errors.email && (
                  <div style={{ 
                    color: '#ef4444', 
                    fontSize: '14px', 
                    marginTop: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <span>⚠️</span> {errors.email}
                  </div>
                )}
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  color: 'white', 
                  marginBottom: '8px', 
                  fontWeight: '500' 
                }}>
                  École
                </label>
                <select
                  value={selectedSchool}
                  onChange={(e) => setSelectedSchool(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: '12px',
                    border: errors.school ? '2px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: 'white',
                    fontSize: '16px',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <option value="">Sélectionnez une école</option>
                  {schools.map(school => (
                    <option key={school.id} value={school.id}>
                      {school.name}
                    </option>
                  ))}
                </select>
                {errors.school && (
                  <div style={{ 
                    color: '#ef4444', 
                    fontSize: '14px', 
                    marginTop: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <span>⚠️</span> {errors.school}
                  </div>
                )}
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  color: 'white', 
                  marginBottom: '8px', 
                  fontWeight: '500' 
                }}>
                  Rôle
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: 'white',
                    fontSize: '16px',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <option value="teacher">Enseignant</option>
                  <option value="admin">Administrateur</option>
                </select>
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  color: 'white', 
                  marginBottom: '8px', 
                  fontWeight: '500' 
                }}>
                  Mot de passe
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: '12px',
                    border: errors.password ? '2px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: 'white',
                    fontSize: '16px',
                    backdropFilter: 'blur(10px)'
                  }}
                />
                {errors.password && (
                  <div style={{ 
                    color: '#ef4444', 
                    fontSize: '14px', 
                    marginTop: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <span>⚠️</span> {errors.password}
                  </div>
                )}
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  color: 'white', 
                  marginBottom: '8px', 
                  fontWeight: '500' 
                }}>
                  Confirmer le mot de passe
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: '12px',
                    border: errors.confirmPassword ? '2px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: 'white',
                    fontSize: '16px',
                    backdropFilter: 'blur(10px)'
                  }}
                />
                {errors.confirmPassword && (
                  <div style={{ 
                    color: '#ef4444', 
                    fontSize: '14px', 
                    marginTop: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <span>⚠️</span> {errors.confirmPassword}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting || loading}
                style={{
                  width: '100%',
                  background: isSubmitting || loading 
                    ? 'rgba(255, 255, 255, 0.2)' 
                    : 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '16px 32px',
                  borderRadius: '16px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: isSubmitting || loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 10px 25px rgba(37, 99, 235, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px'
                }}
              >
                {(isSubmitting || loading) ? (
                  <>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      border: '2px solid transparent',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                    <style>{`
                      @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                      }
                    `}</style>
                    Création en cours...
                  </>
                ) : (
                  <>
                    <svg style={{ width: '20px', height: '20px', fill: 'white' }} viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                    </svg>
                    Créer le compte
                  </>
                )}
              </button>
            </form>

            <div style={{ 
              textAlign: 'center', 
              marginTop: '24px', 
              color: '#94a3b8',
              fontSize: '14px'
            }}>
              <p>Déjà un compte ? <a href="/login" style={{ color: '#60a5fa' }}>Se connecter</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;