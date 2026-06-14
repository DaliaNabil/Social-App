import express, { Application, Request, Response } from "express";
import { envConfig } from "./config";
import {
  authController,
  commentsController,
  postsController,
  usersController,
} from "./Modules";
import { dbConnection } from "./DB/db.connection";
import { glob } from "node:fs";
import { globalErrorHandler } from "./Middlewares";
import cors from'cors'

const app: Application = express();

//function to handle all project controllers
function initializeControllers(app: Application) {
  app.use("/api/auth", authController);
  app.use("/api/user", usersController);
  app.use("/api/post", postsController);
  app.use("/api/comments", commentsController);

  //health chek Router
  app.get("/", (req: Request, res: Response) => {
    res.json({ status: "success", message: "Health check" });
  });

  //404 not found handler
  app.use((req: Request, res: Response) => {
    res.status(404).json({ status: "error", message: "Not found" });
  });

  //Global handle middleware for error handling
  app.use(globalErrorHandler);
}

//function to handle common middlewares
function initializeCommonMiddlewares(app: Application) {
  app.use(cors(),express.json());
}

initializeCommonMiddlewares(app);

initializeControllers(app);
//Database connection
dbConnection();

const port: number | string = envConfig.app.port;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
