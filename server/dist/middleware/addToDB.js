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
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../models/db");
const addUserToDatabase = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const cognito_id = res.locals.cognito_Id;
    try {
        const existingUser = yield db_1.pool.query('SELECT * FROM "userTable" WHERE email = $1', [email]);
        if (existingUser.rows.length === 0) {
            const newUser = yield db_1.pool.query('INSERT INTO "userTable" (email, cognito_id) VALUES ($1,$2) RETURNING *', [email, cognito_id]);
            console.log("New user added:", newUser.rows[0]);
        }
        else {
            console.log("User already exists:", existingUser.rows[0]);
        }
        next();
    }
    catch (err) {
        next({
            message: "Error adding user to the database: " + err,
            log: err,
        });
    }
});
exports.default = addUserToDatabase;
