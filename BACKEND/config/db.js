const mongoose = require("mongoose");

// Direct MongoDB connection string
const MONGODB_URI = "mongodb+srv://niloy:BOKACHODA@cluster0.zvtqynn.mongodb.net/hospital470?retryWrites=true&w=majority";

// Recommended in newer mongoose versions for query filtering behavior
mongoose.set('strictQuery', true);

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    const { host, port, name } = mongoose.connection;
    console.log(`✅ MongoDB connected: ${host}:${port}/${name}`);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
};

// Helpful connection events
mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  console.log('MongoDB reconnected');
});

module.exports = connectDB;
