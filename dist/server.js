"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dbConnect_config_1 = __importDefault(require("./config/dbConnect.config"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const userRouter_1 = __importDefault(require("./routes/userRouter"));
const dotenv_1 = __importDefault(require("dotenv"));
const errorHandler_middleware_1 = require("./middlewares/errorHandler.middleware");
// Load environment variables
dotenv_1.default.config();
// Initialize Express app
const app = (0, express_1.default)();
// Database connection
(0, dbConnect_config_1.default)();
// Middlewares
app.use((0, cookie_parser_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json({ limit: '100mb' })); // Increase limit to 100MB
app.use(express_1.default.urlencoded({ extended: true, limit: '100mb' }));
app.use((0, cors_1.default)({
    credentials: true,
    origin: [
        process.env.LOCALHOST_URL || '',
        process.env.FRONTEND_WWW_URL || '',
        process.env.FRONTEND_AMPLIFY_URL || '',
        process.env.FRONTEND_WWW_SLASH || '',
        process.env.FRONTEND_SLASH_URL || ''
    ],
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With'],
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT']
}));
// Routes
app.use('/api', userRouter_1.default);
// Error handling middlewares
app.use(errorHandler_middleware_1.errorHandler);
app.use(errorHandler_middleware_1.notFoundHandler);
// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}...`);
});
