import express, { Request, Response, NextFunction } from "express";
import { User } from "../types";
import passport from '../middleware/passportUserMiddleware';
const router = express.Router();


router.get('/', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));
// redirects for deployed website
router.get('/oauth',
    passport.authenticate('google', { failureRedirect: 'https://www.osanalytics-click.com/login', session: false }),
    (req, res) => {
      const { token, user } = req.user as User;
      res.redirect(`https://www.osanalytics-click.com/login?token=${token}&email=${user.email}`);
    }
  );

export default router;