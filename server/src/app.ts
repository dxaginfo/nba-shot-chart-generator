import express, { Application } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import ShotController from './controllers/ShotController';

// Load environment variables
dotenv.config();

// Create Express app
const app: Application = express();

// Connect to MongoDB
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/nba-shot-charts';
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Initialize middleware
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize controllers
const shotController = new ShotController();

// Define API routes
const apiRouter = express.Router();

// Shot data routes
apiRouter.get('/shots/player/:playerId/season/:season', shotController.getPlayerShots);
apiRouter.get('/stats/player/:playerId/season/:season', shotController.getPlayerShotStats);

// Reference data routes
apiRouter.get('/players', shotController.getPlayers);
apiRouter.get('/teams', shotController.getTeams);
apiRouter.get('/seasons', shotController.getSeasons);

// Admin routes (would typically be protected)
apiRouter.post('/import/season/:season', shotController.importShotData);

// Mount API router
app.use('/api', apiRouter);

// Basic route for server status
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'NBA Shot Chart API is running',
    version: '1.0.0'
  });
});

// Start server
const PORT = process.env.PORT || 3001;

const startServer = async () => {
  await connectDB();
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.error('Unhandled Rejection:', err.message);
  // Close server & exit process
  process.exit(1);
});

// Export for testing purposes
export { app, startServer };

// Start server if this file is run directly
if (require.main === module) {
  startServer();
}