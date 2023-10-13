import express from 'express';
import mongoose from 'mongoose';


import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from './models/user';

import Article from './models/article';
import auth from './middleware/auth';




mongoose.connect('mongodb://localhost:27017/myapp', {
});




const app = express();
const PORT = 3000;



interface CustomRequest extends express.Request {
  user?: { _id: any }; // Replace with the actual user type from your authentication middleware
}




app.use(express.json());

app.post('/signup', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      throw new Error();
    }
    const token = jwt.sign({ _id: user._id.toString() }, 'mysecret');
    res.send({ user, token });
  } catch (error) {
    res.status(400).send();
  }
});




// Articles
// CREATE an article
app.post('/articles', auth, async (req: CustomRequest, res) => {
  try {
    const article = await Article.create({
      ...req.body,
      author: req.user!._id, // Use the non-null assertion operator because TypeScript can't be sure req.user exists
    });
    res.status(201).send(article);
  } catch (error) {
    res.status(400).send(error);
  }
});







  // READ all articles
app.get('/articles', auth, async (req, res) => {
    try {
      const articles = await Article.find({});
      res.send(articles);
    } catch (error) {
      res.status(500).send();
    }
  });




  // READ a specific article by ID
app.get('/articles/:id', auth, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).send();
    }
    res.send(article);
  } catch (error) {
    res.status(500).send();
  }
});






// DELETE an article by ID
app.delete('/articles/:id', auth, async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) {
      return res.status(404).send();
    }
    res.send(article);
  } catch (error) {
    res.status(500).send();
  }
});






app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
