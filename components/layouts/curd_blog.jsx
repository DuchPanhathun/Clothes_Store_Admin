import React, { useState } from "react";

const CrudBlog = () => {
    const [blogPosts, setBlogPosts] = useState([]);
    const [newBlog, setNewBlog] = useState({
        title: "",
        detail: "",
        coverImage: null,
        additionalPhotos: [],
        additionalDetails: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewBlog(prev => ({ ...prev, [name]: value }));
    };

    const handleCoverImageUpload = (e) => {
        setNewBlog(prev => ({ ...prev, coverImage: e.target.files[0] }));
    };

    const handleAdditionalPhotosUpload = (e) => {
        setNewBlog(prev => ({ ...prev, additionalPhotos: [...prev.additionalPhotos, ...e.target.files] }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setBlogPosts(prev => [...prev, newBlog]);
        setNewBlog({
            title: "",
            detail: "",
            coverImage: null,
            additionalPhotos: [],
            additionalDetails: "",
        });
    };

    const handleDelete = (index) => {
        setBlogPosts(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Blog Management</h2>
            
            <form onSubmit={handleSubmit} className="mb-8 space-y-4">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={newBlog.title}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                </div>
                
                <div>
                    <label htmlFor="detail" className="block text-sm font-medium text-gray-700">Detail</label>
                    <textarea
                        id="detail"
                        name="detail"
                        value={newBlog.detail}
                        onChange={handleInputChange}
                        required
                        rows="4"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    ></textarea>
                </div>
                
                <div>
                    <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700">Cover Image</label>
                    <input
                        type="file"
                        id="coverImage"
                        name="coverImage"
                        onChange={handleCoverImageUpload}
                        required
                        accept="image/*"
                        className="mt-1 block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-indigo-50 file:text-blue-600
                        hover:file:bg-indigo-100"
                    />
                </div>
                
                <div>
                    <label htmlFor="additionalPhotos" className="block text-sm font-medium text-gray-700">Additional Photos (Optional)</label>
                    <input
                        type="file"
                        id="additionalPhotos"
                        name="additionalPhotos"
                        onChange={handleAdditionalPhotosUpload}
                        multiple
                        accept="image/*"
                        className="mt-1 block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-indigo-50 file:text-blue-600
                        hover:file:bg-indigo-100"
                    />
                </div>
                
                <div>
                    <label htmlFor="additionalDetails" className="block text-sm font-medium text-gray-700">Additional Details (Optional)</label>
                    <textarea
                        id="additionalDetails"
                        name="additionalDetails"
                        value={newBlog.additionalDetails}
                        onChange={handleInputChange}
                        rows="3"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    ></textarea>
                </div>
                
                <button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:blue-500 focus:ring-offset-2">
                    Upload Blog
                </button>
            </form>
            
            {blogPosts.length > 0 && (
                <div>
                    <h3 className="text-xl font-semibold mb-4 text-gray-700">Uploaded Blogs:</h3>
                    <ul className="space-y-3">
                        {blogPosts.map((post, index) => (
                            <li key={index} className="flex items-center justify-between bg-gray-100 p-3 rounded-md">
                                <span className="text-gray-800">{post.title}</span>
                                <div className="space-x-2">
                                    <button onClick={() => handleDelete(index)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition duration-300">Delete</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}

export default CrudBlog;