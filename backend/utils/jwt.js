const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';

class JWT {
  static generateToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { 
      expiresIn: JWT_EXPIRES_IN,
      issuer: 'school-erp',
      audience: 'school-erp-users'
    });
  }
  
  static generateRefreshToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { 
      expiresIn: REFRESH_TOKEN_EXPIRES_IN,
      issuer: 'school-erp',
      audience: 'school-erp-users'
    });
  }
  
  static verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET, {
        issuer: 'school-erp',
        audience: 'school-erp-users'
      });
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }
  
  static decodeToken(token) {
    return jwt.decode(token);
  }
  
  static refreshAccessToken(refreshToken) {
    try {
      const decoded = this.verifyToken(refreshToken);
      const { userId, schoolId, role } = decoded;
      
      const newPayload = {
        userId,
        schoolId,
        role
      };
      
      return this.generateToken(newPayload);
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }
}

module.exports = JWT;