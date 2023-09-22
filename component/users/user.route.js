import { Router } from "express";
import controller from './user.controller.js'
import catchAsync from "../../helpers/catchAsync.helper.js";
const {loginUser, logoutUser, registerUser, forgotPassword, resetPassword} = controller

const router = Router();

router.post( '/login', catchAsync(loginUser) )

router.get("/logout", catchAsync(logoutUser));

router.post( '/register', catchAsync(registerUser) )

router.post("/password/forgot", catchAsync(forgotPassword));

router.patch("/password/reset/:token", catchAsync(resetPassword));



export default router