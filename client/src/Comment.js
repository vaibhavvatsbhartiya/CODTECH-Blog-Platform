import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Comments = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      const response = await axios.get(`/comments?postId=${postId}`);
      setComments(response.data);
    };

    fetchComments();
  }, [postId]);

  const handleAddComment = async () => {
    await axios.post('/comments', { content, postId });
    setContent('');
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Add a comment"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button onClick={handleAddComment}>Add Comment</button>
      {comments.map((comment) => (
        <div key={comment._id}>
          <p>{comment.content}</p>
        </div>
      ))}
    </div>
  );
};

export default Comments;
