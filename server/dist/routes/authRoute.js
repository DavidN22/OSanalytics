"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passportUserMiddleware_1 = __importDefault(require("../middleware/passportUserMiddleware"));
const router = express_1.default.Router();
router.get('/', passportUserMiddleware_1.default.authenticate('google', { scope: ['profile', 'email'], session: false }));
// redirects for deployed website
router.get('/oauth', passportUserMiddleware_1.default.authenticate('google', { failureRedirect: ' http://localhost:3000/login', session: false }), (req, res) => {
    const { token, user } = req.user;
    res.redirect(`http://localhost:3000/login?token=${token}&email=${user.email}`);
});
exports.default = router;
