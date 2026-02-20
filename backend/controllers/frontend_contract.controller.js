const Password = require('../utils/password');
const JWT = require('../utils/jwt');
const User = require('../models/user.model');
const FrontendContractService = require('../services/frontend_contract.service');
const { asyncHandler } = require('../middlewares/error.middleware');
const pool = require('../db');

const mapRoleForWeb = (dbRole, schoolId) => {
  if (dbRole === 'teacher') return 'teacher';
  if (dbRole === 'admin' && schoolId) return 'admin_school';
  if (dbRole === 'admin' && !schoolId) return 'super_admin';
  return dbRole;
};

class FrontendContractController {
  static login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const normalizedEmail = String(email || '').trim().toLowerCase();

    if (!normalizedEmail || !password) {
      return res.status(400).json({ success: false, message: 'Email et mot de passe requis' });
    }

    const user = await User.findByEmail(normalizedEmail);
    if (!user) return res.status(401).json({ success: false, message: 'Identifiants invalides' });

    if (user.status !== 'active') {
      return res.status(403).json({ success: false, message: 'Compte inactif. Contactez l\'administration.' });
    }

    const validPassword = await Password.compare(password, user.password_hash);
    if (!validPassword) return res.status(401).json({ success: false, message: 'Identifiants invalides' });

    const payload = {
      userId: user.id,
      schoolId: user.school_id,
      role: user.role
    };

    const accessToken = JWT.generateToken(payload);
    const refreshToken = JWT.generateRefreshToken(payload);

    return res.json({
      success: true,
      message: 'Connexion réussie',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: `${user.first_name} ${user.last_name}`.trim(),
          role: mapRoleForWeb(user.role, user.school_id),
          schoolId: user.school_id || undefined
        },
        must_change_password: !!user.must_change_password,
        accessToken,
        refreshToken
      }
    });
  });

  static bootstrapWeb = asyncHandler(async (req, res) => {
    const user = await FrontendContractService.getUserContext(req.user.userId);
    if (!user) return res.status(404).json({ success: false, message: 'Utilisateur introuvable' });

    const [bundle, schools] = await Promise.all([
      FrontendContractService.getWebBundle(user),
      FrontendContractService.getSchools()
    ]);

    res.json({
      success: true,
      message: 'Contrat web récupéré',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: `${user.first_name} ${user.last_name}`.trim(),
          role: mapRoleForWeb(user.role, user.school_id),
          schoolId: user.school_id || undefined
        },
        schools,
        ...bundle
      }
    });
  });

  static bootstrapMobile = asyncHandler(async (req, res) => {
    const user = await FrontendContractService.getUserContext(req.user.userId);
    if (!user) return res.status(404).json({ success: false, message: 'Utilisateur introuvable' });

    const bundle = await FrontendContractService.getMobileBundle(user);
    res.json({
      success: true,
      message: 'Contrat mobile récupéré',
      data: bundle
    });
  });

  static updateSchool = asyncHandler(async (req, res) => {
    const isSuperAdmin = req.user.role === 'admin' && !req.user.schoolId;
    if (!isSuperAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Only super admin can update schools'
      });
    }

    const { id } = req.params;
    const { name, address, phone, email, isActive } = req.body;

    const query = `
      UPDATE schools
      SET
        name = COALESCE($2, name),
        address = COALESCE($3, address),
        phone = COALESCE($4, phone),
        email = COALESCE($5, email),
        is_active = COALESCE($6, is_active),
        updated_at = NOW()
      WHERE id = $1
      RETURNING id, name, address, phone, email, is_active
    `;

    const { rows } = await pool.query(query, [id, name || null, address || null, phone || null, email || null, isActive]);
    if (!rows[0]) return res.status(404).json({ success: false, message: 'École introuvable' });

    res.json({
      success: true,
      message: 'École mise à jour',
      data: rows[0]
    });
  });
}

module.exports = FrontendContractController;
