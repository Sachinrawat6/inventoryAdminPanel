// import React, { useEffect, useState } from "react";
// import Papa from "papaparse";
// import axios from "axios";

// const ProductCSVUpload = () => {
//   const [file, setFile] = useState(null);
//   const[data,setData] = useState([]);
//   const [uploading, setUploading] = useState(false);
//   const [results, setResults] = useState({
//     successCount: 0,
//     errorCount: 0,
//     errors: [],
//   });
//   const [previewData, setPreviewData] = useState([]);
//   const [showPreview, setShowPreview] = useState(false);


//   const fetchProduct = async()=>{
//     try {
//       const res = await axios.get(`https://inventorybackend-m1z8.onrender.com/api/product`);
//       setData(res.data);
//     } catch (error) {
//       console.log("Failed to fetch order",error)
//     }
//   }
  

//   useEffect(()=>{
//     fetchProduct()
//   },[]);

//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     if (!selectedFile) return;
  
//     setFile(selectedFile);
  
//     Papa.parse(selectedFile, {
//       header: true,
//       complete: (results) => {
//         const skuMap = new Map(); // To track unique SKUs
  
//         const processedData = results.data
//           .filter(row => {
//             // Check valid positive InStock
//             const inStock = parseInt(row['InStock']);
//             return !isNaN(inStock) && inStock >= 0;
//           })
//           .map(row => {
//             // Extract numeric SKU prefix
//             const fullSku = row['Item SkuCode'] || '';
//             const skuPrefix = fullSku.split('-')[0];
//             return {
//               ...row,
//               skuPrefix: skuPrefix,
//               originalSku: fullSku
//             };
//           })
//           .filter(row => {
//             // Keep only first occurrence of each SKU prefix
//             if (!row.skuPrefix || skuMap.has(row.skuPrefix)) return false;
//             skuMap.set(row.skuPrefix, true);
//             return true;
//           })
//           .map(row => ({
//             'Rack Space': row['Rack Space'],
//             'Item SkuCode': row.skuPrefix, // Only the unique numeric prefix
//             'InStock': parseInt(row['InStock'])
//           }));
  
//         setPreviewData(processedData.slice(0, 5)); // Show first 5 unique items
//       },
//       error: (error) => {
//         console.error("Error parsing CSV:", error);
//       },
//     });
//   };
//   const processCSV = async () => {
//     if (!file) {
//       alert("Please select a file first");
//       return;
//     }
  
//     setUploading(true);
//     setResults({ successCount: 0, errorCount: 0, errors: [] });
  
//     Papa.parse(file, {
//       header: true,
//       complete: async (parseResults) => {
//         const errors = [];
//         let successCount = 0;
  
//         for (const [index, productData] of parseResults.data.entries()) {
//           let itemSkuCode = (productData['Item SkuCode'] || '').trim();
//           const rackSpace = (productData['Rack Space'] || '').trim();
  
//           if (!itemSkuCode) {
//             errors.push({
//               row: index + 1,
//               message: "Missing Item SkuCode",
//               productData,
//             });
//             continue;
//           }
  
//           // ➔ Extract numeric SKU prefix (before first "-")
//           const skuPrefix = itemSkuCode.split('-')[0];
  
//           if (!skuPrefix) {
//             errors.push({
//               row: index + 1,
//               message: `Invalid SKU format: ${itemSkuCode}`,
//               productData,
//             });
//             continue;
//           }
  
//           // ➔ Find product from fetched data
//           const matchedProduct = data.find((p) => {
//             const styleNumber = (p.style_code || '').toString().trim();
//             return styleNumber == skuPrefix;
//           });
  
//           if (!matchedProduct) {
//             errors.push({
//               row: index + 1,
//               message: `No matching product found for SKU ${skuPrefix}`,
//               productData,
//             });
//             continue;
//           }
  
//           try {
//             const response = await axios.put(
//               `https://inventorybackend-m1z8.onrender.com/api/product/${matchedProduct._id}`,
//               { rack_space:rackSpace }, // only update rackSpace
//               {
//                 headers: {
//                   "Content-Type": "application/json",
//                 },
//               }
//             );
  
//             if (response.data && response.data.product) {
//               successCount++;
//             } else {
//               errors.push({
//                 row: index + 1,
//                 message: "Product not found or update failed",
//                 productData,
//               });
//             }
//           } catch (err) {
//             errors.push({
//               row: index + 1,
//               message: err.response?.data?.msg || err.message,
//               productData,
//             });
//           }
//         }
  
