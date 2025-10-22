const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  try {
    const header = req.header('Authorization');
    const token = header?.startsWith('Bearer ')
      ? header.slice(7)
      : null;

    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'No token, authorization denied' 
      });
    }

    // Use same fallback as token signing to avoid signature mismatch in dev
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    console.log('Decoded token:', decoded);

    // Attach minimal user info from token; resource handlers can load full doc as needed
    req.token = token;
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (err) {
    res.status(401).json({ 
      success: false,
      message: 'Please authenticate' 
    });
  }
};

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ 
            success: false,
            message: 'Admin access required' 
        });
    }
};

const isDoctor = (req, res, next) => {
    if (req.user && req.user.role === 'doctor') {
        next();
    } else {
        res.status(403).json({ 
            success: false,
            message: 'Doctor access required' 
        });
    }
};

const isPatient = (req, res, next) => {
    if (req.user && req.user.role === 'patient') {
        next();
    } else {
        res.status(403).json({ 
            success: false,
            message: 'Patient access required' 
        });
    }
};

// Generic role-based authorize middleware
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || (roles.length && !roles.includes(req.user.role))) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }
        next();
    };
};

module.exports = { 
    auth,
    protect: auth, // alias some routes may use
    authorize,
    isAdmin, 
    isDoctor, 
    isPatient 
};