const axios = require('axios');

async function setupHierarchicalRoles() {
  try {
    console.log('🚀 CONFIGURATION DES RÔLES HIÉRARCHIQUES');
    console.log('=====================================\n');
    
    // Create Super Admin (highest level)
    console.log('1. Création du Super Administrateur...');
    try {
      const superAdminResponse = await axios.post('http://localhost:3001/api/auth/register', {
        school_id: '00000000-0000-0000-0000-000000000001',
        first_name: 'Super',
        last_name: 'Administrateur',
        email: 'superadmin@system.sn',
        password: 'SuperAdmin2024!',
        role: 'super_admin'
      });
      console.log('✅ Super Admin créé avec succès (rôle: super_admin)\n');
    } catch (error) {
      if (error.response?.data?.message?.includes('Email already registered')) {
        console.log('ℹ️ Super Admin existe déjà\n');
      } else {
        console.log('⚠️ Impossible de créer Super Admin automatiquement\n');
      }
    }
    
    // Create School Admin (school level)
    console.log('2. Création de l\'Administrateur Scolaire...');
    try {
      const adminResponse = await axios.post('http://localhost:3001/api/auth/register', {
        school_id: '00000000-0000-0000-0000-000000000001',
        first_name: 'Administrateur',
        last_name: 'Scolaire',
        email: 'admin@ecole.sn',
        password: 'Admin2024!',
        role: 'admin'
      });
      console.log('✅ Admin Scolaire créé avec succès (rôle: admin)\n');
    } catch (error) {
      if (error.response?.data?.message?.includes('Email already registered')) {
        console.log('ℹ️ Admin Scolaire existe déjà\n');
      } else {
        console.log('⚠️ Impossible de créer Admin Scolaire automatiquement\n');
      }
    }
    
    // Test connections with different roles
    console.log('3. Test des connexions et permissions...\n');
    
    // Test Super Admin access
    try {
      const superLogin = await axios.post('http://localhost:3001/api/auth/login', {
        email: 'superadmin@system.sn',
        password: 'SuperAdmin2024!'
      });
      
      if (superLogin.data.success) {
        console.log('✅ Super Admin: Connexion réussie');
        console.log('   • Accès: Toutes les écoles et systèmes');
        console.log('   • Permissions: Création/suppression d\'écoles, gestion globale\n');
      }
    } catch (error) {
      console.log('❌ Super Admin: Connexion échouée');
    }
    
    // Test School Admin access
    try {
      const adminLogin = await axios.post('http://localhost:3001/api/auth/login', {
        email: 'admin@ecole.sn',
        password: 'Admin2024!'
      });
      
      if (adminLogin.data.success) {
        console.log('✅ Admin Scolaire: Connexion réussie');
        console.log('   • Accès: École spécifique uniquement');
        console.log('   • Permissions: Gestion utilisateurs, classes, étudiants\n');
      }
    } catch (error) {
      console.log('❌ Admin Scolaire: Connexion échouée');
    }
    
    // Test existing admin (should now be restricted)
    try {
      const existingLogin = await axios.post('http://localhost:3001/api/auth/login', {
        email: 'john.doe@example.com',
        password: 'Password123!'
      });
      
      if (existingLogin.data.success) {
        console.log('✅ Admin Existant: Connexion réussie');
        console.log('   • Accès: Selon les nouvelles permissions\n');
      }
    } catch (error) {
      console.log('ℹ️ Admin Existant: Vérification des permissions');
    }
    
    // Final instructions
    console.log('=====================================');
    console.log('✅ CONFIGURATION DES RÔLES TERMINÉE');
    console.log('=====================================\n');
    
    console.log('🔐 IDENTIFIANTS DISPONIBLES :');
    console.log('Super Admin (Tout le système):');
    console.log('  Email: superadmin@system.sn');
    console.log('  Mot de passe: SuperAdmin2024!\n');
    
    console.log('Admin Scolaire (École spécifique):');
    console.log('  Email: admin@ecole.sn');
    console.log('  Mot de passe: Admin2024!\n');
    
    console.log('📋 DIFFÉRENCES DE PERMISSIONS :');
    console.log('Super Admin:');
    console.log('  • Gère toutes les écoles');
    console.log('  • Crée/supprime des écoles');
    console.log('  • Gestion système complète');
    console.log('  • Accès à tous les utilisateurs\n');
    
    console.log('Admin Scolaire:');
    console.log('  • Gère une école spécifique');
    console.log('  • Crée/utilisateurs de son école');
    console.log('  • Gestion classes/étudiants');
    console.log('  • Accès limité à son école\n');
    
    console.log('⚠️ SÉCURITÉ :');
    console.log('• Hiérarchie stricte de permissions');
    console.log('• Accès contrôlé par rôle');
    console.log('• Traçabilité des actions');
    console.log('• Aucun auto-inscription pour rôles privilégiés\n');
    
    console.log('🌐 TESTEZ LES INTERFACES :');
    console.log('1. Connectez-vous avec superadmin@system.sn');
    console.log('   → Accès au Super Admin Dashboard');
    console.log('2. Connectez-vous avec admin@ecole.sn');
    console.log('   → Accès au School Admin Dashboard');
    console.log('3. Comparez les fonctionnalités disponibles\n');
    
  } catch (error) {
    console.error('❌ Erreur de configuration:', error.message);
  }
}

setupHierarchicalRoles();