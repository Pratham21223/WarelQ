// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import Dashboard from './components/Dashboard';
import DeliveryPage from './components/DeliveryPage';
import Receipts from './components/Receipts'; 
import Products from './components/Products'; 
import ProtectedRoute from "./components/ProtectedRoute";
import SignInPage from "../pages/SignIn";
import SignUpPage from "../pages/Signup";
import Homepage from "../pages/HomePage";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function App() {
  return ( 
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <BrowserRouter>
        <Routes>
          
          <Route path="/" element={<Homepage />}/>
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}/>
          <Route path="/signin" element={<SignInPage />}/>
          <Route path="/signup" element={<SignUpPage />}/>
          <Route
            path="/delivery"
            element={
              <ProtectedRoute>
                <DeliveryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/receipts"
            element={
              <ProtectedRoute>
                <Receipts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <Products />
              </ProtectedRoute>
            }
          />
        </Routes>  
      </BrowserRouter>
    </ClerkProvider>
  )
}

export default App;
