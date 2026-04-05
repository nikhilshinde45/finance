# Finance Dashboard Backend

A production-quality RESTful API backend for a Finance Dashboard application, built with Node.js, Express, and MongoDB.

## Project Structure

```
backend/
├── config/              # Configuration (MongoDB connection)
├── controllers/         # Request handlers (logic)
├── middleware/          # Express middlewares (auth, validation, errors)
├── models/              # Mongoose database models
├── routes/              # API route definitions
├── scripts/             # Script to create the first admin user
├── utils/               # Utilities (ApiError)
├── validations/         # Zod schemas definitions
├── server.js            # Main application entry point
└── package.json         # Dependencies and Scripts
```

## Setup & Run

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Check the Environment Variables
We have defined `.env` in the root of the `backend/` directory.

### 3. Seed an Admin User
To populate the database with a first admin account for testing:
```bash
npm run seed:admin
```
Follow the prompts to configure an email and password.

### 4. Run the Server
**Development Mode** (auto-restart with Nodemon):
```bash
npm run dev
```

**Production Mode**:
```bash
npm start
```
