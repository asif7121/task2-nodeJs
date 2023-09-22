import User from "../component/users/user.model.js";
import catchAsyncHelper from "../helpers/catchAsync.helper.js";
import ErrorHandler from "../utils/errorHandler.js";
import constant from '../utils/constant.js'
import jwt from "jsonwebtoken";


 export const isAuthenticatedUser = catchAsyncHelper(async (req, res, next) => {
   const { token } = req.cookies;

   if (!token) {
     return next(new ErrorHandler(constant.LOGIN_FIRST, 401));
   }
   const decodedData = jwt.verify(token, process.env.JWT_SECRET);

   req.user = await User.findById(decodedData.id);
   next();
 });