import express from 'express';
import Product from "../Models/productModel.js"

const productRouter = express.Router();

productRouter.get('/', (req, res) => {
  res.send(data.products);
});

productRouter.get('/slug/:slug', async (req, res) => {
  const product = await Product.findOne({slug:req.params.slug});

  product
    ? res.send(product)
    : res.status(404).send({ message: 'Product not found' });
});

productRouter.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);

  product
    ? res.send(product)
    : res.status(404).send({ message: 'Product not found' });
});

export default productRouter;