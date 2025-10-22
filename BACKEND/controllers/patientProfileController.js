const Patient = require('../models/patientModel');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Configure upload directory for prescription files
const UPLOAD_DIR = path.join(__dirname, '../uploads/prescriptions');
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Get patient profile
const getPatientProfile = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.patientId);
        if (!patient) {
            return res.status(404).json({ success: false, message: 'Patient not found' });
        }
        res.status(200).json({ success: true, data: patient });
    } catch (error) {
        console.error('Error fetching patient profile:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Update patient profile
const updatePatientProfile = async (req, res) => {
    try {
        const updates = req.body;
        
        // Remove fields that shouldn't be updated directly
        const disallowedUpdates = ['_id', 'email', 'prescriptions'];
        disallowedUpdates.forEach(field => delete updates[field]);
        
        const patient = await Patient.findByIdAndUpdate(
            req.params.patientId,
            { 
                ...updates, 
                needsProfileCompletion: false,
                lastUpdated: Date.now() 
            },
            { new: true, runValidators: true }
        );
        
        if (!patient) {
            return res.status(404).json({ success: false, message: 'Patient not found' });
        }
        
        res.status(200).json({ success: true, data: patient });
    } catch (error) {
        console.error('Error updating patient profile:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Upload prescription
const uploadPrescription = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }
        
        const { originalname, mimetype, size, filename, path: filePath } = req.file;
        const { doctorName, doctorId, diagnosis, notes } = req.body;
        
        const newPrescription = {
            date: new Date(),
            doctorName,
            doctorId,
            diagnosis,
            notes,
            files: [{
                originalName: originalname,
                fileName: filename,
                filePath: `/prescriptions/${filename}`,
                fileType: mimetype,
                fileSize: size,
                uploadedAt: new Date()
            }]
        };
        
        const patient = await Patient.findByIdAndUpdate(
            req.params.patientId,
            { $push: { prescriptions: newPrescription } },
            { new: true, runValidators: true }
        );
        
        if (!patient) {
            // Clean up the uploaded file if patient not found
            fs.unlinkSync(filePath);
            return res.status(404).json({ success: false, message: 'Patient not found' });
        }
        
        res.status(201).json({ 
            success: true, 
            message: 'Prescription uploaded successfully',
            data: patient.prescriptions[patient.prescriptions.length - 1]
        });
    } catch (error) {
        console.error('Error uploading prescription:', error);
        if (req.file && req.file.path) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Get all prescriptions for a patient
const getPatientPrescriptions = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.patientId, 'prescriptions');
        if (!patient) {
            return res.status(404).json({ success: false, message: 'Patient not found' });
        }
        res.status(200).json({ success: true, data: patient.prescriptions });
    } catch (error) {
        console.error('Error fetching prescriptions:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Get a single prescription
const getPrescription = async (req, res) => {
    try {
        const patient = await Patient.findOne(
            { _id: req.params.patientId, 'prescriptions._id': req.params.prescriptionId },
            { 'prescriptions.$': 1 }
        );
        
        if (!patient || !patient.prescriptions.length) {
            return res.status(404).json({ success: false, message: 'Prescription not found' });
        }
        
        res.status(200).json({ success: true, data: patient.prescriptions[0] });
    } catch (error) {
        console.error('Error fetching prescription:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Download prescription file
const downloadPrescriptionFile = async (req, res) => {
    try {
        const patient = await Patient.findOne({
            _id: req.params.patientId,
            'prescriptions._id': req.params.prescriptionId,
            'prescriptions.files._id': req.params.fileId
        }, {
            'prescriptions.$': 1
        });
        
        if (!patient || !patient.prescriptions.length) {
            return res.status(404).json({ success: false, message: 'File not found' });
        }
        
        const prescription = patient.prescriptions[0];
        const file = prescription.files.id(req.params.fileId);
        
        if (!file) {
            return res.status(404).json({ success: false, message: 'File not found' });
        }
        
        const filePath = path.join(__dirname, '..', 'uploads', file.filePath);
        
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ success: false, message: 'File not found on server' });
        }
        
        res.download(filePath, file.originalName);
    } catch (error) {
        console.error('Error downloading file:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = {
    getPatientProfile,
    updatePatientProfile,
    uploadPrescription,
    getPatientPrescriptions,
    getPrescription,
    downloadPrescriptionFile
};
