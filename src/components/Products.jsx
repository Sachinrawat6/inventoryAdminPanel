import React, { useState, useEffect } from "react";

const Products = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetchProducts(); 
  }, []);

  const fetchProducts = async (searchQuery = "") => {
    setLoading(true);
    try {
      let url = `https://inventorybackend-m1z8.onrender.com/api/product`;
      if (searchQuery.length === 5) {
        url = `https://inventorybackend-m1z8.onrender.com/api/product?style_code=${searchQuery}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => fetchProducts(query);

  const viewProduct = (id, styleNumber) => {
    window.open(`https://www.myntra.com/jackets/qurvii%2b/styleNumber=${styleNumber}/${id}/buy`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }



  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-bold text-gray-800">
            Products Inventory
            <span className="text-red-500 ml-1 text-lg align-super">*</span>
          </h1>
          
          {/* Search Bar */}
          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow max-w-md">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full py-2 pl-4 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                type="search"
                placeholder="Enter style number..."
              />
              <svg 
                className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm"
              >
                Search
              </button>
              {query.length === 5 && (
                <button
                  onClick={() => {
                    setQuery("");
                    fetchProducts("");
                  }}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors shadow-sm"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Style Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Style ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Color</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MRP</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rack Space</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.length > 0 ? (
                products.map((product, idx) => (
                  <tr 
                    key={product.style_id} 
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{idx + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.style_code}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.style_id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`inline-flex text-blue-400 items-center px-2.5 py-0.5 rounded-full text-xs font-medium   ${product.color.toLowerCase()==="red"?"bg-red-300":"bg-blue-100"}`}>
                         {product.color}
                      </span>
                     
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{product.mrp}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.rack_space}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => viewProduct(product.style_id, product.style_code)}
                        className="text-blue-600 hover:text-blue-900 px-3 py-1 rounded-md bg-blue-50 hover:bg-blue-100 transition-colors"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                    {query.length === 5 ? "No products match your search" : "No products available"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Status Bar */}
        <div className="text-sm text-gray-500">
          Showing <span className="font-medium">{products.length}</span> results
          {query.length === 5 && (
            <span> for style number "<span className="font-medium">{query}</span>"</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;