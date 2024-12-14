require('dotenv').config();
import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import {checkDatabaseConnection } from './models/db';
import userRoutes from './routes/userRoutes'; 
import clickRoutes from './routes/clickRoutes'; 
import dataRoutes from './routes/dataRoute'; 
import aiRoutes from './routes/aiRoutes'; 
import authRoutes from './routes/authRoute' 
import passport from './middleware/passportUserMiddleware';
//import puppeteerRoutes from './routes/puppeteerRoutes'; 



const cors = require('cors');


//check db connection
checkDatabaseConnection();

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser()); 
app.use(passport.initialize());
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
app.use('/api/google',authRoutes)
app.use('/api/auth',userRoutes)
app.use('/api/click-data',clickRoutes)
app.use('/api/data',dataRoutes)
app.use('/api/ai',aiRoutes)


app.use(options);
//app.use('/api/screenshot', puppeteerRoutes)


// app.use('/api/oauth',oauthRoute)
// app.use('/api/oauthrequest',oauthRequestRoute)

//Error handling

app.use((req: Request, res: Response) => {
  res.status(404).send("This is not the page you're looking for...");
});


app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
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
