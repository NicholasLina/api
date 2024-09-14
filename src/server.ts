import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import rateLimit from "express-rate-limit"

import weatherRouter from "./routes/weather";

dotenv.config();

const PORT = process.env.PORT || 9000;

const app = express();

// Rate limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 10
})
app.use(limiter)
app.set('trust proxy', 1)

app.use('/weather/', weatherRouter)

// Enable cors
app.use(cors());

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))