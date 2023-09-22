import User from "../users/user.model.js";
import Post from "./post.model.js";
import { RequestHandler } from "../../helpers/requestHandler.helper.js";
import constant from "../../utils/constant.js";
import mongoose from "mongoose";




export default {
  // Create New Post
  createPost: async (req, res) => {
    const { title, images, description } = req.body;

    const post = await Post.create({
      title,
      images,
      description,
      user: req.user._id,
    });

    res.send({
      success: true,
      message: "Your Post uploaded succesfully",
      post,
    });
  },

  // Fetching details of all post
    getAllPost: async ( req, res ) => {
    const allPost = await Post.find();
    return RequestHandler.Success({
      res,
      statusCode: 200,
      message: constant.YOUR_POST,
      data: allPost,
    });
  },

  // Fetching details of a single post
    getSinglePost: async ( req, res ) => {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return RequestHandler.Error({
        res,
        statusCode: 400,
        error: constant.INVALID_ID,
      });
    }
    const data = await Post.findById(id);
    if (!data) {
      return RequestHandler.Error({
        res,
        statusCode: 404,
        message: constant.NO_POST_FOUND,
        error,
      });
    }
    return RequestHandler.Success({
      res,
      statusCode: 200,
      message: constant.YOUR_POST,
      data: data,
    });
  },

  // update the post
  updatePost: async (req, res) => {
      const { id } = req.params;
      

    if (!mongoose.isValidObjectId(id)) {
      return RequestHandler.Error({
        res,
        statusCode: 400,
        error: constant.INVALID_ID,
      });
    }

    const { title, images, description } = req.body;
    let data = await Post.findByIdAndUpdate(
      id,
      { title, images, description },
      { new: true }
    );

    if (!data) {
      return RequestHandler.Error({
        res,
        statusCode: 404,
        message: constant.NO_POST_FOUND,
        error,
      });
    }
    return RequestHandler.Success({
      res,
      statusCode: 200,
      message: constant.POST_UPDATED,
      data: data,
    });
  },

  // delete a post

  deletePost: async (req, res) => {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return RequestHandler.Error({
        res,
        statusCode: 400,
        error: constant.INVALID_ID,
      });
    }
    const data = await Post.findByIdAndDelete(id);
    if (!data) {
      return RequestHandler.Error({
        res,
        statusCode: 404,
        message: constant.NO_POST_FOUND,
      });
    }
    return RequestHandler.Success({
      res,
      statusCode: 200,
      message: constant.POST_DELETED,
      data: data,
    });
  },

  // like a post

  likePost: async (req, res) => {
    const { postId } = req.body;

    const data = await Post.findOneAndUpdate(
      { _id: postId },
      { $addToSet: { likes: req.user._id } }
    );
    if (!data) {
      return RequestHandler.Error({ res, error: constant.NO_POST_FOUND });
    }
    return RequestHandler.Success({
      res,
      message: constant.LIKED_A_POST,
    });
  },
};