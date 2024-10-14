import React, { useState, useEffect } from "react";
import { getFirestore, collection, addDoc, query, orderBy, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { app } from '../../firebase/config';

const CrudBanner = () => {
    const [banners, setBanners] = useState([]);
    const [title, setTitle] = useState("");
    const [image, setImage] = useState(null);
    const [error, setError] = useState("");
    const [editingBanner, setEditingBanner] = useState(null);

    const db = getFirestore(app);
    const storage = getStorage(app);

    useEffect(() => {
        fetchBanners();
    }, []);

    const fetchBanners = async () => {
        const bannersRef = collection(db, 'banners');
        const q = query(bannersRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const bannerList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setBanners(bannerList);
    };

    const handleCreateBanner = async (e) => {
        e.preventDefault();
        try {
            if (!title.trim() || !image) {
                throw new Error("Please provide both a title and an image");
            }

            const storageRef = ref(storage, `banners/${image.name}`);
            await uploadBytes(storageRef, image);
            const imageUrl = await getDownloadURL(storageRef);

            await addDoc(collection(db, "banners"), {
                title: title.trim(),
                imageUrl,
                createdAt: new Date()
            });

            setTitle("");
            setImage(null);
            fetchBanners();
            setError("");
        } catch (error) {
            console.error("Error creating banner:", error);
            setError("Failed to create banner: " + error.message);
        }
    };

    const handleDeleteBanner = async (bannerId, imageUrl) => {
        try {
            await deleteDoc(doc(db, "banners", bannerId));
            const imageRef = ref(storage, imageUrl);
            await deleteObject(imageRef);
            fetchBanners();
            setError("");
        } catch (error) {
            console.error("Error deleting banner:", error);
            setError("Failed to delete banner: " + error.message);
        }
    };

    const handleUpdateBanner = async (e) => {
        e.preventDefault();
        try {
            if (!editingBanner.title.trim()) {
                throw new Error("Banner title cannot be empty");
            }

            const bannerRef = doc(db, "banners", editingBanner.id);
            let updateData = { title: editingBanner.title.trim() };

            if (image) {
                const storageRef = ref(storage, `banners/${image.name}`);
                await uploadBytes(storageRef, image);
                const newImageUrl = await getDownloadURL(storageRef);
                updateData.imageUrl = newImageUrl;

                // Delete old image
                const oldImageRef = ref(storage, editingBanner.imageUrl);
                await deleteObject(oldImageRef);
            }

            await updateDoc(bannerRef, updateData);
            setEditingBanner(null);
            setImage(null);
            fetchBanners();
            setError("");
        } catch (error) {
            console.error("Error updating banner:", error);
            setError("Failed to update banner: " + error.message);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Banner Management</h1>
            
            {/* Create Banner Form */}
            <div className="mb-8 bg-white p-4 rounded shadow">
                <h2 className="text-xl font-semibold mb-2">Create Banner</h2>
                <form onSubmit={handleCreateBanner} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Banner Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                    <input
                        type="file"
                        onChange={(e) => setImage(e.target.files[0])}
                        className="w-full p-2 border rounded"
                        accept="image/*"
                        required
                    />
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                        Add Banner
                    </button>
                </form>
                {error && <p className="text-red-500 mt-2">{error}</p>}
            </div>
            
            {/* Banner List */}
            <div className="bg-white p-4 rounded shadow">
                <h2 className="text-xl font-semibold mb-2">Banner List</h2>
                <ul className="divide-y">
                    {banners.map((banner) => (
                        <li key={banner.id} className="py-4 flex justify-between items-center">
                            <div>
                                <p className="font-medium">{banner.title}</p>
                                <img src={banner.imageUrl} alt={banner.title} className="w-32 h-auto mt-2" />
                            </div>
                            <div className="space-x-2">
                                <button
                                    onClick={() => setEditingBanner(banner)}
                                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDeleteBanner(banner.id, banner.imageUrl)}
                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Edit Banner Modal */}
            {editingBanner && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Edit Banner</h3>
                        <form onSubmit={handleUpdateBanner} className="space-y-4">
                            <input
                                type="text"
                                placeholder="Banner Title"
                                value={editingBanner.title}
                                onChange={(e) => setEditingBanner({...editingBanner, title: e.target.value})}
                                className="w-full p-2 border rounded"
                                required
                            />
                            <input
                                type="file"
                                onChange={(e) => setImage(e.target.files[0])}
                                className="w-full p-2 border rounded"
                                accept="image/*"
                            />
                            <img src={editingBanner.imageUrl} alt={editingBanner.title} className="w-full h-auto mt-2" />
                            <div className="flex justify-end space-x-2">
                                <button type="button" onClick={() => setEditingBanner(null)} className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CrudBanner;
