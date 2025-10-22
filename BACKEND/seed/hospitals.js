const mongoose = require('mongoose');
const colors = require('colors');
const connectDB = require('../config/db');
const Hospital = require('../models/HospitalModel');

// Connect to DB using the existing connection from db.js
connectDB().catch(err => {
  console.error('Database connection error:'.red, err.message);
  process.exit(1);
});

// Sample hospital data
const hospitals = [
  {
    name: 'Labaid Hospital',
    website: 'https://labaid.com.bd/',
    address: 'House- 01, Road-04, Dhanmondi, Dhaka 1205, Bangladesh',
    phone: '+880258610793',
    email: 'info@labaidgroup.com',
    imageUrl: '/download.jpg',
    doctorsUrl: 'https://labaid.com.bd/en/doctors',
    appointmentUrl: 'https://appointment.labaid.com.bd/',
    specialties: ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics'],
    rating: 4.5,
    reviewCount: 128,
    location: {
      type: 'Point',
      coordinates: [90.3799, 23.7465],
      city: 'Dhaka',
      country: 'Bangladesh'
    },
    description: 'A leading hospital providing comprehensive healthcare services.'
  },
  {
    name: 'Popular Hospital',
    website: 'https://www.popular-hospital.com/',
    address: 'House: 08, Road: 02, Dhanmondi, Dhaka-1205, Bangladesh',
    phone: '09613787800',
    email: 'info@popular-hospital.com',
    imageUrl: '/download.jpg',
    doctorsUrl: 'https://www.popular-hospital.com/package',
    appointmentUrl: 'https://www.popular-hospital.com/contact-us',
    specialties: ['General Surgery', 'Cardiology', 'Neurology', 'Pediatrics'],
    rating: 4.3,
    reviewCount: 95,
    location: {
      type: 'Point',
      coordinates: [90.3700, 23.7400],
      city: 'Dhaka',
      country: 'Bangladesh'
    },
    description: 'Providing quality healthcare services with modern facilities.'
  },
  {
    name: 'Square Hospital',
    website: 'https://www.squarehospital.com/',
    address: '18/F, Bir Uttam Qazi Nuruzzaman Sarak, West Panthapath, Dhaka 1205',
    phone: '10616',
    email: 'info@squarehospital.com',
    imageUrl: '/download.jpg',
    doctorsUrl: 'https://www.squarehospital.com/doctors',
    appointmentUrl: 'https://www.squarehospital.com/doctors',
    specialties: ['Cardiac Surgery', 'Neurosurgery', 'Oncology', 'Pediatrics'],
    rating: 4.7,
    reviewCount: 215,
    location: {
      type: 'Point',
      coordinates: [90.3851, 23.7513],
      city: 'Dhaka',
      country: 'Bangladesh'
    },
    description: 'A state-of-the-art hospital with international standard healthcare services.'
  },
  {
    name: 'Evercare Hospital',
    website: 'https://www.evercarebd.com/en/dhaka',
    address: 'Plot # 81, Block-E, Bashundhara R/A, Dhaka 1229, Bangladesh',
    phone: '10678',
    email: 'info@evercarebd.com',
    imageUrl: '/download.jpg',
    doctorsUrl: 'https://www.evercarebd.com/en/dhaka/doctors/all',
    appointmentUrl: 'https://www.evercarebd.com/en/dhaka/appointment',
    specialties: ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics'],
    rating: 4.6,
    reviewCount: 187,
    location: {
      type: 'Point',
      coordinates: [90.4272, 23.8159],
      city: 'Dhaka',
      country: 'Bangladesh'
    },
    description: 'International standard healthcare services with modern facilities.'
  },
  {
    name: 'BRB Hospital',
    website: 'https://www.brbhospital.com/',
    address: '77 Panthapath, Dhaka 1215',
    phone: '10647',
    email: 'info@brbhospital.com',
    imageUrl: '/download.jpg',
    doctorsUrl: 'https://brbhospital.com/doctors',
    appointmentUrl: 'https://brbhospital.com/book-appointment',
    specialties: ['Cardiology', 'Neurology', 'General Surgery', 'Pediatrics'],
    rating: 4.4,
    reviewCount: 156,
    location: {
      type: 'Point',
      coordinates: [90.3875, 23.7506],
      city: 'Dhaka',
      country: 'Bangladesh'
    },
    description: 'Providing quality healthcare services with experienced medical professionals.'
  }
];

// Import sample data into MongoDB
const importData = async () => {
  try {
    // Clear existing data
    await Hospital.deleteMany();
    
    // Insert sample hospitals
    const createdHospitals = await Hospital.create(hospitals);
    
    console.log('Sample hospital data imported successfully!'.green.inverse);
    console.log(`${createdHospitals.length} hospitals created.`.cyan);
    
    process.exit();
  } catch (error) {
    console.error(`Error importing data: ${error.message}`.red.inverse);
    process.exit(1);
  }
};

// Destroy sample data from MongoDB
const destroyData = async () => {
  try {
    await Hospital.deleteMany();
    
    console.log('Hospital data destroyed successfully!'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(`Error destroying data: ${error.message}`.red.inverse);
    process.exit(1);
  }
};

// Handle command line arguments
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
