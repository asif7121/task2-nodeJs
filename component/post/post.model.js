import { Schema, model as Model } from "mongoose";

const postSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  images: [
    {
      url: {
        type: String,
        required: true,
      },
    },
  ],
    description: {
        type: String,
        required:true
    },

    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        // required: true
    },

    comments: [
        {
            type: Schema.Types.ObjectId,
            ref:'Comment'
        }
    ],

  likes: [
    Schema.Types.ObjectId,
    ],
    
  
  
  
},
    {
        versionKey: false,
        timestamps:true
}
);


const Post = Model( 'Post', postSchema );
export default Post;