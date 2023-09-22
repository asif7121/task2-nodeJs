import mongoose from "mongoose";
import Post from "../post/post.model.js"
import Comment from "./comment.model.js";
import { RequestHandler } from "../../helpers/requestHandler.helper.js";
import constant from "../../utils/constant.js";



export default {
    // create a comment
    createComment: async ( req, res ) => {
        const { postId } = req.params;

         if (!mongoose.isValidObjectId(postId)) {
           return RequestHandler.Error({
             res,
             statusCode: 400,
             error: constant.INVALID_ID,
           });
    }
    const post = await Post.findById( postId );
    if(!post) return RequestHandler.Error({res, message: constant.NO_POST_FOUND})

    const {comment} = req.body
    const newComment = await Comment.create( {
      comment,
      user: req.user._id
    })
    
    post.comments.push(newComment);

    await newComment.save();
    await post.save();

    res.status(201).send({success:true, post})
         
    },


    // delete a comment

    deleteComment: async ( req, res ) => {
        
        const { postId, commentId } = req.params;

       const post =  await Post.findByIdAndUpdate( postId, { $pull: { comments: commentId } } );

        await Comment.findByIdAndDelete( commentId,{new:true} )
        
        res.status(200).send({success:true,message: 'Comment deleted successfully' ,post})
    }
}
