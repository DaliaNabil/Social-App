"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_service_1 = __importDefault(require("./auth.service"));
const authController = (0, express_1.Router)();
authController.get('/health', (req, res) => {
    const result = auth_service_1.default.health(req.body);
    res.status(200).json({ message: 'Auth route is working', body: req.body });
});
exports.default = authController;
