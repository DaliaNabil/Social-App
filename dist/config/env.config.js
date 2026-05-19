"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)({
    path: [`.${process.env.NODE_ENV}.env`, '.env']
});
const envConfig = {
    app: {
        port: process.env.PORT ?? 3000,
        nodeEnv: process.env.NODE_ENV ?? 'dev'
    },
    database: {
        MONGO_URI: process.env.MONGO_URI ?? 'mongodb://localhost:27017/social-app'
    }
};
exports.default = envConfig;
