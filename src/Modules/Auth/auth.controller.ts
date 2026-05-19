
import {Router} from "express"
import authService from "./auth.service";
const authController = Router();

authController.get('/health',async (req, res) => {
    const  result = await authService.health(req.body)
    console.log(result);
    res.status(200).json({ message: 'Auth route is working' ,result});
});


export default authController;