import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import rateLimit from "express-rate-limit"

import weatherRouter from "./routes/weather";
import fallbackRouter from "./routes/fallback";
import locationRouter from "./routes/location";

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

app.use('/weather', weatherRouter)
app.use('/location', locationRouter)
app.use("*", fallbackRouter)

// Enable cors
app.use(cors());

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
}

export default app