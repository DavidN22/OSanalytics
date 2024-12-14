"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const userController_1 = __importDefault(require("../controllers/userController"));
const addToDB_1 = __importDefault(require("../middleware/addToDB"));
const auth_1 = __importDefault(require("../middleware/auth"));
router.post("/signup", userController_1.default.signup, addToDB_1.default, (req, res) => {
    res
        .status(200)
        .send({ email: res.locals.email, userUUID: res.locals.cognito_Id, token: res.locals.token });
});
router.post("/login", userController_1.default.login, (req, res) => { });
router.delete("/delete-account", auth_1.default, userController_1.default.deleteAccount, (req, res) => { });
router.get("/activeUser", auth_1.default, (req, res) => {
    res.status(200).send({ email: res.locals.email, message: "good to go!" });
});
router.get("/getApiKey", auth_1.default, userController_1.default.getApiKey, (req, res) => {
    ;
});
router.delete('/apiKey', auth_1.default, userController_1.default.deleteApiKey);
router.put('/apiKey', auth_1.default, userController_1.default.refreshApiKey);
router.put('/awsCredentials', auth_1.default, userController_1.default.addAwsCredentials);
router.post("/logout", userController_1.default.logout, (req, res) => { });
router.post('/forgot-password', userController_1.default.forgotPassword);
router.post('/confirm-password', userController_1.default.confirmPassword);
exports.default = router;
