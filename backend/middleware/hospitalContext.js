const { getPool } = require('../config/db');

const setHospitalContext = (req, res, next) => {
    const hospitalId = req.headers['x-hospital-id'] || 
                      req.user?.hospitalId || 
                      req.subdomains[0] || 
                      'default';
    try {
        req.db = getPool(hospitalId);
        req.hospitalId = hospitalId;
        next();
    } catch (error) {
        console.error('Error setting hospital context:', error);
        res.status(400).json({ error: 'Invalid hospital context' });
    }
};

module.exports = setHospitalContext;
