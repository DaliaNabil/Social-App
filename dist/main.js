"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = require("./config");
const Modules_1 = require("./Modules");
const db_connection_1 = require("./DB/Repositories/db.connection");
const app = (0, express_1.default)();
function initializeControllers(app) {
    app.use("/api/auth", Modules_1.authController);
    app.use("/api/user", Modules_1.usersController);
    app.use("/api/post", Modules_1.postsController);
    app.use("/api/comments", Modules_1.commentsController);
    app.get("/", (req, res) => {
        res.json({ status: "success", message: "Health check",
        });
    });
    app.use((req, res) => {
        res.status(404).json({ status: "error", message: "Not found" });
    });
}
function initializeCommonMiddlewares(app) {
    app.use(express_1.default.json());
}
initializeCommonMiddlewares(app);
initializeControllers(app);
(0, db_connection_1.dbConnection)();
const port = config_1.envConfig.app.port;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
