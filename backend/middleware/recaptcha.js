const { verifyRecaptcha } = require('google-recaptcha-v3');

const verifyCaptcha = async (req, res, next) => {
  const { recaptchaToken } = req.body;
  
  if (!recaptchaToken) {
    return res.status(400).json({ error: 'reCAPTCHA token is required.' });
  }

  try {
    const score = await verifyRecaptcha(recaptchaToken);
    
    // Score ranges from 0.0 (likely a bot) to 1.0 (likely a human)
    if (score < 0.5) {
      console.log(`Suspicious reCAPTCHA score: ${score}`);
      return res.status(400).json({ error: 'Failed reCAPTCHA verification.' });
    }
    
    next();
  } catch (err) {
    console.error('reCAPTCHA verification failed:', err);
    return res.status(500).json({ error: 'Failed to verify reCAPTCHA.' });
  }
};

module.exports = verifyCaptcha;
