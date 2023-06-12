import express from 'express';
import Product from '../Models/productModel.js';
import User from '../Models/userModel.js';
import data from '../data.js';

const seedRouter = express.Router();

seedRouter.get('/', async (req, res) => {
  await Product.deleteMany({})
    .then((result) => {
      console.log(result);
    })
    .catch((err) => {
      console.log(err.message);
    });
  await User.deleteMany({})
    .then((result) => {
      console.log(result);
    })
    .catch((err) => {
      console.log(err.message);
    });
  const createdProducts = await Product.insertMany(data.products);
  const createdUsers = await User.insertMany(data.users);
  res.send({ createdProducts, createdUsers });
});

export default seedRouter;
