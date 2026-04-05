require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/user.model');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/finance_dashboard');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

const seedAdmin = async () => {
  await connectDB();

  rl.question('Enter admin name: ', (name) => {
    rl.question('Enter admin email: ', (email) => {
      rl.question('Enter admin password: ', async (password) => {
        try {
          const userExists = await User.findOne({ email });

          if (userExists) {
            console.log('User with this email already exists!');
            process.exit(0);
          }

          const adminUser = await User.create({
            name,
            email,
            password,
            role: 'admin',
            status: 'active'
          });

          console.log(`Admin user created successfully: ${adminUser.email}`);
          process.exit(0);
        } catch (error) {
          console.error('Error creating admin user:', error);
          process.exit(1);
        }
      });
    });
  });
};

seedAdmin();
