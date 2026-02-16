// Enhanced Admin Setup Controller with ALL Mandatory Fields Validation
const AdminSetup = require('../models/admin_setup.model');
const ParentStudentLink = require('../models/parent_student_link.model');
const User = require('../models/user.model');
const Student = require('../models/student.model');
const { asyncHandler } = require('../middlewares/error.middleware');
const { roleMiddleware } = require('../middlewares/hierarchical-role.middleware');

class AdminSetupController {
  // Admin creates parent account (pre-activation) - ALL FIELDS MANDATORY
  static createParentAccount = [
    roleMiddleware('admin'),
    asyncHandler(async (req, res) => {
      const { first_name, last_name, email, phone, address } = req.body;
      
      // Validate ALL fields are present
      if (!first_name || !last_name || !email || !phone || !address) {
        return res.status(400).json({
          success: false,
          message: 'Tous les champs sont obligatoires: first_name, last_name, email, phone, address'
        });
      }
      
      try {
        const parent = await AdminSetup.createParentAccount(
          req.user.schoolId,
          first_name,
          last_name,
          email,
          phone,
          address
        );
        
        res.status(201).json({
          success: true,
          message: 'Compte parent créé avec succès. Le parent doit activer son compte avec le code d\'invitation.',
          data: {
            parent_id: parent.id,
            email: parent.email,
            name: `${parent.first_name} ${parent.last_name}`,
            phone: parent.phone,
            address: parent.address
          }
        });
      } catch (error) {
        if (error.message === 'Email already registered') {
          return res.status(409).json({
            success: false,
            message: 'Cet email est déjà utilisé'
          });
        }
        throw error;
      }
    })
  ];

