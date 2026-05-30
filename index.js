import express from 'express';
import dotenv from 'dotenv'
import configureDB from './config/db.js';
import User from './model/userModel.js';
import axios from 'axios';
dotenv.config();

const PORT = process.env.PORT;

const app = express();
configureDB();

app.get('/api/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const userInDb = await User.findOne({ uid: id });

    if (userInDb) {
      return res.json({ message: 'Fetched from local', data: userInDb });
    }
    
    let userInRemote;
    try {
      userInRemote = await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`);
    } catch (err) {
      return res.status(404).json({ message: 'User not found either in local or remote' });
    }
    
    const { name, email, address: { city }} = userInRemote.data;

    let user = new User({ name, email, city, uid: id });

    user = await user.save();
    return res.json({ message: 'Fetched from remote', data: user });

  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Something went wrong' })
  }
})

app.listen(PORT, () => {
  console.log('Server started on PORT:', PORT);
})