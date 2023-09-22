import { Router } from "express";
import userRouter from './component/users/user.route.js'
import postRouter from './component/post/post.route.js'
import commentRouter from './component/comment/comment.route.js'

const router = Router();

router.use('/user', userRouter)
router.use( '/post', postRouter )
router.use('/post/:postId/comment', commentRouter)


export default router;

