"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const db_1 = require("../models/db");
// import db from '../models/db';
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/google/oauth',
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const email = ((_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0].value) || '';
    try {
        const userQuery = yield db_1.pool.query('SELECT * FROM "userTable" WHERE email = $1', [email]);
        let user;
        if (userQuery.rows.length === 0) {
            const newUser = yield db_1.pool.query('INSERT INTO "userTable" (cognito_id, email) VALUES ($1, $2) RETURNING *', [email, email]);
            user = newUser.rows[0];
        }
        else {
            user = userQuery.rows[0];
        }
        const token = jsonwebtoken_1.default.sign({ user_id: user.cognito_id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return done(null, { user, token });
    }
    catch (err) {
        return done(err, null);
    }
})));
exports.default = passport_1.default;
