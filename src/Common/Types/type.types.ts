import z from "zod";
import { SignInSchema, Signup } from "../../Validators/auth.validators";


export type SignUpBodyType = z.infer<typeof Signup.body>  
export  type SignInBodyType = z.infer<typeof SignInSchema.body>