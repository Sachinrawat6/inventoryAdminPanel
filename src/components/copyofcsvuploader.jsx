// src/components/CSVUploader.js
import React, { useState } from "react";
import Papa from "papaparse";
import axios from "axios";

const CSVUploader = () => {
  const [csvData, setCsvData] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
  
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
          const seenVans = new Set();
          const filteredData = [];
  
          // Regex pattern to extract color from SKU code
          const colorRegex = /^.*-(.*?)-.*$/;
  
          for (const row of results.data) {
            const van = row["van"];
            const brand = row["brand"];
            
            // Skip rows where brand is not "Qurvii"
            if (brand !== "Qurvii") continue;
  
            // Extract color from SKU code if available
            let color = "";
            const skuCode = row["seller sku code"];
            if (skuCode) {
              const match = skuCode.match(colorRegex);
              if (match) {
                color = match[1]; // Extracted color part
              }
            }
  
            // Ensure only unique van values
            if (van && !seenVans.has(van)) {
              seenVans.add(van);
  
              filteredData.push({
                style_id: row["style id"],
                style_name: row["style name"],
                mrp: row["mrp"],
                color: color || "other", // Extracted color
                style_code: row["van"], // Original SKU code
              });
            }
          }
  
          setCsvData(filteredData); // Update state with filtered data
        },
      });
    }
  };
  

  const handleUpload = async () => {
    setUploading(true);
    setMessage("");

    try {
      for (const product of csvData) {
        const { style_id, style_name, color, mrp, rack_space, style_code } =
          product;

        await axios.post("http://localhost:8080/api/product", {
          style_id: Number(style_id),
          style_name,
          color ,
          mrp: Number(mrp),
          rack_space,
          style_code: Number(style_code),
        });
      }
      setMessage("✅ All products uploaded successfully!");
    } catch (err) {
        // 🔥 Catch server error and display message
        const errorMsg = err.response?.data?.msg || "Something went wrong during upload.";
        setMessage(`❌ Upload failed: ${errorMsg}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-xl shadow-md space-y-4 ">
      <h2 className="text-xl font-semibold">Upload Products via CSV</h2>
      <div className="flex gap-4 items-center ">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="border border-gray-300 p-2 rounded"
        />
        <div >
          <a
            className="bg-black py-3 px-4 rounded shadow text-white"
            href="SAMPLE.csv"
          >
            Download Sample
          </a>
        </div>
      </div>

      {csvData.length > 0 && (
        <div>
          <p className="text-green-600">{csvData.length} records parsed.</p>
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="mt-2 px-4 py-2 bg-blue-600 cursor-pointer text-white rounded hover:bg-blue-700"
          >
            {uploading ? "Uploading..." : "Upload to Server"}
          </button>
        </div>
      )}

{message && (
  <p
    className={`mt-2 text-center font-medium ${
      message.startsWith("✅") ? "text-green-600" : "text-red-600"
    }`}
  >
    {message}
  </p>
)}

      {csvData.length > 0 && (
        <pre className="mt-4 p-4 bg-gray-100 border border-gray-200  rounded text-sm overflow-x-auto">
          {JSON.stringify(csvData, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default CSVUploader;
