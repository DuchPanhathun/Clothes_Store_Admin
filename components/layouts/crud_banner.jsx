import React, { useState } from "react";

const CrudBanner = () => {
    const [bannerFiles, setBannerFiles] = useState([]);

    const handleFileUpload = (event) => {
        const newFiles = Array.from(event.target.files);
        setBannerFiles(prevFiles => [...prevFiles, ...newFiles]);
    };

    const handleDelete = (index) => {
        setBannerFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    };

    const handleEdit = (index, event) => {
        const newFile = event.target.files[0];
        if (newFile) {
            setBannerFiles(prevFiles => {
                const newFiles = [...prevFiles];
                newFiles[index] = newFile;
                return newFiles;
            });
        }
    };

    const handleRemoveAll = () => {
        setBannerFiles([]);
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Banner Management</h2>
            
            {bannerFiles.length > 0 && (
                <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4 text-gray-700">Uploaded Banners:</h3>
                    <ul className="space-y-3">
                        {bannerFiles.map((file, index) => (
                            <li key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                                <span className="text-gray-600">{file.name}</span>
                                <div className="flex space-x-2">
                                    <label className="cursor-pointer bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition duration-300">
                                        Edit
                                        <input type="file" accept="image/*" onChange={(e) => handleEdit(index, e)} className="hidden" />
                                    </label>
                                    <button onClick={() => handleDelete(index)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition duration-300">
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4">
                <label className="flex-1 cursor-pointer bg-blue-500 text-white text-center py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300">
                    Upload Banners
                    <input type="file" accept="image/*" onChange={handleFileUpload} multiple className="hidden" />
                </label>
                <button onClick={handleRemoveAll} className="flex-1 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-300">
                    Remove All Banners
                </button>
            </div>
        </div>
    )
}

export default CrudBanner;