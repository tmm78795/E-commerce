import express from 'express';
import Product from '../Models/productModel.js';
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
  const createdProducts = await Product.insertMany(data.products);
  res.send({ createdProducts });
});


export default seedRouter;
