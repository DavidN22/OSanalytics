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
exports.checkDatabaseConnection = exports.pool = void 0;
const { Pool } = require('pg');
const URI = process.env.DB_URI_STRING;
const pool = new Pool({
    connectionString: URI,
});
exports.pool = pool;
const checkDatabaseConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield pool.query('SELECT NOW()');
        console.log('Connected to the PostgreSQL database.');
    }
    catch (err) {
        console.error('Failed to connect to the PostgreSQL database:', err);
    }
});
exports.checkDatabaseConnection = checkDatabaseConnection;
