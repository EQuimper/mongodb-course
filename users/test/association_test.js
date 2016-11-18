const mongoose = require('mongoose');
const assert = require('assert');
const User = require('../src/user');
const Comment = require('../src/comment');
const BlogPost = require('../src/blogPost');

describe('Associations', () => {
  let joe, blogPost, comment;
  beforeEach(done => {
    joe = new User({ name: 'Joe' });
    blogPost = new BlogPost({ title: 'JS is Great', content: 'Yes it his.'});
    comment = new Comment({ content: 'Congrats on great post' });

    joe.blogPosts.push(blogPost);
    blogPost.comments.push(comment);
    comment.user = joe;

    Promise.all([joe.save(), blogPost.save(), comment.save()])
      .then(() => done());
  });

  // Can test a test only with it.only
  it('saves a relation between a user and a blogpost', done => {
    User.findOne({ name: 'Joe' })
      .populate('blogPosts')
      .then(user => {
        assert(user.blogPosts[0].title === 'JS is Great');
        done();
      });
  });

  it('save a full relation tree', done => {
    User.findOne({ name: 'Joe' })
      .populate({
        path: 'blogPosts',
        populate: {
          path: 'comments',
          model: 'comment',
          populate: {
            path: 'user',
            model: 'user'
          }
        }
      })
      .then(user => {
        const { blogPosts } = user;
        const { comments } = blogPosts[0];
        assert(blogPosts[0].title === 'JS is Great');
        assert(comments[0].content === 'Congrats on great post');
        assert(comments[0].user.name === 'Joe');
        done();
      });
  });
});
