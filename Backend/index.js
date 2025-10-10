// import express from 'express';
// import cookieParser from 'cookie-parser';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import connectDB from './utils/db.js';
// import userRoute from './routes/user.routes.js';

// dotenv.config();
// const app = express();

// // MIDDLEWARE
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());

// const corsOptions = {
//   origin: ['http://localhost:5121'],
//   credentials: true,
// };
// app.use(cors(corsOptions));

// // ROOT ROUTE
// app.get('/', (req, res) => {
//   return res.status(200).json({
//     message: 'Welcome to new project',
//     timestamp: new Date().toISOString(),
//     success: true,
//   });
// });

// // API ROUTES
// app.use('/api/users', userRoute);

// // CONNECT DB AND START SERVER
// const PORT = process.env.PORT || 5001;

// const startServer = async () => {
//   try {
//     await connectDB(); // ensure DB connects first
//     app.listen(PORT, () => {
//       console.log(`Server is running on port ${PORT}`);
//     });
//   } catch (err) {
//     console.error('Failed to connect to DB:', err.message);
//     process.exit(1); // stop server if DB connection fails
//   }
// };

// startServer();
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './utils/db.js';
import userRoute from './routes/user.routes.js';
import companyRoute from './routes/company.route.js'
import jobRoute from './routes/job.route.js'
import applicationRoute from './routes/application.route.js'
dotenv.config();
const app = express();

// MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// const corsOptions = {
//   origin: ['http://localhost:5121'], // your frontend
//   credentials: true,
// };
app.use(cors({
  origin: ["http://localhost:5175", "http://localhost:5173", "http://localhost:5174"], // your Vite frontend
  credentials: true
}));
// app.use(cors(corsOptions));

// ROOT ROUTE
// app.get('/', (req, res) => {
//   res.status(200).json({
//     message: 'Server is running!',
//     timestamp: new Date().toISOString(),
//     success: true,
//   });
// });

// API ROUTES
app.use('/api/users', userRoute);
app.use('/api/company', companyRoute);
app.use('/api/job', jobRoute);
app.use('/api/application', applicationRoute);


// START SERVER
const PORT = process.env.PORT || 5001;

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await connectDB(); // connect to DB after server starts
});
