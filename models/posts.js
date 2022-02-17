const mongoose = require("mongoose");

const PostsSchema = new mongoose.Schema({
  postID:Number,
  twitter:{
    type:Boolean,
    default:false
  },
  instagram:{
    type:Boolean,
    default:false
  },
  facebook:{
    type:Boolean,
    default:false
  }
});

module.exports = mongoose.model("Posts", PostsSchema);