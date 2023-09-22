import { Router } from "express";
import controller from './post.controller.js'
import catchAsyncHelper from "../../helpers/catchAsync.helper.js";
import { isAuthenticatedUser } from "../../middleware/auth.js";

const {createPost, getSinglePost, getAllPost, updatePost, deletePost, likePost} = controller


const router = Router();

router.post( '/new',isAuthenticatedUser, catchAsyncHelper(createPost) );

router.get("/details/:id", isAuthenticatedUser, catchAsyncHelper(getSinglePost));

router.get("/allpost", isAuthenticatedUser, catchAsyncHelper(getAllPost));

router.patch("/update/:id", isAuthenticatedUser, catchAsyncHelper(updatePost));

router.delete("/delete/:id", isAuthenticatedUser, catchAsyncHelper(deletePost));

router.post("/likes", isAuthenticatedUser, catchAsyncHelper(likePost));


export default router;