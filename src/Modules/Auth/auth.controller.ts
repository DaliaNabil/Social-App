import { NextFunction, Request, Response, Router } from "express";
import authService from "./auth.service";
import { BadRequstException } from "../../Common/Utils";
import { responseFormatter, validation } from "../../Middlewares";
import { SignInSchema, Signup } from "../../Validators/auth.validators";
import User from "../../DB/Models/user.models";
const authController = Router();

authController.get( "/health", responseFormatter(async (req: Request, res: Response, next: NextFunction) => {
    const result = await authService.health(req.body);
    return {
      message: "Health check completed successfully",
      data: result,
      meta: { statusCode: 200 },
    };
  }),
);

authController.post( "/signup",validation(Signup), responseFormatter(async (req: Request, res: Response, next: NextFunction) => {
    const result = await authService.signUp(req.body);
    return {
      message: "User signed up successfully",
      data: result,
      meta: { statusCode: 201 },
    };
  }),
);

authController.post('/signin', validation(SignInSchema), responseFormatter(async (req: Request, res: Response, next: NextFunction) => {
    const result = await authService.SignIn(req.body);
    return {
      message: "User signed in successfully",
      data: result,
      meta: { statusCode: 200 },
    };
  })
)

authController.get('/users', responseFormatter(async (req :Request, res:Response, next:NextFunction) => {
    const users = await User.find({}); 
    return {
        message: "Users fetched successfully",
        data: users,
    };
}));
export default authController;
