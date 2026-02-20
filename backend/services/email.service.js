const axios = require('axios');

class EmailService {
  static async sendAccountCredentials({
    to,
    firstName,
    lastName,
    role,
    temporaryPassword,
    appUrl
  }) {
    const provider = (process.env.EMAIL_PROVIDER || 'console').toLowerCase();
    const fromEmail = process.env.EMAIL_FROM || 'no-reply@school-erp.local';
    const fullName = `${firstName || ''} ${lastName || ''}`.trim();
    const loginUrl = appUrl || process.env.APP_LOGIN_URL || 'http://localhost:5173/login';

    const subject = 'Vos identifiants School ERP';
    const text = [
      `Bonjour ${fullName || 'Utilisateur'},`,
      '',
      `Votre compte ${role} a ete cree.`,
      `Email: ${to}`,
      `Mot de passe temporaire: ${temporaryPassword}`,
      '',
      `Connectez-vous ici: ${loginUrl}`,
      "Vous devrez changer ce mot de passe lors de votre premiere connexion."
    ].join('\n');

    if (provider === 'brevo') {
      const apiKey = process.env.BREVO_API_KEY;
      if (!apiKey) {
        throw new Error('BREVO_API_KEY is missing');
      }

      await axios.post(
        'https://api.brevo.com/v3/smtp/email',
        {
          sender: { email: fromEmail, name: 'School ERP' },
          to: [{ email: to, name: fullName || to }],
          subject,
          textContent: text
        },
        {
          headers: {
            accept: 'application/json',
            'api-key': apiKey,
            'content-type': 'application/json'
          },
          timeout: 10000
        }
      );

      return { delivered: true, provider };
    }

    console.log('[EMAIL MOCK]', {
      provider,
      from: fromEmail,
      to,
      subject,
      text
    });

    return { delivered: true, provider: 'console' };
  }
}

module.exports = EmailService;
