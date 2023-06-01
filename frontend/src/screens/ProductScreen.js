import { useReducer, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';

import Rating from '../components/Rating';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { getError } from '../utilis';
import { Store } from '../Store';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, product: action.payload };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const ProductScreen = () => {
  const navigate = useNavigate();
  const param = useParams();
  const { slug } = param;

  const [{ loading, error, product }, dispatch] = useReducer(reducer, {
    loading: true,
    error: null,
    product: [],
  });

  useEffect(() => {
    dispatch({ type: 'FETCH_REQUEST' });
    const fetchProduct = async () => {
      let response, data;
      try {
        const url = `/api/products/slug/${slug}`;
        response = await fetch(url);
        data = await response.json();

        //console.log('run');
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
        //console.log('notrun');
      }

      if (response.ok) {
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } else {
        dispatch({ type: 'FETCH_FAIL', payload: getError(data) });
      }
    };

    fetchProduct();
  }, [slug]);

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart } = state;
  const addToCartHandler = async () => {
    const id = product._id;
    const response = await fetch(`/api/products/${id}`);
    const data = await response.json();
    const ItemExists = cart.cartItems.find((x) => x._id === product._id);
    const quantity = ItemExists ? ItemExists.quantity + 1 : 1;

    //console.log(data.countInStock);

    if (quantity > data.countInStock) {
      window.alert('Sorry! Item out of Stock');
      return;
    }

    ctxDispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
    navigate('/cart');
  };

  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div className="product-Info">
      <Row>
        <Col md={6}>
          <img
            className="img-large"
            src={product.image}
            alt={product.name}
          ></img>
        </Col>

        <Col md={3}>
          <div>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <Helmet>
                  <title>{product.name}</title>
                </Helmet>
                <h1>{product.name}</h1>
              </ListGroup.Item>
              <ListGroup.Item>
                <Rating
                  rating={product.rating}
                  numReviews={product.numReviews}
                ></Rating>
              </ListGroup.Item>
              <ListGroup.Item>Price: ${product.price}</ListGroup.Item>
              <ListGroup.Item>
                Description: <p>{product.description}</p>
              </ListGroup.Item>
            </ListGroup>
          </div>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Price</Col>
                    <Col>${product.price}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Status: </Col>
                    <Col>
                      {product.countInStock > 0 ? (
                        <Badge bg="primary">In Stock</Badge>
                      ) : (
                        <Badge bg="danger">Out of Stock</Badge>
                      )}
                    </Col>
                  </Row>
                </ListGroup.Item>

                {product.countInStock > 0 && (
                  <ListGroup.Item>
                    <div className="d-grid">
                      <Button onClick={addToCartHandler} variant="primary">
                        Add to Cart
                      </Button>
                    </div>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProductScreen;
