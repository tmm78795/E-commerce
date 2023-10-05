import React, { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import { toast } from 'react-toastify';
import { Store } from '../Store';
import { getError } from '../utilis';
import LoadingBox from '../components/LoadingBox';

const reducer = (state, action) => {
  switch (action.type) {
    case 'CREATE_REQUEST':
      return { ...state, loading: true };
    case 'SUCCESS_REQUEST':
      return { ...state, loading: false };
    case 'FAIL_REQUEST':
      return { ...state, loading: false };

    default:
      return state;
  }
};

export default function PlaceOrderScreen() {
  const navigate = useNavigate();

  const [{ loading }, dispatch] = useReducer(reducer, {
    loading: false,
  });

  const { state, dispatch: ctxDispatch } = useContext(Store);

  const { cart, userInfo } = state;
  const { cartItems, shippingAddress, paymentMethod } = cart;

  cart.itemsPrice = cartItems.reduce((a, c) => a + c.quantity * c.price, 0);

  cart.shippingPrice = cart.itemsPrice > 100 ? 0 : 10;

  cart.taxPrice = 0.15 * cart.itemsPrice;

  cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;

  const placeOrderHandler = async () => {
    let data;
    dispatch('CREATE_REQUEST');
    try {
      let url = '/api/order/';
      const body = {
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      };

      const res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          authorization: `Bearer ${userInfo.token}`,
          'Content-Type': 'application/json',
        },
      });
      data = await res.json();

      ctxDispatch({ type: 'CART_CLEAR' });
      dispatch({ type: 'SUCCESS_REQUEST' });
      navigate(`/order/${data.order._id}`);
    } catch (err) {
      dispatch({type: 'FAIL_REQUEST'});
      toast.error(getError(err));
    }
  };

  useEffect(() => {
    if (!cart.paymentMethod) {
      navigate('/payment');
    }
  }, [cart, navigate]);

  return (
    <div>
      <Helmet>
        <title>Order Preview</title>
      </Helmet>
      <h1>Order Preview:</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Shipping:</Card.Title>

              <p>
                <b>Name: </b>
                {shippingAddress.fullName}
              </p>
              <p>
                <b>Address: </b>
                {shippingAddress.address}, {shippingAddress.city},
                {shippingAddress.postalCode}, {shippingAddress.country}
              </p>

              <Link to="/shipping">Edit</Link>
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Payment:</Card.Title>

              <p>
                <b>Method: </b>
                {paymentMethod}
              </p>

              <Link to="/payment">Edit</Link>
            </Card.Body>
          </Card>

          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Item:</Card.Title>
              <ListGroup variant="flush">
                {cartItems.map((item) => (
                  <ListGroup.Item key={item._id}>
                    <Row className="align-items-center">
                      <Col md={6}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="img-fluid rounded img-thumbnail"
                        ></img>{' '}
                        <Link to={`/product/${item.slug}`}>{item.name}</Link>
                      </Col>
                      <Col md={3}>{item.quantity}</Col>
                      <Col md={3}>${item.price}</Col>
                      {/* <Col md={3}>${typeof item.price}</Col>
                      <Col md={3}>${cart.itemsPrice}</Col> */}
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>

              <Link to="/cart">Edit</Link>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Order Summary:</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Items:</Col>
                    <Col>${cart.itemsPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Shipping:</Col>
                    <Col>${cart.shippingPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <Col>Tax:</Col>
                    <Col>${cart.taxPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <Col>
                      <strong>Total:</strong>
                    </Col>
                    <Col>${cart.totalPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      type="button"
                      onClick={placeOrderHandler}
                      disabled={cartItems.length === 0}
                    >
                      Place Order
                    </Button>
                  </div>
                  {loading && <LoadingBox></LoadingBox>}
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