//         setResults({
//           successCount,
//           errorCount: errors.length,
//           errors,
//         });
//         setUploading(false);
//       },
//       error: (error) => {
//         setResults({
//           successCount: 0,
//           errorCount: 1,
//           errors: [{ message: `CSV parsing error: ${error.message}` }],
//         });
//         setUploading(false);
//       },
//     });
//   };
  
 
//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
//       <h2 className="text-2xl font-bold text-gray-800 mb-6">
//         Update Products via CSV
//       </h2>

//       <div className="mb-8 p-4 border border-gray-200 rounded-lg bg-gray-50">
//         <h3 className="text-lg font-semibold text-gray-700 mb-2">
//           CSV Format Requirements
//         </h3>
//         <p className="text-gray-600 mb-2">
//           Your CSV file should include the following columns:
//         </p>
//         <ul className="list-disc pl-5 text-gray-600 space-y-1">
//           <li>
//             <span className="font-mono bg-gray-100 px-1">id</span> - Product ID
//             (required)
//           </li>
//           <li>
//             <span className="font-mono bg-gray-100 px-1">Style Number</span> -
//             Style Number (required)
//           </li>
         
//           <li>
//             <span className="font-mono bg-gray-100 px-1">Rack Space</span> -
//             Product Rack Space
//           </li>

          
//           {/* <li>
//             <span className="font-mono px-1">
//               {" "}
//               <a className="text-blue-500" href="template.csv"> Download Template</a>{" "}
//             </span>{" "}
//           </li> */}
//         </ul>
//         <p className="mt-3 text-sm text-gray-500">
//           Only include the fields you want to update. The product will be found
//           by ID and updated with the provided fields.
//         </p>
//       </div>

//       <div className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             CSV File
//           </label>
//           <input
//             type="file"
//             accept=".csv"
//             onChange={handleFileChange}
//             className="block w-full text-sm text-gray-500
//               file:mr-4 file:py-2 file:px-4
//               file:rounded-md file:border-0
//               file:text-sm file:font-semibold
//               file:bg-blue-50 file:text-blue-700
//               hover:file:bg-blue-100"
//           />
//         </div>

//         {previewData.length > 0 && (
//           <div className="mt-4">
//             <button
//               type="button"
//               onClick={() => setShowPreview(!showPreview)}
//               className="text-blue-600 hover:text-blue-800 text-sm font-medium"
//             >
//               {showPreview ? "Hide Preview" : "Show Preview (First 5 Rows)"}
//             </button>

//             {showPreview && (
//               <div className="mt-2 overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       {Object.keys(previewData[0]).map((key) => (
//                         <th
//                           key={key}
//                           scope="col"
//                           className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                         >
//                           {key}
//                         </th>
//                       ))}
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {previewData.map((row, i) => (
//                       <tr key={i}>
//                         {Object.values(row).map((value, j) => (
//                           <td
//                             key={j}
//                             className="px-3 py-2 whitespace-nowrap text-sm text-gray-500"
//                           >
//                             {value}
//                           </td>
//                         ))}
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>
//         )}

//         <button
//           onClick={processCSV}
//           disabled={uploading || !file}
//           className={`px-4 py-2 rounded-md text-white font-medium ${
//             uploading || !file
//               ? "bg-blue-300 cursor-not-allowed"
//               : "bg-blue-600 hover:bg-blue-700"
//           }`}
//         >
//           {uploading ? "Processing..." : "Update Products"}
//         </button>

        
//       </div>

//       {(results.successCount > 0 || results.errorCount > 0) && (
//         <div className="mt-6 p-4 border rounded-lg">
//           {results.successCount > 0 && (
//             <p className="text-green-600 mb-2">
//               Successfully updated {results.successCount} product
//               {results.successCount !== 1 ? "s" : ""}.
//             </p>
//           )}

//           {results.errorCount > 0 && (
//             <p className="text-red-600 mb-2">
//               Failed to update {results.errorCount} product
//               {results.errorCount !== 1 ? "s" : ""}.
//             </p>
//           )}

//           {results.errors.length > 0 && (
//             <div className="mt-4">
//               <h4 className="font-medium text-gray-700 mb-2">Error Details:</h4>
//               <ul className="space-y-2 max-h-60 overflow-y-auto">
//                 {results.errors.map((error, index) => (
//                   <li
//                     key={index}
//                     className="text-sm text-red-600 bg-red-50 p-2 rounded"
//                   >
//                     <span className="font-medium">Row {error.row}:</span>{" "}
//                     {error.message}
//                     {error.productData?.id && (
//                       <span className="ml-2">
//                         (Product ID: {error.productData.id})
//                       </span>
//                     )}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProductCSVUpload;
