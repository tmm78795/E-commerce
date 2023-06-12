import express from 'express';
import Product from '../Models/productModel.js';

const productRouter = express.Router();

productRouter.get('/', async (req, res) => {
  // const products = await Product.find();

  // res.send(products);
  try {
    const product = await Product.find();
    res.send(product);
  } catch (err) {
    res.status(404).send({ message: 'No Product found' });
  }
});

productRouter.get('/slug/:slug', async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    res.send(product);
  } catch (err) {
    res.status(404).send({ message: 'Product not found' });
  }
});

productRouter.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.send(product);
  } catch (err) {
    res.status(404).send({ message: 'Product not found' });
  }
});

export default productRouter;
