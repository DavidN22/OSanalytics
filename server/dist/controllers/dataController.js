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
const dataController = {
    //get everything from all website, URL looks like http://yourdomain.com/api/data
    getAllUserData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = res.locals.userId;
                //user_id, element, element_name, dataset_id, x_coord, y_coord, user_browser, user_os, page_url
                const response = yield db_1.pool.query(`SELECT *
FROM "clickTable"
WHERE user_id = $1
ORDER BY created_at ASC;`, [id]);
                if (response.rows.length > 0) {
                    res.status(200).json(response.rows);
                }
                else {
                    res.status(404).json({ message: "No data" });
                }
            }
            catch (err) {
                const error = err;
                return next({
                    message: "Error in getAllUserData: " + error.message,
                    log: err,
                });
            }
        });
    },
    getAllreferralData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = res.locals.userId;
                const response = yield db_1.pool.query(`SELECT *
          FROM "referrerTable"
          WHERE user_id = $1`, [id]);
                if (response.rows.length > 0) {
                    res.status(200).json(response.rows);
                }
                else {
                    res.status(404).json({ message: "No data" });
                }
            }
            catch (err) {
                const error = err;
                return next({
                    message: "Error in getAllreferralData: " + error.message,
                    log: err,
                });
            }
        });
    },
    deleteWebsite(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { website_name } = req.body;
            const userId = res.locals.userId;
            try {
                const deleteClicks = yield db_1.pool.query(`DELETE FROM "clickTable" WHERE website_name = $1 AND user_id = $2`, [website_name, userId]);
                const deleteReferrals = yield db_1.pool.query(`DELETE FROM "referrerTable" WHERE website_name = $1 AND user_id = $2`, [website_name, userId]);
                if (deleteClicks.rowCount > 0 || deleteReferrals.rowCount > 0) {
                    res.status(200).json({ message: "Website data deleted successfully" });
                }
                else {
                    res.status(404).json({ message: "No data found for this website" });
                }
            }
            catch (err) {
                const error = err;
                return next({
                    message: "Error in deleteWebsite: " + error.message,
                    log: err,
                });
            }
        });
    },
    getWebsiteData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const website = req.params.id;
                const id = res.locals.userId;
                const response = yield db_1.pool.query(`SELECT * FROM "clickTable"
      WHERE user_id = $1
      AND website_name = $2
      `, [id, website]);
                if (response.rows.length > 0) {
                    res.status(200).json(response.rows);
                }
                else {
                    res.status(404).json({ message: "No data" });
                }
            }
            catch (err) {
                const error = err;
                return next({
                    message: "Error in getWebsiteData:" + error.message,
                    log: err,
                });
            }
        });
    },
    getAllUserWebsites(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = res.locals.userId;
                const response = yield db_1.pool.query(`SELECT DISTINCT website_name
       FROM "clickTable"
       WHERE user_id = $1`, [id]);
                if (response.rows.length > 0) {
                    res.status(200).json(response.rows);
                }
                else {
                    res.status(404).json({ message: "No data" });
                }
            }
            catch (err) {
                const error = err;
                return next({
                    message: "Error in getAllUserWebsites: " + error.message,
                    log: err,
                });
            }
        });
    },
};
exports.default = dataController;
