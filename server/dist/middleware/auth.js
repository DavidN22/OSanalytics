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
const verifier_1 = __importDefault(require("./verifier"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifier = (0, verifier_1.default)();
const auth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", "");
    if (!token) {
        return res.status(401).send("Unauthorized: No token provided");
    }
    try {
        let payload = null;
        const decoded = jsonwebtoken_1.default.decode(token, { complete: true });
        if (decoded && decoded.payload && decoded.payload.iss && decoded.payload.iss.includes("cognito")) {
            payload = yield verifier.verify(token);
        }
        else {
            payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        }
        res.locals.userId = payload.sub || payload.user_id;
        res.locals.email = payload.email;
        next();
    }
    catch (error) {
        return res.status(401).send("Unauthorized: Invalid token");
    }
});
exports.default = auth;
