"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConnection = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("../../config");
const { database } = config_1.envConfig;
const dbConnection = async () => {
    try {
        await mongoose_1.default.connect(database.MONGO_URI);
        console.log(" DB Connected to MongoDB");
    }
    catch (error) {
        console.error(" DB Error connecting to MongoDB:", error);
    }
};
exports.dbConnection = dbConnection;
