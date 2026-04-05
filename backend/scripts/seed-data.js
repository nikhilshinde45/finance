require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/user.model');
const Record = require('../models/record.model');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/finance_dashboard');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

const users = [
  {
    name: 'Admin User',
    email: 'admin@test.com',
    password: 'password123',
    role: 'admin',
    status: 'active',
  },
  {
    name: 'Analyst User',
    email: 'analyst@test.com',
    password: 'password123',
    role: 'analyst',
    status: 'active',
  },
  {
    name: 'Viewer User',
    email: 'viewer@test.com',
    password: 'password123',
    role: 'viewer',
    status: 'active',
  },
];

const categories = {
  income: ['Salary', 'Freelance', 'Dividends', 'Gift', 'Rental'],
  expense: ['Food', 'Transport', 'Rent', 'Utilities', 'Entertainment', 'Healthcare', 'Shopping'],
};

const getRandomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Record.deleteMany({});

    // Create users
    console.log('Creating users...');
    let createdUsers = [];
    try {
        createdUsers = await User.create(users);
        console.log(`Created ${createdUsers.length} users.`);
    } catch (err) {
        console.error('Error creating users:', err.message);
        throw err;
    }

    // Create records
    console.log('Creating records...');
    const records = [];
    const startDate = new Date(new Date().getFullYear(), new Date().getMonth() - 3, 1);
    const endDate = new Date();

    for (let i = 0; i < 50; i++) {
        const type = Math.random() > 0.4 ? 'expense' : 'income';
        const user = createdUsers[Math.floor(Math.random() * createdUsers.length)];
        const categoryList = categories[type];
        const category = categoryList[Math.floor(Math.random() * categoryList.length)];
        const amount = type === 'income' 
            ? Math.floor(Math.random() * 5000) + 1000 
            : Math.floor(Math.random() * 1000) + 50;
        
        records.push({
            amount,
            type,
            category,
            date: getRandomDate(startDate, endDate),
            note: `Sample ${type} for ${category}`,
            createdBy: user._id,
        });
    }

    try {
        await Record.insertMany(records);
        console.log(`Created ${records.length} records.`);
    } catch (err) {
        console.error('Error inserting records:', err.message);
        throw err;
    }

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    const fs = require('fs');
    fs.writeFileSync('seed-error.log', error.stack || error.message || String(error));
    console.error('General Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
