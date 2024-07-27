Name: Vaibhav Vats Id: CTDSP151 Domain: Full Stack Web Developer Position: Intern

Here's the README file for the blogging platform:

---

# Blogging Platform

A dynamic blogging platform built using the MERN stack (MongoDB, Express.js, React.js, Node.js) and styled with Tailwind CSS. This platform allows users to sign up, create, edit, and delete blog posts. Additionally, it features user authentication, comment sections, and a responsive design for optimal viewing on various devices.

## Features

1. **User Authentication**

   - Sign up
   - Log in
   - Password reset

2. **Blog Posts**

   - Create new posts
   - Edit existing posts
   - Delete posts
   - View all posts
   - View individual posts

3. **Comments**

   - Add comments to posts
   - Edit comments
   - Delete comments

4. **Responsive Design**
   - Mobile-friendly design using Tailwind CSS

## Project Structure

### Backend (Node.js, Express.js, MongoDB)

1. **Setup**

   - Initialize the project

   ```bash
   mkdir blogging-platform
   cd blogging-platform
   npm init -y
   ```

   - Install dependencies

   ```bash
   npm install express mongoose bcryptjs jsonwebtoken
   npm install --save-dev nodemon
   ```

2. **Express Server**

   - Create an `index.js` file to set up the server

   ```javascript
   const express = require("express");
   const mongoose = require("mongoose");
   const app = express();

   app.use(express.json());

   mongoose.connect("mongodb://localhost:27017/blogging_platform", {
     useNewUrlParser: true,
     useUnifiedTopology: true,
   });

   app.get("/", (req, res) => {
     res.send("Hello World");
   });

   app.listen(5000, () => {
     console.log("Server is running on port 5000");
   });
   ```

3. **Models**

   - User Model

   ```javascript
   const mongoose = require("mongoose");

   const userSchema = new mongoose.Schema({
     username: { type: String, required: true, unique: true },
     email: { type: String, required: true, unique: true },
     password: { type: String, required: true },
   });

   module.exports = mongoose.model("User", userSchema);
   ```

   - Post Model

   ```javascript
   const mongoose = require("mongoose");

   const postSchema = new mongoose.Schema({
     title: { type: String, required: true },
     content: { type: String, required: true },
     author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
     date: { type: Date, default: Date.now },
   });

   module.exports = mongoose.model("Post", postSchema);
   ```

   - Comment Model

   ```javascript
   const mongoose = require("mongoose");

   const commentSchema = new mongoose.Schema({
     content: { type: String, required: true },
     author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
     post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
     date: { type: Date, default: Date.now },
   });

   module.exports = mongoose.model("Comment", commentSchema);
   ```

4. **Authentication**

   - Set up routes for user authentication

   ```javascript
   const express = require("express");
   const bcrypt = require("bcryptjs");
   const jwt = require("jsonwebtoken");
   const User = require("./models/User");

   const router = express.Router();

   // Sign Up
   router.post("/signup", async (req, res) => {
     const { username, email, password } = req.body;
     const hashedPassword = await bcrypt.hash(password, 10);

     const user = new User({
       username,
       email,
       password: hashedPassword,
     });

     await user.save();
     res.status(201).send("User created");
   });

   // Login
   router.post("/login", async (req, res) => {
     const { email, password } = req.body;
     const user = await User.findOne({ email });

     if (!user) {
       return res.status(400).send("User not found");
     }

     const isMatch = await bcrypt.compare(password, user.password);

     if (!isMatch) {
       return res.status(400).send("Invalid credentials");
     }

     const token = jwt.sign({ userId: user._id }, "your_jwt_secret");
     res.json({ token });
   });

   module.exports = router;
   ```

