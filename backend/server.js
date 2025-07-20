import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import productRouter from "./routes/productRoutes.js";
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import cors from 'cors';

const port = process.env.PORT || 5000;

connectDB();
dotenv.config();

const app = express();

const allowedOrigins = [
  'https://bought-it.vercel.app',
  'http://localhost:3000' 
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true 
}));


app.get("/", (req, res) => {
  res.send("API is running...");
});
app.use(express.json());

app.use("/api/products", productRouter);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);

app.use(notFound);

app.use(errorHandler);

app.listen(port, () => console.log(`Server running on port ${port}`));
