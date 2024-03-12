import express from 'express';
import { createServer } from 'http';
import dotenv from 'dotenv';
import connectDB from './config/db';
import complaintRoutes from './routes/complaintRoutes';
import { initIo } from './config/socket'; 
dotenv.config();
connectDB();

const app = express();
app.use(express.json());

const httpServer = createServer(app);

initIo(httpServer);

app.use('/api/complaints', complaintRoutes);

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
