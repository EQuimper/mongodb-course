const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: {
    type: String
  },
  // userId: {
  //   type: Schema.Type.ObjectId,
  //   ref: 'User'
  // }
});

// const Post = mongoose.model('post', PostSchema);

module.exports = PostSchema;
