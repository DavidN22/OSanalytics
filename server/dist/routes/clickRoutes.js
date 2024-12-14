"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const clickController_1 = __importDefault(require("../controllers/clickController"));
const writeToDbAuth_1 = __importDefault(require("../middleware/writeToDbAuth"));
router.post("/", writeToDbAuth_1.default, clickController_1.default.storeClickData, (req, res) => { });
router.post("/visits", writeToDbAuth_1.default, clickController_1.default.storeVisitData, (req, res) => { });
exports.default = router;
