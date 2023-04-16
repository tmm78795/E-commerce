import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';


import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen'

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div>
        <header>
          <Link to="/">ShopEasy</Link>
        </header>
        <Routes>
          <Route path='/product/:slug' element={<ProductScreen />} ></Route>
          <Route path="/" element={<HomeScreen />}></Route>
        </Routes>
       
      </div>
    </BrowserRouter>
  );
}

export default App;
