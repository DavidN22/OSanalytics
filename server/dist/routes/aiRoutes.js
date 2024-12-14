"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const aiController_1 = __importDefault(require("../controllers/aiController"));
const auth_1 = __importDefault(require("../middleware/auth"));
router.post("/bedrock", auth_1.default, aiController_1.default.getDataBedrock, (req, res) => { });
exports.default = router;
