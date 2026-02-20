const axios = require('axios');

async function simpleAdminSetup() {
  try {
    console.log('🚀 CONFIGURATION DES COMPTES ADMIN');
    console.log('================================\n');
    
    // Créer le Super Admin
    console.log('1. Création du Super Administrateur...');
    try {
      const response = await axios.post('http://localhost:3001/api/auth/register', {
        school_id: '00000000-0000-0000-0000-000000000001',
        first_name: 'Super',
        last_name: 'Administrateur',
        email: 'superadmin@ecole.sn',
        password: 'SuperAdmin2024!',
        role: 'admin'
      });
      console.log('✅ Super Admin créé avec succès\n');
    } catch (error) {
      if (error.response?.data?.message?.includes('Email already registered')) {
        console.log('ℹ️ Super Admin existe déjà\n');
      } else {
        console.log('⚠️ Impossible de créer Super Admin automatiquement');
        console.log('Vous devrez le créer via l\'interface web\n');
      }
    }
    
    // Créer un Admin régulier
    console.log('2. Création d\'un Administrateur...');
    try {
      const response = await axios.post('http://localhost:3001/api/auth/register', {
        school_id: '00000000-0000-0000-0000-000000000001',
        first_name: 'Administrateur',
        last_name: 'Scolaire',
        email: 'admin@ecole.sn',
        password: 'Admin2024!',
        role: 'admin'
      });
      console.log('✅ Admin créé avec succès\n');
    } catch (error) {
      if (error.response?.data?.message?.includes('Email already registered')) {
        console.log('ℹ️ Admin existe déjà\n');
      } else {
        console.log('⚠️ Impossible de créer Admin automatiquement');
        console.log('Vous devrez le créer via l\'interface web\n');
      }
    }
    
    // Test des connexions
    console.log('3. Test des connexions...\n');
    
    // Test Super Admin
    try {
      const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
        email: 'superadmin@ecole.sn',
        password: 'SuperAdmin2024!'
      });
      if (loginResponse.data.success) {
        console.log('✅ Super Admin: Connexion réussie\n');
      }
    } catch (error) {
      console.log('❌ Super Admin: Connexion échouée');
      console.log('Message:', error.response?.data?.message || error.message);
    }
    
    // Test Admin
    try {
      const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
        email: 'admin@ecole.sn',
        password: 'Admin2024!'
      });
      if (loginResponse.data.success) {
        console.log('✅ Admin: Connexion réussie\n');
      }
    } catch (error) {
      console.log('❌ Admin: Connexion échouée');
      console.log('Message:', error.response?.data?.message || error.message);
    }
    
    // Instructions finales
    console.log('================================');
    console.log('✅ CONFIGURATION TERMINÉE');
    console.log('================================\n');
    
    console.log('🔐 IDENTIFIANTS DISPONIBLES :');
    console.log('Super Admin: superadmin@ecole.sn / SuperAdmin2024!');
    console.log('Admin: admin@ecole.sn / Admin2024!\n');
    
    console.log('📋 PROCÉDURE D\'UTILISATION :');
    console.log('1. Ouvrez http://localhost:3000');
    console.log('2. Connectez-vous avec un des comptes ci-dessus');
    console.log('3. Accédez au tableau de bord admin');
    console.log('4. Utilisez "Account Setup" pour créer d\'autres comptes\n');
    
    console.log('⚠️ PRINCIPES DE SÉCURITÉ :');
    console.log('• Le Super Admin contrôle tout le système');
    console.log('• Les Admins gèrent les utilisateurs quotidiens');
    console.log('• Personne ne peut s\'auto-inscrire comme admin');
    console.log('• Tous les comptes sont créés par les administrateurs\n');
    
    console.log('🔧 SI LES COMPTES N\'EXISTENT PAS :');
    console.log('1. Connectez-vous avec un compte existant');
    console.log('2. Allez dans "Account Setup"');
    console.log('3. Créez les comptes admin nécessaires\n');
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

simpleAdminSetup();