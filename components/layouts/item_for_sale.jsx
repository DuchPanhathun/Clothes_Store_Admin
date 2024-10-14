import React, { useState } from "react";
import { db, storage } from "../../firebase/config"; // Import Firebase config
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { SketchPicker } from 'react-color'; // Make sure to install react-color: npm install react-color

const ItemForSale = ({ item, onUpdate, onCancel }) => {
    const [formData, setFormData] = useState(item ? {
        ...item,
        promoCodes: item.promoCodes || [{ code: "", discount: "" }],
        images: item.images || [],
        additionalCareDetails: item.additionalCareDetails || '',
    } : {
        brandName: "",
        type: "",
        price: "",
        quantity: "",
        colors: [],
        sizes: [],
        materialDetail: "",
        promoCodes: [{ code: "", discount: "" }],
        careDetails: [],
        additionalCareDetails: '',
        maxTemp: "",
        maxTempF: "",
        deliveryStartDate: "",
        deliveryEndDate: "",
        images: [], // Array to store multiple images
    });
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [currentColor, setCurrentColor] = useState("#000000");

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handlePromoCodeChange = (index, field, value) => {
        setFormData((prevData) => {
            const updatedPromoCodes = [...prevData.promoCodes];
            updatedPromoCodes[index][field] = value;
            return { ...prevData, promoCodes: updatedPromoCodes };
        });
    };

    const handleAddPromoCode = () => {
        setFormData((prevData) => ({
            ...prevData,
            promoCodes: [...prevData.promoCodes, { code: "", discount: "" }],
        }));
    };

    const handleRemovePromoCode = (index) => {
        setFormData((prevData) => ({
            ...prevData,
            promoCodes: prevData.promoCodes.filter((_, i) => i !== index),
        }));
    };

    const handleCareDetailsChange = (e, detail) => {
        const { checked, name, value } = e.target;
        
        if (name === "careDetails") {
            setFormData((prevData) => {
                const updatedCareDetails = checked
                    ? [...prevData.careDetails, value]
                    : prevData.careDetails.filter((item) => item !== value);
                return { ...prevData, careDetails: updatedCareDetails };
            });
        } else if (name === "maxTemp" || name === "maxTempF") {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
                careDetails: prevData.careDetails.includes("Iron at a maximum temperature")
                    ? prevData.careDetails
                    : [...prevData.careDetails, "Iron at a maximum temperature"],
            }));
        }
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setFormData((prevData) => ({
            ...prevData,
            images: [...prevData.images, ...files],
        }));
    };

    const handleRemoveImage = (index) => {
        setFormData((prevData) => ({
            ...prevData,
            images: prevData.images.filter((_, i) => i !== index),
        }));
    };

    const handleColorChange = (color) => {
        setCurrentColor(color.hex);
    };

    const handleColorAdd = () => {
        if (!formData.colors.includes(currentColor)) {
            setFormData((prevData) => ({
                ...prevData,
                colors: [...prevData.colors, currentColor],
            }));
        }
        setShowColorPicker(false);
    };

    const handleColorRemove = (colorToRemove) => {
        setFormData((prevData) => ({
            ...prevData,
            colors: prevData.colors.filter((color) => color !== colorToRemove),
        }));
    };

    const handleSizeChange = (e) => {
        const size = e.target.value;
        setFormData((prevData) => ({
            ...prevData,
            sizes: prevData.sizes.includes(size)
                ? prevData.sizes.filter((s) => s !== size)
                : [...prevData.sizes, size],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            let imageUrls = [];
            for (let image of formData.images) {
                if (image instanceof File) {
                    const storageRef = ref(storage, `items/${image.name}`);
                    await uploadBytes(storageRef, image);
                    const url = await getDownloadURL(storageRef);
                    imageUrls.push(url);
                } else {
                    // If it's already a URL (for editing existing items)
                    imageUrls.push(image);
                }
            }

            const itemData = {
                ...formData,
                images: imageUrls,
                updatedAt: new Date(),
            };

            if (item) {
                // Update existing item
                await onUpdate(itemData);
            } else {
                // Add new item
                const docRef = await addDoc(collection(db, "items"), itemData);
                console.log("Document written with ID: ", docRef.id);
                alert("Item uploaded successfully!");
            }

            // Reset form after submission
            setFormData({
                brandName: "",
                type: "",
                price: "",
                quantity: "",
                colors: [],
                sizes: [],
                materialDetail: "",
                promoCodes: [{ code: "", discount: "" }],
                careDetails: [],
                additionalCareDetails: '',
                maxTemp: "",
                maxTempF: "",
                deliveryStartDate: "",
                deliveryEndDate: "",
                images: [],
            });

        } catch (error) {
            console.error("Error adding/updating document: ", error);
            alert("Error uploading/updating item. Please try again.");
        }
    };

    return (
        <div className="container mx-auto p-4">
            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold mb-6 text-center">
                    {item ? 'Update Item for Sale' : 'Upload Item for Sale'}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <label className="block">
                        <span className="text-gray-700">Brand Name:</span>
                        <input
                            type="text"
                            name="brandName"
                            value={formData.brandName}
                            onChange={handleInputChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                    </label>

                    <label className="block">
                        <span className="text-gray-700">Type:</span>
                        <input
                            type="text"
                            name="type"
                            value={formData.type}
                            onChange={handleInputChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                    </label>

                    <label className="block">
                        <span className="text-gray-700">Price:</span>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                    </label>

                    <label className="block">
                        <span className="text-gray-700">Quantity Available:</span>
                        <input
                            type="number"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleInputChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                    </label>

                    <div className="block">
                        <span className="text-gray-700">Colors Available:</span>
                        <div className="mt-1 flex flex-wrap gap-2">
                            {formData.colors.map((color) => (
                                <div key={color} className="flex items-center">
                                    <div
                                        style={{
                                            backgroundColor: color,
                                            width: '30px',
                                            height: '30px',
                                            borderRadius: '4px',
                                        }}
                                    ></div>
                                    <button
                                        type="button"
                                        onClick={() => handleColorRemove(color)}
                                        className="ml-1 text-red-500"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowColorPicker(true)}
                            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                        >
                            Add Color
                        </button>
                        {showColorPicker && (
                            <div className="absolute z-10">
                                <SketchPicker
                                    color={currentColor}
                                    onChange={handleColorChange}
                                />
                                <button
                                    type="button"
                                    onClick={handleColorAdd}
                                    className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                                >
                                    Add This Color
                                </button>
                            </div>
                        )}
                    </div>

                    <label className="block">
                        <span className="text-gray-700">Sizes Available:</span>
                        <div className="mt-1">
                            {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
                                <label key={size} className="inline-flex items-center mr-4">
                                    <input
                                        type="checkbox"
                                        value={size}
                                        checked={formData.sizes.includes(size)}
                                        onChange={handleSizeChange}
                                        className="form-checkbox h-5 w-5 text-blue-600"
                                    />
                                    <span className="ml-2">{size}</span>
                                </label>
                            ))}
                        </div>
                    </label>

                    <label className="block col-span-full">
                        <span className="text-gray-700">Material Detail (optional):</span>
                        <textarea
                            name="materialDetail"
                            value={formData.materialDetail}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            rows="3"
                        />
                    </label>
                </div>

                <h3 className="text-xl font-semibold mt-6 mb-3">Promo Codes (optional)</h3>
                <div className="space-y-4">
                    {formData.promoCodes.map((promo, index) => (
                        <div key={index} className="flex space-x-4">
                            <input
                                type="text"
                                placeholder="Promo Code"
                                value={promo.code}
                                onChange={(e) => handlePromoCodeChange(index, "code", e.target.value)}
                                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                            <input
                                type="number"
                                placeholder="Discount %"
                                value={promo.discount}
                                onChange={(e) => handlePromoCodeChange(index, "discount", e.target.value)}
                                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                            <button type="button" onClick={() => handleRemovePromoCode(index)} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50">Remove</button>
                        </div>
                    ))}
                    <button type="button" onClick={handleAddPromoCode} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">Add Promo Code</button>
                </div>

                <h3 className="text-xl font-semibold mt-6 mb-3">Care Details (optional)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            name="careDetails"
                            value="Do not use bleach"
                            checked={formData.careDetails.includes("Do not use bleach")}
                            onChange={handleCareDetailsChange}
                            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-offset-0 focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                        <span>Do not use bleach</span>
                    </label>
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            name="careDetails"
                            value="Do not tumble dry"
                            checked={formData.careDetails.includes("Do not tumble dry")}
                            onChange={handleCareDetailsChange}
                            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-offset-0 focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                        <span>Do not tumble dry</span>
                    </label>
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            name="careDetails"
                            value="Dry clean with tetrachlorethylene"
                            checked={formData.careDetails.includes("Dry clean with tetrachlorethylene")}
                            onChange={handleCareDetailsChange}
                            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-offset-0 focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                        <span>Dry clean with tetrachlorethylene</span>
                    </label>
                    <div className="col-span-full flex items-center space-x-2">
                        <input
                            type="checkbox"
                            name="careDetails"
                            value="Iron at a maximum temperature"
                            checked={formData.careDetails.includes("Iron at a maximum temperature")}
                            onChange={handleCareDetailsChange}
                            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-offset-0 focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                        <span>Iron at a maximum of</span>
                        <input
                            type="number"
                            name="maxTemp"
                            placeholder="ºC"
                            onChange={(e) => handleCareDetailsChange(e, "Iron at a maximum temperature")}
                            className="w-16 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                        <span>ºC /</span>
                        <input
                            type="number"
                            name="maxTempF"
                            placeholder="ºF"
                            onChange={(e) => handleCareDetailsChange(e, "Iron at a maximum temperature")}
                            className="w-16 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                        <span>ºF</span>
                    </div>
                    <div className="col-span-full mt-4">
                        <label className="block">
                            <span className="text-gray-700">Additional Care Details:</span>
                            <textarea
                                name="additionalCareDetails"
                                value={formData.additionalCareDetails || ''}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                rows="3"
                                placeholder="Enter any additional care instructions here..."
                            />
                        </label>
                    </div>
                </div>

                <h3 className="text-xl font-semibold mt-6 mb-3">Delivery Estimate</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <label className="block">
                        <span className="text-gray-700">Start Date:</span>
                        <input
                            type="date"
                            name="deliveryStartDate"
                            value={formData.deliveryStartDate}
                            onChange={handleInputChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                    </label>
                    <label className="block">
                        <span className="text-gray-700">End Date:</span>
                        <input
                            type="date"
                            name="deliveryEndDate"
                            value={formData.deliveryEndDate}
                            onChange={handleInputChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                    </label>
                </div>

                {/* Multiple image upload field */}
                <div className="mt-6">
                    <label className="block">
                        <span className="text-gray-700">Item Images:</span>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageChange}
                            className="mt-1 block w-full"
                        />
                    </label>
                    <div className="mt-2 flex flex-wrap gap-2">
                        {formData.images.map((image, index) => (
                            <div key={index} className="relative">
                                <img
                                    src={image instanceof File ? URL.createObjectURL(image) : image}
                                    alt={`Preview ${index}`}
                                    className="h-20 w-20 object-cover rounded"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveImage(index)}
                                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-between mt-6">
                    <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50">
                        {item ? 'Update Item' : 'Upload Item'}
                    </button>
                    {item && (
                        <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50">
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default ItemForSale;