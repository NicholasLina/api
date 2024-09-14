import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import weatherRouter from "./routes/weather";

dotenv.config();

const PORT = process.env.PORT || 9999;

const app = express();

app.use('/weather', weatherRouter)

// Enable cors
app.use(cors());

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))