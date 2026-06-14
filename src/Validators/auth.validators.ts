import  z from "zod"
import { GENDER } from "../Common/Types"

export const Signup = {
    body:z.object({
        firstName:z.string().min(2, "First name must be at least 2 characters"),
        lastName:z.string().min(2, "Last name must be at least 2 characters"),
        email:z.email({error:"Invalid email address"}),
        password:z.string().regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/),
        confirmPassword:z.string().regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/),
        phone:z.string().optional(),
        gender:z.enum(GENDER).optional(),  
        age:z.number().optional(),
        workExperience:z.array(z.object({
            company:z.string(),
            position:z.string().min(2).max(100),
            startDate:z.iso.date(),
            endDate:z.iso.date().optional(),
            description:z.string().optional(),
            currentlyWorking:z.boolean().optional()
        })).optional()  ,
            
    }).superRefine((val, ctx) => {
        if(val.password !== val.confirmPassword) {
            ctx.addIssue({
                code:'custom',
                message: "Passwords don't match",
                path: ["confirmPassword"]
            });
        }
        if(val.workExperience?.length) {
            val.workExperience.forEach((workExperience, index) => {
                if(workExperience.endDate && workExperience.startDate > workExperience.endDate) {
                    ctx.addIssue({
                        code:'custom',
                        message: "Start date must be before end date",
                        path: ["workExperience", index, "startDate"]
                    });
                }
            });
        }
    })
}

export const SignInSchema = {
  body: z.object({
    email: z.email({ message: "Invalid email address" }),
    
    password: z.string().regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
      message: "Password must be at least 8 characters long and contain both letters and numbers",
    }),
  }),
}