import React, { useState, useEffect } from 'react';
import { db, storage } from "../../firebase/config";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import ItemForSale from './item_for_sale';

const ItemList = () => {
    const [items, setItems] = useState([]);
    const [editingItem, setEditingItem] = useState(null);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        const itemsCollection = collection(db, 'items');
        const itemSnapshot = await getDocs(itemsCollection);
        const itemList = itemSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setItems(itemList);
    };

    const handleEdit = (item) => {
        setEditingItem(item);
    };

    const handleUpdate = async (updatedItem) => {
        try {
            const itemRef = doc(db, 'items', updatedItem.id);
            await updateDoc(itemRef, updatedItem);
            setEditingItem(null);
            fetchItems();
            alert('Item updated successfully!');
        } catch (error) {
            console.error("Error updating document: ", error);
            alert('Error updating item. Please try again.');
        }
    };

    const handleDelete = async (item) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                // Delete the document from Firestore
                await deleteDoc(doc(db, 'items', item.id));

                // Delete the image from Storage if it exists
                if (item.image) {
                    const imageRef = ref(storage, item.image);
                    await deleteObject(imageRef);
                }

                fetchItems();
                alert('Item deleted successfully!');
            } catch (error) {
                console.error("Error deleting document: ", error);
                alert('Error deleting item. Please try again.');
            }
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-6">Items for Sale</h2>
            {editingItem ? (
                <ItemForSale item={editingItem} onUpdate={handleUpdate} onCancel={() => setEditingItem(null)} />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((item) => (
                        <div key={item.id} className="border rounded-lg p-4 shadow-md">
                            <h3 className="text-xl font-semibold mb-2">{item.brandName} - {item.type}</h3>
                            {item.image && <img src={item.image} alt={item.type} className="w-full h-48 object-cover mb-2" />}
                            <p className="mb-2">Price: ${item.price}</p>
                            <p className="mb-2">Quantity: {item.quantity}</p>
                            <div className="flex justify-between mt-4">
                                <button onClick={() => handleEdit(item)} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Edit</button>
                                <button onClick={() => handleDelete(item)} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ItemList;