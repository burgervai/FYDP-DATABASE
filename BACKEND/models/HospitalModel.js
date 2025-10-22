const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Hospital name is required'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Hospital address is required'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Hospital phone number is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Hospital email is required'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
  },
  website: {
    type: String,
    trim: true
  },
  doctorsUrl: {
    type: String,
    trim: true
  },
  appointmentUrl: {
    type: String,
    trim: true
  },
  imageUrl: {
    type: String,
    default: '/download.jpg'
  },
  specialties: [{
    type: String,
    trim: true
  }],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  location: {
    type: {
      type: String,
      default: 'Point',
      enum: ['Point']
    },
    coordinates: [Number], // [longitude, latitude]
    address: String,
    description: String
  },
  description: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for geospatial queries
hospitalSchema.index({ location: '2dsphere' });

const Hospital = mongoose.model('Hospital', hospitalSchema);

module.exports = Hospital;
