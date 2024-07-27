const express = require('express');
const Comment = require('./models/Comment');
const auth = require('./middleware/auth');

const router = express.Router();

// Add Comment
router.post('/comments', auth, async (req, res) => {
  const { content, postId } = req.body;
  const comment = new Comment({
    content,
    author: req.user._id,
    post: postId,
  });

  await comment.save();
  res.status(201).send('Comment added');
});

// Edit Comment
router.put('/comments/:id', auth, async (req, res) => {
  const { content } = req.body;
  await Comment.findByIdAndUpdate(req.params.id, { content });
  res.send('Comment updated');
});

// Delete Comment
router.delete('/comments/:id', auth, async (req, res) => {
  await Comment.findByIdAndDelete(req.params.id);
  res.send('Comment deleted');
});

module.exports = router;
