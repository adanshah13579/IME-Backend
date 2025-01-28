import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import doctorRoutes from './routes/doctorRoutes.js';
import offerRoutes from './routes/offerRoutes.js';  
import cors from "cors"




dotenv.config(); 

const app = express();

app.use(cors());
app.use(express.json());


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

connectDB();

app.use("/api/auth", authRoutes);
app.use('/api/doctor', doctorRoutes);


app.use('/api/offer', offerRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
