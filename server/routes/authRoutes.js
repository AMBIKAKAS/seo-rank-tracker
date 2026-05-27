import express from "express";
import {register,login,getUser} from "../controllers/authController";
import auth from "../middleware/auth";


const authRouter = express.Router()

authRouter.post('/register',register);
authRouter.post('/login',login);
authRouter.get('/user',getUser);

export default authRouter;
