import React, { useState, useEffect } from "react";
import { db, storage } from "../../firebase/config";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const CrudBlog = () => {
    const [blogPosts, setBlogPosts] = useState([]);
    const [newBlog, setNewBlog] = useState({
        id: null,
        title: "",
        detail: "",
        coverImage: null,
        additionalPhotos: [],
        additionalDetails: "",
    });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchBlogPosts();
    }, []);

    const fetchBlogPosts = async () => {
        const querySnapshot = await getDocs(collection(db, "blogPosts"));
        const posts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setBlogPosts(posts);
    };

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let coverImageUrl = newBlog.coverImage;
            if (newBlog.coverImage instanceof File) {
                const coverImageRef = ref(storage, `coverImages/${newBlog.coverImage.name}`);
                await uploadBytes(coverImageRef, newBlog.coverImage);
                coverImageUrl = await getDownloadURL(coverImageRef);
            }

            const additionalPhotoUrls = await Promise.all(
                newBlog.additionalPhotos.map(async (photo) => {
                    if (photo instanceof File) {
                        const photoRef = ref(storage, `additionalPhotos/${photo.name}`);
                        await uploadBytes(photoRef, photo);
                        return getDownloadURL(photoRef);
                    }
                    return photo;
                })
            );

            const blogData = {
                title: newBlog.title,
                detail: newBlog.detail,
                coverImage: coverImageUrl,
                additionalPhotos: additionalPhotoUrls,
                additionalDetails: newBlog.additionalDetails,
                updatedAt: new Date(),
            };

            if (isEditing) {
                await updateDoc(doc(db, "blogPosts", newBlog.id), blogData);
            } else {
                blogData.createdAt = new Date();
                await addDoc(collection(db, "blogPosts"), blogData);
            }

            fetchBlogPosts();
            resetForm();
        } catch (error) {
            console.error("Error adding/updating blog post: ", error);
        }
    };

    const handleEdit = (post) => {
        setNewBlog({
            id: post.id,
            title: post.title,
            detail: post.detail,
            coverImage: post.coverImage,
            additionalPhotos: post.additionalPhotos,
            additionalDetails: post.additionalDetails,
        });
        setIsEditing(true);
    };

    const resetForm = () => {
        setNewBlog({
            id: null,
            title: "",
            detail: "",
            coverImage: null,
            additionalPhotos: [],
            additionalDetails: "",
        });
        setIsEditing(false);
    };

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, "blogPosts", id));
            fetchBlogPosts();
        } catch (error) {
            console.error("Error deleting blog post: ", error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">
                {isEditing ? "Edit Blog Post" : "Create New Blog Post"}
            </h2>
            
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
                    {isEditing ? "Update Blog" : "Upload Blog"}
                </button>
                
                {isEditing && (
                    <button type="button" onClick={resetForm} className="w-full bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:gray-500 focus:ring-offset-2 mt-2">
                        Cancel Edit
                    </button>
                )}
            </form>
            
            {blogPosts.length > 0 && (
                <div>
                    <h3 className="text-xl font-semibold mb-4 text-gray-700">Uploaded Blogs:</h3>
                    <ul className="space-y-3">
                        {blogPosts.map((post) => (
                            <li key={post.id} className="flex items-center justify-between bg-gray-100 p-3 rounded-md">
                                <span className="text-gray-800">{post.title}</span>
                                <div className="space-x-2">
                                    <button onClick={() => handleEdit(post)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition duration-300">Edit</button>
                                    <button onClick={() => handleDelete(post.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition duration-300">Delete</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default CrudBlog;
