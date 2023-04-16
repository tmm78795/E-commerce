import { useParams } from 'react-router-dom';

const ProductScreen = () => {
  const param = useParams();
  const { slug } = param;

  return (
    <div>
      <h1>{slug}</h1>
    </div>
  );
};

export default ProductScreen;
