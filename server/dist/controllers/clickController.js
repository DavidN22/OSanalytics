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
const clickDataController = {
    storeClickData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //get click data back as a body
            const { websiteName, x_coord, y_coord, element, activityId, userAgent, platform, pageUrl } = req.body;
            const userId = res.locals.user;
            if (!userId) {
                res
                    .status(400)
                    .json({ error: "User information is missing from the request" });
                return;
            }
            //insert query to store click data in clickTable
            try {
                yield db_1.pool.query(`
          INSERT INTO "clickTable" (user_id, website_name, element, dataset_id, x_coord, y_coord, user_browser,user_os,page_url)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`, [userId, websiteName, element, activityId, x_coord, y_coord, userAgent, platform, pageUrl]);
                res.status(201).json({ message: "Click data stored successfully" });
            }
            catch (error) {
                console.error("Error storing click data:", error);
                res.status(500).json({ error: "Failed to store click data" });
            }
        });
    },
    storeVisitData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { websiteName, referrer } = req.body;
            const userId = res.locals.user;
            if (!userId) {
                res
                    .status(400)
                    .json({ error: "User information is missing from the request" });
                return;
            }
            try {
                yield db_1.pool.query(`
        INSERT INTO "referrerTable" (user_id, website_name, referrer)
        VALUES ($1, $2, $3)`, [userId, websiteName, referrer]);
                res.status(201).json({ message: "Visit data stored successfully" });
            }
            catch (error) {
                console.error("Error storing visit data:", error);
                res.status(500).json({ error: "Failed to store visit data" });
            }
        });
    },
};
exports.default = clickDataController;
