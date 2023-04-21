import { Link } from 'react-router-dom';

import { useEffect, useReducer } from 'react';



const reducer = (state, action) => {
  // eslint-disable-next-line default-case
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };

    case 'FETCH_SUCCESS':
      return { ...state, loading: false, products: action.payload };

    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

const HomeScreen = () => {
  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
    products: [],
  });
  useEffect(() => {
    dispatch({ type: 'FETCH_REQUEST' });
    const fetchProducts = async () => {
      try {
        const url = '/api/products';
        const response = await fetch(url);
        const data = await response.json();

        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err });
      }
    };

    fetchProducts();
  }, []);
  return (
    <div>
      <h1>Featured Products</h1>
      <div className="products">
        {loading ? (
          <div>Loading....</div>
        ) : error ? (
          <div>{error}</div>
        ) : (
          products.map((product) => (
            <div className="product" key={product.slug}>
              <Link to={`/product/${product.slug}`}>
                <img src={product.image} alt={product.name} />
              </Link>

              <div className="product-info">
                <Link to={`/product/${product.slug}`}>
                  <p>{product.name}</p>
                </Link>

                <p>
                  <strong>${product.price}</strong>
                </p>

                <button>Add to Cart</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HomeScreen;
