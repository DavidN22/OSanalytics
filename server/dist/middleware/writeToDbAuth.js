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
const auth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const apiKey = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (!apiKey) {
        return res.status(401).send("Unauthorized: No API key provided");
    }
    try {
        //search for a valid api key inside the usertable
        const result = yield db_1.pool.query('SELECT * FROM "userTable" WHERE "api_key" = $1', [apiKey]);
        if (result.rows.length === 0) {
            return res.status(401).send("Unauthorized: Invalid API key");
        }
        const user = result.rows[0];
        res.locals.user = user.cognito_id;
        next();
    }
    catch (error) {
        console.error("Error during API key verification:", error);
        return res.status(401).send("Unauthorized: Invalid API key");
    }
});
exports.default = auth;
