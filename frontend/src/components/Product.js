import Card from 'react-bootstrap/Card';
import { Link, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { useContext } from 'react';

import Rating from './Rating';
import { Store } from '../Store';

const Product = (props) => {
  const { product } = props;
  const navigate = useNavigate();

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;
  const addToCartHandler = async (product) => {
    const id = product._id;
    const response = await fetch(`/api/products/${id}`);
    const data = await response.json();
    const ItemExists = cartItems.find((x) => x._id === product._id);
    const quantity = ItemExists ? ItemExists.quantity + 1 : 1;

    //console.log(data.countInStock);

    if (quantity > data.countInStock) {
      window.alert('Sorry! Item out of Stock');
      return;
    }

    ctxDispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
    navigate('/cart');
  };

  return (
    <Card>
      <Link to={`/product/${product.slug}`}>
        <img src={product.image} className="card-img-top" alt={product.name} />
      </Link>
      <Card.Body>
        <Link to={`/product/${product.slug}`}>
          <Card.Title>{product.name}</Card.Title>
        </Link>
        <Rating
          rating={product.rating}
          numReviews={product.numReviews}
        ></Rating>
        <Card.Text>
          <strong>${product.price}</strong>
        </Card.Text>
        {product.countInStock === 0 ? (
          <Button variant="light" disabled>Out of Stock</Button>
        ) : (
          <Button onClick={() => addToCartHandler(product)}>Add to Cart</Button>
        )}
      </Card.Body>
    </Card>
  );
};

export default Product;
