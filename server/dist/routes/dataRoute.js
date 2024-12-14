"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const dataController_1 = __importDefault(require("../controllers/dataController"));
const auth_1 = __importDefault(require("../middleware/auth"));
router.get("/", auth_1.default, dataController_1.default.getAllUserData, (req, res) => { });
router.get("/referral", auth_1.default, dataController_1.default.getAllreferralData, (req, res) => { });
router.delete("/delete-website", auth_1.default, dataController_1.default.deleteWebsite, (req, res) => { });
exports.default = router;
