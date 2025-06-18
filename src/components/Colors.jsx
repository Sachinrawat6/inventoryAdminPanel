import axios from 'axios';
import React, { useEffect, useMemo, useState } from 'react';

const Colors = () => {
    const [colors, setColors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [query, setQuery] = useState("");

    // fetching colors from api 
    const fetchColors = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get("https://inventorybackend-m1z8.onrender.com/api/v1/colors/get-colors");
            setColors(response.data.data);
        } catch (error) {
            console.log("Failed to fetch colors", error);
            setError("Failed to load colors. Please try again later.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchColors();
    }, []);


    // filtered data 
    
    const displayColor = useMemo(()=>{
        if(query.length > 4){
            return colors.filter((color)=> color.style_code === Number(query));
        }
        return colors;
    },[query,colors])

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mx-auto max-w-4xl mt-8">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-red-700">{error}</p>
                        <button 
                            onClick={fetchColors}
                            className="mt-2 text-sm text-red-700 hover:text-red-600 font-medium underline"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (colors.length === 0) {
        return (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mx-auto max-w-4xl mt-8">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-blue-700">No colors found in inventory.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <div>
                     <h2 className="text-xl font-semibold text-gray-800">Color Stock</h2>
                    <p className="text-sm text-gray-600 mt-1">List of available colors with their style codes</p>
                    </div>
                    <div>
                        <input type="search" 
                        onChange={(e)=>setQuery(e.target.value)}
                        placeholder='Enter style number...'
                        className='border border-gray-200 py-1 px-2 rounded-md outline-gray-300 cursor-pointer ' />
                    </div>
                  
                </div>
                
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Style Number
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Color
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {displayColor.map((color, i) => (
                                <tr key={color._id} className="hover:bg-gray-50 transition-colors duration-150">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {color.style_code}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div 
                                                className="flex-shrink-0 h-6 w-6 rounded-full border border-gray-300"
                                                style={{ backgroundColor: color.color }}
                                                title={color.color}
                                            ></div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {color.color}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    HEX: {color.color.toUpperCase()}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 text-right">
                    <p className="text-xs text-gray-500">
                        Showing <span className="font-medium">{colors.length}</span> colors
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Colors;