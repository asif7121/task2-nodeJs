import { Router } from "express";
import controller from './comment.controller.js'
import { isAuthenticatedUser } from "../../middleware/auth.js";


const {createComment, deleteComment} = controller


const router = Router( { mergeParams: true } );

router.post( '/',isAuthenticatedUser, createComment );

router.delete("/:commentId", isAuthenticatedUser, deleteComment);


export default router;
