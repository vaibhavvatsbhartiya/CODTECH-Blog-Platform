const express = require('express');
const Post = require('./models/Post');
const auth = require('./middleware/auth');

const router = express.Router();

// Create Post
router.post('/posts', auth, async (req, res) => {
  const { title, content } = req.body;
  const post = new Post({
    title,
    content,
    author: req.user._id,
  });

  await post.save();
  res.status(201).send('Post created');
});

// Edit Post
router.put('/posts/:id', auth, async (req, res) => {
  const { title, content } = req.body;
  await Post.findByIdAndUpdate(req.params.id, { title, content });
  res.send('Post updated');
});

// Delete Post
router.delete('/posts/:id', auth, async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.send('Post deleted');
});

// Get All Posts
router.get('/posts', async (req, res) => {
  const posts = await Post.find().populate('author');
  res.json(posts);
});

// Get Single Post
router.get('/posts/:id', async (req, res) => {
  const post = await Post.findById(req.params.id).populate('author');
  res.json(post);
});

module.exports = router;
