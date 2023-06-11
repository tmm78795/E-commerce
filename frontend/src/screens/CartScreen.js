import { useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import { Link, useNavigate } from 'react-router-dom';

import { Store } from '../Store';
import MessageBox from '../components/MessageBox';
import Button from 'react-bootstrap/esm/Button';

export const CartScreen = () => {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const updateCartHandler = async (product, quantity) => {
    const id = product._id;
    const response = fetch(`/api/products/${id}`);
    const data = (await response).json();

    if (quantity > data.countInStock) {
      window.alert('Sorry! Item out of Stock');
      return;
    }

    ctxDispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
  };

  const deleteItemHandler = (product) => {
    ctxDispatch({ type: 'CART_REMOVE_ITEM', payload: product });
  };

  const checkoutHandler = () => {
    navigate('/signIn?redirect=/shipping');
  };

  return (
    <div>
      <Helmet>
        <title>Add to Cart </title>
      </Helmet>

      <h1>Shopping Cart:</h1>
      <Row>
        <Col md={8}>
          {cartItems.length === 0 ? (
            <MessageBox>
              Cart is Empty <Link to="/">Go to HomePage</Link>
            </MessageBox>
          ) : (
            <ListGroup>
              {cartItems.map((product) => (
                <ListGroup.Item key={product._id}>
                  <Row className="align-items-center">
                    <Col md={4}>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="img-fluid rounded img-thumbnail"
                      ></img>{' '}
                      {'  '}
                      <Link to={`/products/slug/${product.slug}`}>
                        {product.name}
                      </Link>
                    </Col>
                    <Col md={3}>
                      <Button
                        variant="light"
                        onClick={() =>
                          updateCartHandler(product, product.quantity - 1)
                        }
                        disabled={product.quantity === 1}
                      >
                        <i className="fas fa-minus-circle"></i>
                      </Button>{' '}
                      <span>{product.quantity}</span>
                      <Button
                        onClick={() =>
                          updateCartHandler(product, product.quantity + 1)
                        }
                        variant="light"
                        disabled={product.quantity === product.countInStock}
                      >
                        <i className="fas fa-plus-circle"></i>
                      </Button>
                    </Col>
                    <Col md={3}>${product.price}</Col>
                    <Col md={2}>
                      <Button
                        variant="light"
                        onClick={() => deleteItemHandler(product)}
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          {cartItems.length > 0 && (
            <Card>
              <Card.Body>
                <ListGroup variant="flush">
                  <ListGroup.Item key={'hhh'}>
                    <h3>
                      Subtotal:({cartItems.reduce((a, c) => a + c.quantity, 0)}{' '}
                      items) ${' '}
                      {cartItems.reduce((a, c) => a + c.quantity * c.price, 0)}
                    </h3>
                  </ListGroup.Item>
                  <ListGroup.Item key={'hhhhh'}>
                    <div className="d-grid">
                      <Button variant="primary" onClick={checkoutHandler}>
                        Go to Checkout
                      </Button>
                    </div>
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
};