  // Admin creates student account with temporary password - ALL FIELDS MANDATORY
  static createStudentAccount = [
    roleMiddleware('admin'),
    asyncHandler(async (req, res) => {
      const { 
        first_name, last_name, email, phone, address, date_of_birth,
        class_name, parent_name, parent_phone, gender, medical_info,
        emergency_contact_name, emergency_contact_phone 
      } = req.body;
      
      // Validate ALL mandatory fields
      const mandatoryFields = {
        first_name: 'Prénom',
        last_name: 'Nom',
        email: 'Email',
        phone: 'Téléphone',
        address: 'Adresse',
        date_of_birth: 'Date de naissance',
        class_name: 'Nom de la classe',
        parent_name: 'Nom du parent',
        parent_phone: 'Téléphone du parent',
        gender: 'Genre',
        medical_info: 'Informations médicales',
        emergency_contact_name: 'Nom du contact d\'urgence',
        emergency_contact_phone: 'Téléphone du contact d\'urgence'
      };
      
      const missingFields = [];
      Object.keys(mandatoryFields).forEach(field => {
        if (!req.body[field] || req.body[field].trim() === '') {
          missingFields.push(mandatoryFields[field]);
        }
      });
      
      if (missingFields.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Champs obligatoires manquants: ${missingFields.join(', ')}`
        });
      }
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Format d\'email invalide'
        });
      }
      
      // Validate phone format (Senegal format)
      const phoneRegex = /^\+221\s\d{2}\s\d{3}\s\d{2}\s\d{2}$/;
      if (!phoneRegex.test(phone)) {
        return res.status(400).json({
          success: false,
          message: 'Format de téléphone invalide. Utilisez: +221 XX XXX XX XX'
        });
      }
      
      // Validate gender
      const validGenders = ['male', 'female', 'other'];
      if (!validGenders.includes(gender)) {
        return res.status(400).json({
          success: false,
          message: 'Genre invalide. Choisissez entre: male, female, other'
        });
      }
      
      try {
        const result = await AdminSetup.createStudentAccount(
          req.user.schoolId,
          first_name,
          last_name,
          email,
          phone,
          address,
          date_of_birth,
          class_name,
          parent_name,
          parent_phone,
          gender,
          medical_info,
          emergency_contact_name,
          emergency_contact_phone
        );
        
        res.status(201).json({
          success: true,
          message: 'Compte étudiant créé avec succès',
          data: result
        });
      } catch (error) {
        if (error.message === 'Email already registered') {
          return res.status(409).json({
            success: false,
            message: 'Cet email est déjà utilisé'
          });
        }
        throw error;
      }
    })
  ];

  // Admin creates teacher account - ALL FIELDS MANDATORY
  static createTeacherAccount = [
    roleMiddleware('admin'),
    asyncHandler(async (req, res) => {
      const { 
        first_name, last_name, email, phone, address, date_of_birth,
        specialization, hire_date, salary 
      } = req.body;
      
      // Validate ALL mandatory fields
      const mandatoryFields = {
        first_name: 'Prénom',
        last_name: 'Nom',
        email: 'Email',
        phone: 'Téléphone',
        address: 'Adresse',
        date_of_birth: 'Date de naissance',
        specialization: 'Spécialisation',
        hire_date: 'Date d\'embauche',
        salary: 'Salaire'
      };
      
      const missingFields = [];
      Object.keys(mandatoryFields).forEach(field => {
        if (!req.body[field] || req.body[field].trim() === '') {
          missingFields.push(mandatoryFields[field]);
        }
      });
      
      if (missingFields.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Champs obligatoires manquants: ${missingFields.join(', ')}`
        });
      }
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Format d\'email invalide'
        });
      }
      
      // Validate salary is positive number
      const salaryValue = parseFloat(salary);
      if (isNaN(salaryValue) || salaryValue <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Le salaire doit être un nombre positif'
        });
      }
      
      try {
        const result = await AdminSetup.createTeacherAccount(
          req.user.schoolId,
          first_name,
          last_name,
          email,
          phone,
          address,
          date_of_birth,
          specialization,
          hire_date,
          salaryValue
        );
        
        res.status(201).json({
          success: true,
          message: 'Compte enseignant créé avec succès',
          data: result
        });
      } catch (error) {
        if (error.message === 'Email already registered') {
          return res.status(409).json({
            success: false,
            message: 'Cet email est déjà utilisé'
          });
        }
        throw error;
      }
    })
  ];

  // Admin links parent to student - ALL FIELDS MANDATORY
  static linkParentToStudent = [
    roleMiddleware('admin'),
    asyncHandler(async (req, res) => {
      const { parent_id, student_id, relationship, is_primary } = req.body;
      
      // Validate ALL fields are present
      if (!parent_id || !student_id || !relationship) {
        return res.status(400).json({
          success: false,
          message: 'parent_id, student_id, et relationship sont obligatoires'
        });
      }
      
      // Validate relationship
      const validRelationships = ['parent', 'mother', 'father', 'guardian'];
      if (!validRelationships.includes(relationship)) {
        return res.status(400).json({
          success: false,
          message: `Relation invalide. Choisissez entre: ${validRelationships.join(', ')}`
        });
      }
      
      try {
        const link = await AdminSetup.linkParentToStudent(
          parent_id,
          student_id,
          relationship,
          is_primary === true
        );
        
        res.status(201).json({
          success: true,
          message: 'Liaison parent-étudiant créée avec succès',
          data: link
        });
      } catch (error) {
        if (error.message === 'Invalid parent user') {
          return res.status(400).json({
            success: false,
            message: 'Parent invalide'
          });
        }
        if (error.message === 'Invalid student') {
          return res.status(400).json({
            success: false,
            message: 'Étudiant invalide'
          });
        }
        if (error.message === 'Parent-student link already exists') {
          return res.status(409).json({
            success: false,
            message: 'Cette liaison existe déjà'
          });
        }
        throw error;
      }
    })
  ];

  // Get all unactivated parent accounts for school
  static getUnactivatedParents = [
    roleMiddleware('admin'),
    asyncHandler(async (req, res) => {
      const parents = await AdminSetup.getUnactivatedParents(req.user.schoolId);
      
      res.json({
        success: true,
        message: 'Parents non activés récupérés avec succès',
        data: parents,
        count: parents.length
      });
    })
  ];

  // Get all students without parent links
  static getStudentsWithoutParents = [
    roleMiddleware('admin'),
    asyncHandler(async (req, res) => {
      const students = await AdminSetup.getStudentsWithoutParents(req.user.schoolId);
      
      res.json({
        success: true,
        message: 'Étudiants sans parents récupérés avec succès',
        data: students,
        count: students.length
      });
    })
  ];
}

module.exports = AdminSetupController;