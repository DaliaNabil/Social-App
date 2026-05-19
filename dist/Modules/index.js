"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentsController = exports.postsController = exports.usersController = exports.authController = void 0;
var auth_controller_1 = require("./Auth/auth.controller");
Object.defineProperty(exports, "authController", { enumerable: true, get: function () { return __importDefault(auth_controller_1).default; } });
var users_controller_1 = require("./Users/users.controller");
Object.defineProperty(exports, "usersController", { enumerable: true, get: function () { return __importDefault(users_controller_1).default; } });
var posts_controller_1 = require("./Posts/posts.controller");
Object.defineProperty(exports, "postsController", { enumerable: true, get: function () { return __importDefault(posts_controller_1).default; } });
var comments_controller_1 = require("./Comments/comments.controller");
Object.defineProperty(exports, "commentsController", { enumerable: true, get: function () { return __importDefault(comments_controller_1).default; } });
