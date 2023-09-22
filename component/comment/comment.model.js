import { Schema, model as Model } from "mongoose";


const commentSchema = new Schema({
  comment: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  }
}, {
    versionKey: false,
    timestamps:true
} );


const Comment = Model( 'Comment', commentSchema )
export default Comment;