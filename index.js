import express from 'express';
import dotenv from 'dotenv'
import configureDB from './config/db.js';
import User from './model/userModel.js';
import axios from 'axios';
import userController from './controller/userController.js';
dotenv.config();

const PORT = process.env.PORT;

const app = express();
configureDB();

app.get('/api/users/:id', userController.getUserByUid);

app.listen(PORT, () => {
  console.log('Server started on PORT:', PORT);
})