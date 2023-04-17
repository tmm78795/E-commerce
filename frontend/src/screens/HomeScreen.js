import { Link } from "react-router-dom"

import { useEffect, useState } from "react"

const HomeScreen = () => {

  const [products, setProducts] = useState([])
  useEffect(() => {
    
    const fetchProducts = async () => {
      const url = "/api/products";
      const response = await fetch(url)
      const data = await response.json()

      if(response.ok) {
        setProducts(data)
       
      } 
    }

    fetchProducts()
    
  }, [])
    return (
        <div>
             <h1>Featured Products</h1>
        <div className="products">
          {products.map((product) => (
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
          ))}
        </div>
        </div>
    )
}

export default HomeScreen