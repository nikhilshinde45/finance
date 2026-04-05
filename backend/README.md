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
├── scripts/             # Seeding and testing scripts
├── api_docs.md         # API Documentation
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

### 3. Seed Sample Data
To populate the database with an admin, analyst, viewer, and 50+ records:
```bash
npm run seed:data
```

To create an admin account manually:
```bash
npm run seed:admin
```
Follow the prompts to configure an email and password.

### 4. API Documentation
Full details of all available endpoints can be found in [api_docs.md](./api_docs.md).

### 5. Run the Server
**Development Mode** (auto-restart with Nodemon):
```bash
npm run dev
```

**Production Mode**:
```bash
npm start
```
