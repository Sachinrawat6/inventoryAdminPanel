import React, { useState } from "react";
import Papa from "papaparse";
import axios from "axios";

const CSVUploader = () => {
  const [csvData, setCsvData] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setMessage("Processing CSV file...");
    setCsvData([]);
    
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => processParsedCSV(results.data),
      error: (error) => {
        setMessage(`❌ Error parsing CSV: ${error.message}`);
      }
    });
  };

  const processParsedCSV = async (rows) => {
    try {
      setMessage("Filtering and validating data...");
      
      const existingProducts = await axios.get("https://inventorybackend-m1z8.onrender.com/api/product");
      const existingVanSet = new Set(
        (existingProducts.data || []).map((product) => String(product.style_code))
      );
  
      const seenVans = new Set();
      const filteredData = [];
      const colorRegex = /^.*-(.*?)-.*$/;
  
      for (const row of rows) {
        const brand = row["brand"];
        let van = row["van"].toString();

        if (van.startsWith('8')) {
            // Replace the first character with '1'
            van = '1' + van.slice(1);
        } else if (van.startsWith('5')) {
            // Replace the first character with '3'
            van = '3' + van.slice(1);
        }
        
  
        if (!van || seenVans.has(van) || existingVanSet.has(String(van))) continue;
  
        seenVans.add(van);
  
        let color = "other";
        const skuCode = row["seller sku code"];
        const match = skuCode?.match(colorRegex);
        if (match) color = match[1];
  
        filteredData.push({
          style_id: row["style id"],
          style_name: row["style name"],
          mrp: row["mrp"],
          color,
          style_code: van,
        });
      }
  
      setCsvData(filteredData);
      setMessage(filteredData.length > 0 
        ? `✅ Found ${filteredData.length} valid new products` 
        : "⚠️ No new products found in CSV");
    } catch (error) {
      console.error("Error processing parsed CSV:", error);
      setMessage("❌ Failed to process CSV data");
    }
  };
  
  const handleUpload = async () => {
    if (!csvData.length) return;
    
    setUploading(true);
    setMessage("Starting upload...");
    setProgress(0);

    try {
      const total = csvData.length;
      let successful = 0;
      
      for (const [index, product] of csvData.entries()) {
        try {
          await axios.post("https://inventorybackend-m1z8.onrender.com/api/product", {
            style_id: Number(product.style_id),
            style_name: product.style_name,
            color: product.color,
            mrp: Number(product.mrp),
            rack_space: product.rack_space,
            style_code: Number(product.style_code),
          });
          successful++;
        } catch (err) {
          console.error(`Failed to upload product ${index + 1}:`, err);
        }
        
        const currentProgress = Math.floor(((index + 1) / total) * 100);
        setProgress(currentProgress);
        setMessage(`Uploading... ${index + 1}/${total} products`);
      }
      
      setMessage(`✅ Successfully uploaded ${successful}/${total} products`);
      if (successful < total) {
        setMessage(prev => prev + ` (${total - successful} failed)`);
      }
      setCsvData([]);
    } catch (err) {
      const errorMsg = err.response?.data?.msg || "Upload failed";
      setMessage(`❌ ${errorMsg}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Product CSV Upload</h2>
        <p className="text-gray-600 mt-1">
          Upload a CSV file to add new products to the inventory
        </p>
      </div>

      <div className="space-y-6">
        {/* File Upload Section */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
          <div className="flex flex-col items-center justify-center space-y-4">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <div>
              <label
                htmlFor="csv-upload"
                className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                Select CSV File
              </label>
              <input
                id="csv-upload"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
                disabled={uploading}
              />
              {/* <p className="mt-2 text-sm text-gray-500">
                or drag and drop file here
              </p> */}
            </div>
            {/* <a
              href="/SAMPLE.csv"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
              download
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download Sample CSV
            </a> */}
          </div>
        </div>

        {/* Status Section */}
        {message && (
          <div
            className={`p-4 rounded-lg ${
              message.startsWith("✅")
                ? "bg-green-50 text-green-800"
                : message.startsWith("❌")
                ? "bg-red-50 text-red-800"
                : "bg-blue-50 text-blue-800"
            }`}
          >
            <div className="flex items-center">
              {message.startsWith("✅") ? (
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : message.startsWith("❌") ? (
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="animate-spin w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              )}
              <span>{message}</span>
            </div>
            {progress > 0 && progress < 100 && (
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            )}
          </div>
        )}

        {/* Upload Button */}
        {csvData.length > 0 && (
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">
                Ready to upload <span className="font-medium">{csvData.length}</span> products
              </p>
            </div>
            <button
              onClick={handleUpload}
              disabled={uploading || csvData.length === 0}
              className={`px-6 py-3 rounded-md font-medium text-white ${
                uploading || csvData.length === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              } transition-colors`}
            >
              {uploading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Uploading...
                </span>
              ) : (
                "Upload Products"
              )}
            </button>
          </div>
        )}

        {/* Data Preview */}
        {csvData.length > 0 && (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-700">
                Preview (First 5 Items)
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Style Code
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Style Name
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Color
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      MRP
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {csvData.slice(0, 5).map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                        {item.style_code}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                        {item.style_name}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            item.color === "other"
                              ? "bg-gray-100 text-gray-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {item.color}
                        </span>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                        ₹{item.mrp}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CSVUploader;