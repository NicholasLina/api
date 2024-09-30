"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const weather_1 = __importDefault(require("./routes/weather"));
const fallback_1 = __importDefault(require("./routes/fallback"));
dotenv_1.default.config();
const PORT = process.env.PORT || 9000;
const app = (0, express_1.default)();
// Rate limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 10
});
app.use(limiter);
app.set('trust proxy', 1);
app.use('/weather', weather_1.default);
app.use("*", fallback_1.default);
// Enable cors
app.use((0, cors_1.default)());
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
}
exports.default = app;
//# sourceMappingURL=server.js.map