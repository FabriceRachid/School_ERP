const axios = require('axios');
const { pool } = require('./backend/models');

async function initialSystemSetup() {
  try {
    console.log('🚀 DÉMARRAGE DE L\'INSTALLATION INITIALE');
    console.log('=====================================\n');
    
    // Vérifier la connexion à la base de données
    console.log('1. Vérification de la base de données...');
    const dbCheck = await pool.query('SELECT version()');
    console.log('✅ Base de données connectée\n');
    
    // Créer l'école par défaut si elle n'existe pas
    console.log('2. Configuration de l\'école...');
    let schoolId;
    const schoolCheck = await pool.query('SELECT id FROM schools LIMIT 1');
    
    if (schoolCheck.rows.length === 0) {
      const schoolResult = await pool.query(`
        INSERT INTO schools (id, name, address, phone, email, status)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id
      `, [
        '00000000-0000-0000-0000-000000000001',
        'École Primaire Centrale',
        '123 Avenue de l\'Éducation, Dakar',
        '+221 33 123 45 67',
        'contact@ecole-centrale.sn',
        'active'
      ]);
      schoolId = schoolResult.rows[0].id;
      console.log('✅ École créée avec succès\n');
    } else {
      schoolId = schoolCheck.rows[0].id;
      console.log('✅ École existante trouvée\n');
    }
    
    // Créer le Super Admin (premier compte du système)
    console.log('3. Création du Super Administrateur...');
    try {
      const superAdminResponse = await axios.post('http://localhost:3001/api/auth/register', {
        school_id: schoolId,
        first_name: 'Super',
        last_name: 'Administrateur',
        email: 'superadmin@ecole-centrale.sn',
        password: 'SuperAdmin2024!',
        role: 'admin'
      });
      console.log('✅ Super Admin créé avec succès\n');
    } catch (error) {
      if (error.response?.data?.message?.includes('Email already registered')) {
        console.log('ℹ️ Super Admin existe déjà\n');
      } else {
        console.log('⚠️ Erreur création Super Admin:', error.response?.data?.message || error.message);
        console.log('Continuing with existing setup...\n');
      }
    }
    
    // Tester la connexion Super Admin
    console.log('4. Test de connexion Super Admin...');
    try {
      const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
        email: 'superadmin@ecole-centrale.sn',
        password: 'SuperAdmin2024!'
      });
      
      if (loginResponse.data.success) {
        console.log('✅ Super Admin connecté avec succès');
        console.log('Token:', loginResponse.data.data.accessToken.substring(0, 30) + '...\n');
      }
    } catch (error) {
      console.log('❌ Échec connexion Super Admin:', error.response?.data?.message || error.message);
    }
    
    // Afficher les instructions finales
    console.log('=====================================');
    console.log('✅ INSTALLATION TERMINÉE AVEC SUCCÈS');
    console.log('=====================================\n');
    
    console.log('🔐 IDENTIFIANTS SUPER ADMIN :');
    console.log('Email: superadmin@ecole-centrale.sn');
    console.log('Mot de passe: SuperAdmin2024!\n');
    
    console.log('📋 PROCÉDURE DE GESTION DES COMPTES :');
    console.log('1. Connectez-vous avec le Super Admin');
    console.log('2. Accédez à l\'interface admin');
    console.log('3. Créez des comptes Admin via "Account Setup"');
    console.log('4. Les Admins peuvent créer Enseignants/Parents/Étudiants\n');
    
    console.log('⚠️ SÉCURITÉ :');
    console.log('- Ne partagez jamais le mot de passe Super Admin');
    console.log('- Changez le mot de passe après la première connexion');
    console.log('- Créez uniquement les comptes nécessaires\n');
    
    console.log('🌐 ACCÈS WEB :');
    console.log('Interface Admin: http://localhost:3000');
    console.log('API Backend: http://localhost:3001\n');
    
  } catch (error) {
    console.error('❌ ÉCHEC DE L\'INSTALLATION:', error.message);
    console.log('\n🔧 SOLUTIONS POSSIBLES :');
    console.log('1. Vérifiez que les serveurs sont démarrés');
    console.log('2. Assurez-vous que la base de données est accessible');
    console.log('3. Vérifiez les ports 3000 et 3001\n');
  } finally {
    await pool.end();
  }
}

// Exécuter l'installation
initialSystemSetup();