"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const db_1 = require("./models/db");
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const clickRoutes_1 = __importDefault(require("./routes/clickRoutes"));
const dataRoute_1 = __importDefault(require("./routes/dataRoute"));
const aiRoutes_1 = __importDefault(require("./routes/aiRoutes"));
const authRoute_1 = __importDefault(require("./routes/authRoute"));
const passportUserMiddleware_1 = __importDefault(require("./middleware/passportUserMiddleware"));
//import puppeteerRoutes from './routes/puppeteerRoutes'; 
const cors = require('cors');
//check db connection
(0, db_1.checkDatabaseConnection)();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(cors());
app.use((0, cookie_parser_1.default)());
app.use(passportUserMiddleware_1.default.initialize());
const port = 8080;
// app.get('/api',authMiddleware, (req: Request, res: Response) => {
//   res.json({ message: 'Hello from server!',
//     user: res.locals.userId,
//    });
// });
const options = [
    cors({
        origin: '*',
        methods: '*',
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    })
];
app.get("/test", (req, res) => res.send("Express on Vercel"));
app.use('/api/google', authRoute_1.default);
app.use('/api/auth', userRoutes_1.default);
app.use('/api/click-data', clickRoutes_1.default);
app.use('/api/data', dataRoute_1.default);
app.use('/api/ai', aiRoutes_1.default);
app.use(options);
//app.use('/api/screenshot', puppeteerRoutes)
// app.use('/api/oauth',oauthRoute)
// app.use('/api/oauthrequest',oauthRequestRoute)
//Error handling
app.use((req, res) => {
    res.status(404).send("This is not the page you're looking for...");
});
app.use((err, req, res, next) => {
    const defaultErr = {
        log: 'Express error handler caught unknown middleware error',
        status: 500,
        message: { err: 'An error occurred' },
    };
    const errorObj = Object.assign({}, defaultErr, err);
    console.error(errorObj.log);
    return res.status(errorObj.status).json(errorObj.message);
});
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
