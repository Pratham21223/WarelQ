// src/App.jsx
import { useState } from 'react';
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import Dashboard from './components/Dashboard';
import DeliveryPage from './components/DeliveryPage';
import Signin from './components/Signin';
import Signup from './components/Signup';
import Receipts from './components/Receipts'; 
import Products from './components/Products'; 
import ComponentShowcase from './components/ComponentShowcase';

function App() {
  // Toggle between dashboard and component showcase
  // const isDev = import.meta.env.DEV;
  // const [showShowcase, setShowShowcase] = useState(false);
  //   <>
  //     {isDev && (
  //       <button
  //         onClick={() => setShowShowcase(!showShowcase)}
  //         className="fixed top-4 right-4 z-50 bg-purple-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-purple-700 transition-colors"
  //       >
  //         {showShowcase ? 'View Dashboard' : 'View Components'}
  //       </button>
  //     )}
  //     {showShowcase ? <ComponentShowcase /> : <Dashboard />}
  //   </>
  // );
  return ( 
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />}/>
        <Route path="/delivery" element={<DeliveryPage />}/>
        <Route path="/signin" element={<Signin />}/>
        <Route path="/signup" element={<Signup />}/>
        <Route path="/receipts" element={<Receipts />}/>
        <Route path="/products" element={<Products />}/>
      </Routes>  
    </BrowserRouter>
  )
}

export default App;
