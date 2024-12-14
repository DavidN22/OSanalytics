"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const client_cognito_identity_provider_1 = require("@aws-sdk/client-cognito-identity-provider");
const crypto = __importStar(require("crypto"));
const verifier_1 = __importDefault(require("../middleware/verifier"));
const awsEncryption_1 = require("../middleware/awsEncryption");
const client = new client_cognito_identity_provider_1.CognitoIdentityProviderClient({
    region: "us-east-2",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS,
        secretAccessKey: process.env.AWS_SECRET,
    },
});
const db_1 = require("../models/db");
const COGNITO_CLIENT_ID = process.env.COGNITO_CLIENT_ID;
const COGNITO_CLIENT_SECRET = process.env.COGNITO_CLIENT_SECRET;
//secret hash helper function
const computeSecretHash = (clientId, clientSecret, username) => {
    return crypto
        .createHmac("sha256", clientSecret)
        .update(username + clientId)
        .digest("base64");
};
const userController = {
    forgotPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            try {
                const secretHash = computeSecretHash(COGNITO_CLIENT_ID, COGNITO_CLIENT_SECRET, email);
                const command = new client_cognito_identity_provider_1.ForgotPasswordCommand({
                    ClientId: COGNITO_CLIENT_ID,
                    Username: email,
                    SecretHash: secretHash,
                });
                yield client.send(command);
                res
                    .status(200)
                    .json({ message: "Password reset code sent to your email." });
            }
            catch (err) {
                const error = err;
                return next({
                    message: "Error in forgotPassword: " + error.message,
                    log: err,
                });
            }
        });
    },
    // Confirm forgot password functionality
    confirmPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, code, newPassword, } = req.body;
            try {
                const secretHash = computeSecretHash(COGNITO_CLIENT_ID, COGNITO_CLIENT_SECRET, email);
                const command = new client_cognito_identity_provider_1.ConfirmForgotPasswordCommand({
                    ClientId: COGNITO_CLIENT_ID,
                    Username: email,
                    ConfirmationCode: code,
                    Password: newPassword,
                    SecretHash: secretHash,
                });
                yield client.send(command);
                res.status(200).json({ message: "Password reset successful." });
            }
            catch (err) {
                const error = err;
                return next({
                    message: "Error in confirmPassword: " + error.message,
                    log: err,
                });
            }
        });
    },
    signup(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { email, password } = req.body;
            //command to signup and login right after
            try {
                const secretHash = computeSecretHash(COGNITO_CLIENT_ID, COGNITO_CLIENT_SECRET, email);
                const command = new client_cognito_identity_provider_1.SignUpCommand({
                    ClientId: COGNITO_CLIENT_ID,
                    Username: email,
                    Password: password,
                    SecretHash: secretHash,
                    UserAttributes: [
                        {
                            Name: "email",
                            Value: email,
                        },
                    ],
                });
                yield client.send(command);
                const loginCommand = new client_cognito_identity_provider_1.InitiateAuthCommand({
                    ClientId: COGNITO_CLIENT_ID,
                    AuthFlow: "USER_PASSWORD_AUTH",
                    AuthParameters: {
                        USERNAME: email,
                        PASSWORD: password,
                        SECRET_HASH: secretHash,
                    },
                });
                //get the token from the result
                const authResult = yield client.send(loginCommand);
                const token = (_a = authResult.AuthenticationResult) === null || _a === void 0 ? void 0 : _a.IdToken;
                const verifier = (0, verifier_1.default)();
                const payload = yield verifier.verify(token);
                res.locals.cognito_Id = payload.sub;
                res.locals.email = payload.email;
                res.locals.token = token;
                return next();
            }
            catch (err) {
                const error = err;
                return next({
                    message: "Error in signup: " + error.message,
                    log: err,
                });
            }
        });
    },
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { email, password } = req.body;
            try {
                const secretHash = computeSecretHash(COGNITO_CLIENT_ID, COGNITO_CLIENT_SECRET, email);
                const command = new client_cognito_identity_provider_1.InitiateAuthCommand({
                    ClientId: COGNITO_CLIENT_ID,
                    AuthFlow: "USER_PASSWORD_AUTH",
                    AuthParameters: {
                        USERNAME: email,
                        PASSWORD: password,
                        SECRET_HASH: secretHash,
                    },
                });
                const authResult = yield client.send(command);
                const token = (_a = authResult.AuthenticationResult) === null || _a === void 0 ? void 0 : _a.IdToken;
                res.locals.token = token;
                //send token back
                res.status(200).send({ email: email, token: token });
            }
            catch (err) {
                const error = err;
                return next({
                    message: "Error in login: " + error.message,
                    log: err,
                });
            }
        });
    },
    getApiKey(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = res.locals.userId;
                const response = yield db_1.pool.query('SELECT * FROM "userTable" WHERE "cognito_id" = $1', [user]);
                if (response.rows.length > 0) {
                    res.status(200).json({ apiKey: response.rows[0].api_key });
                }
                else {
                    res.status(404).json({ message: "No data" });
                }
            }
            catch (err) {
                const error = err;
                return next({
                    message: "Error in getApiKey: " + error.message,
                    log: err,
                });
            }
        });
    },
    deleteApiKey(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = res.locals.userId;
                const response = yield db_1.pool.query('SELECT * FROM "userTable" WHERE "cognito_id" = $1', [user]);
                if (response.rows.length > 0) {
                    yield db_1.pool.query('UPDATE "userTable" SET "api_key" = NULL WHERE "cognito_id" = $1', [user]);
                    res.status(200).json({ message: "API key deleted successfully" });
                }
                else {
                    res.status(404).json({ message: "No data" });
                }
            }
            catch (err) {
                const error = err;
                return next({
                    message: "Error in deleteApiKey: " + error.message,
                    log: err,
                });
            }
        });
    },
    refreshApiKey(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = res.locals.userId;
                const response = yield db_1.pool.query('SELECT * FROM "userTable" WHERE "cognito_id" = $1', [user]);
                if (response.rows.length > 0) {
                    const newApiKeyResponse = yield db_1.pool.query('UPDATE "userTable" SET "api_key" = gen_random_uuid() WHERE "cognito_id" = $1 RETURNING "api_key"', [user]);
                    res.status(200).json({ apiKey: newApiKeyResponse.rows[0].api_key });
                }
                else {
                    res.status(404).json({ message: "No data" });
                }
            }
            catch (err) {
                const error = err;
                return next({
                    message: "Error in refreshApiKey: " + error.message,
                    log: err,
                });
            }
        });
    },
    addAwsCredentials(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = res.locals.userId;
                const { awsClientKey, awsSecretKey, awsRegion } = req.body;
                const encryptedClientKey = (0, awsEncryption_1.encrypt)(awsClientKey);
                const encryptedSecretKey = (0, awsEncryption_1.encrypt)(awsSecretKey);
                const response = yield db_1.pool.query('SELECT * FROM "userTable" WHERE "cognito_id" = $1', [user]);
                if (response.rows.length > 0) {
                    yield db_1.pool.query('UPDATE "userTable" SET "AWS_ACCESS_KEY" = $1, "AWS_SECRET_KEY" = $2, "AWS_REGION" = $3 WHERE "cognito_id" = $4 RETURNING "api_key"', [JSON.stringify(encryptedClientKey), JSON.stringify(encryptedSecretKey), awsRegion, user]);
                    res.status(200).json({
                        message: "AWS credentials updated successfully",
                    });
                }
                else {
                    res.status(404).json({ message: "User not found" });
                }
            }
            catch (err) {
                const error = err;
                return next({
                    message: "Error in addAwsCredentials: " + error.message,
                    log: err,
                });
            }
        });
    },
    logout(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            res.status(200).send("Logged out successfully");
        });
    },
    deleteAccount(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const cognito_id = res.locals.userId;
            if (!cognito_id) {
                return res.status(400).json({ message: "cognito_id is required" });
            }
            try {
                if (!cognito_id.includes("@")) {
                    console.log("hit");
                    const deleteCommand = new client_cognito_identity_provider_1.AdminDeleteUserCommand({
                        UserPoolId: 'us-east-2_mW01ZJaUU',
                        Username: cognito_id
                    });
                    yield client.send(deleteCommand);
                }
                else {
                    console.log("Cognito_id is oauth.");
                }
                const result = yield db_1.pool.query(`DELETE FROM "userTable" WHERE "cognito_id" = $1 RETURNING *`, [cognito_id]);
                if (result.rowCount === 0) {
                    return res.status(404).json({ message: "User not found" });
                }
                res
                    .status(200)
                    .json({
                    message: "User account and related data deleted successfully.",
                });
            }
            catch (err) {
                const error = err;
                return next({
                    message: "Error in deleteAccount: " + error.message,
                    log: err,
                });
            }
        });
    },
};
exports.default = userController;