5. **Post and Comment Routes**

   - Set up routes for creating, editing, and deleting posts and comments

   **Post Routes**

   ```javascript
   const express = require("express");
   const Post = require("./models/Post");
   const auth = require("./middleware/auth");

   const router = express.Router();

   // Create Post
   router.post("/posts", auth, async (req, res) => {
     const { title, content } = req.body;
     const post = new Post({
       title,
       content,
       author: req.user._id,
     });

     await post.save();
     res.status(201).send("Post created");
   });

   // Edit Post
   router.put("/posts/:id", auth, async (req, res) => {
     const { title, content } = req.body;
     await Post.findByIdAndUpdate(req.params.id, { title, content });
     res.send("Post updated");
   });

   // Delete Post
   router.delete("/posts/:id", auth, async (req, res) => {
     await Post.findByIdAndDelete(req.params.id);
     res.send("Post deleted");
   });

   // Get All Posts
   router.get("/posts", async (req, res) => {
     const posts = await Post.find().populate("author");
     res.json(posts);
   });

   // Get Single Post
   router.get("/posts/:id", async (req, res) => {
     const post = await Post.findById(req.params.id).populate("author");
     res.json(post);
   });

   module.exports = router;
   ```

   **Comment Routes**

   ```javascript
   const express = require("express");
   const Comment = require("./models/Comment");
   const auth = require("./middleware/auth");

   const router = express.Router();

   // Add Comment
   router.post("/comments", auth, async (req, res) => {
     const { content, postId } = req.body;
     const comment = new Comment({
       content,
       author: req.user._id,
       post: postId,
     });

     await comment.save();
     res.status(201).send("Comment added");
   });

   // Edit Comment
   router.put("/comments/:id", auth, async (req, res) => {
     const { content } = req.body;
     await Comment.findByIdAndUpdate(req.params.id, { content });
     res.send("Comment updated");
   });

   // Delete Comment
   router.delete("/comments/:id", auth, async (req, res) => {
     await Comment.findByIdAndDelete(req.params.id);
     res.send("Comment deleted");
   });

   module.exports = router;
   ```

### Frontend (React.js, Tailwind CSS)

1. **Setup**

   - Create a new React app

   ```bash
   npx create-react-app client
   cd client
   ```

   - Install Tailwind CSS

   ```bash
   npm install -D tailwindcss
   npx tailwindcss init
   ```

   **tailwind.config.js**

   ```javascript
   module.exports = {
     content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
     theme: {
       extend: {},
     },
     plugins: [],
   };
   ```

   **index.css**

   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

2. **Components**

   - Create components for authentication, posts, and comments

   **Auth Component**

   ```javascript
   import React, { useState } from "react";
   import axios from "axios";

   const Auth = () => {
     const [email, setEmail] = useState("");
     const [password, setPassword] = useState("");

     const handleLogin = async () => {
       const response = await axios.post("/login", { email, password });
       localStorage.setItem("token", response.data.token);
     };

     return (
       <div>
         <input
           type="email"
           placeholder="Email"
           value={email}
           onChange={(e) => setEmail(e.target.value)}
         />
         <input
           type="password"
           placeholder="Password"
           value={password}
           onChange={(e) => setPassword(e.target.value)}
         />
         <button onClick={handleLogin}>Login</button>
       </div>
     );
   };

   export default Auth;
   ```

   **Post Component**

   ```javascript
   import React, { useState, useEffect } from 'react';
   import axios from 'axios';

   const Posts = () => {
     const [posts, setPosts] = useState([]);

     useEffect(() => {
       const fetchPosts = async () => {
         const response = await axios.get('/posts');
         setPosts(response.data);
       };

       fetchPosts();
     }, []);

     return (
       <div>
         {posts.map((post) => (
           <div key={post._id}>
             <h2>{post.title}</h2>
             <p>{post.content}</p>
           </div>
         ))}

   ```

 </div>
      );
    };

    export default Posts;
    ```

**Comment Component**
```javascript
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
    ```

3. **Integrate with Backend**

   - Use Axios for making API requests to the backend
   - Implement Redux or Context API for state management if necessary

4. **Style with Tailwind CSS**

   - Use Tailwind CSS classes to style the components
   - Ensure the design is responsive and works well on various devices
