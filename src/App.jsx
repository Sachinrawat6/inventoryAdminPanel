import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Products from './components/Products';
import CSVUploader from './components/CSVUploader';
import ProductCSVUpload from './components/ProductUpdate';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <BrowserRouter>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 ml-65 p-6 min-h-screen">
          <Routes>
            <Route path='/' element={<Products />} />
            <Route 
              path='/upload-products' 
              element={
                <ProtectedRoute>
                  <CSVUploader />
                </ProtectedRoute>
              } 
            />
            <Route 
              path='/update-rack-space' 
              element={
                <ProtectedRoute>
                  <ProductCSVUpload />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;