import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Products from './components/Products';
import CSVUploader from './components/CSVUploader';
import ProductCSVUpload from './components/ProductUpdate';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Register from './components/Register';
import Login from './components/Login';
import AuthForm from './components/AuthForm';

const App = () => {
  return (
    <BrowserRouter>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 ml-65 p-6 min-h-screen">
          <Navbar/>
          <Routes>
            {/* Public Routes */}
            {/* <Route path="/login" element={<Login />} /> */}
            {/* <Route path="/register" element={<Register />} /> */}
             <Route path="/" element={<Products />} />
              <Route path="/upload-products" element={<CSVUploader />} />
              <Route path="/update-rack-space" element={<ProductCSVUpload />} />
            
            
            {/* Protected Routes Group
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Products />} />
              <Route path="/upload-products" element={<CSVUploader />} />
              <Route path="/update-rack-space" element={<ProductCSVUpload />} />
            </Route> */}
            
            {/* Catch-all route */}
            {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;