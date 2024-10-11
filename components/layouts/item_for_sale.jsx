import React, { useState } from "react";

const ItemForSale = () => {
    const [formData, setFormData] = useState({
        brandName: "",
        type: "",
        price: "",
        quantity: "",
        colors: "",
        sizes: "",
        materialDetail: "",
        promoCodes: [{ code: "", discount: "" }],
        careDetails: [],
        maxTemp: "",
        maxTempF: "",
        deliveryStartDate: "",
        deliveryEndDate: "",
    });

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

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Combine maxTemp and maxTempF into a single care detail if present
        const updatedCareDetails = formData.careDetails.map((detail) => {
            if (detail === "Iron at a maximum temperature") {
                return `Iron at a maximum of ${formData.maxTemp}ºC/${formData.maxTempF}ºF`;
            }
            return detail;
        });

        const finalFormData = {
            ...formData,
            careDetails: updatedCareDetails,
        };

        // Here you would typically send the data to your backend or perform further actions
        console.log("Form submitted with data:", finalFormData);

        // Reset form after submission (optional)
        setFormData({
            brandName: "",
            type: "",
            price: "",
            quantity: "",
            colors: "",
            sizes: "",
            materialDetail: "",
            promoCodes: [{ code: "", discount: "" }],
            careDetails: [],
            maxTemp: "",
            maxTempF: "",
            deliveryStartDate: "",
            deliveryEndDate: "",
        });
    };

    return (
        <div className="container mx-auto p-4">
            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold mb-6 text-center">Upload Item for Sale</h2>
                
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

                    <label className="block">
                        <span className="text-gray-700">Colors Available:</span>
                        <input
                            type="text"
                            name="colors"
                            value={formData.colors}
                            onChange={handleInputChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                    </label>

                    <label className="block">
                        <span className="text-gray-700">Sizes Available:</span>
                        <input
                            type="text"
                            name="sizes"
                            value={formData.sizes}
                            onChange={handleInputChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
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

                <button type="submit" className="mt-6 w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50">Upload Item</button>
            </form>
        </div>
    );
};

export default ItemForSale;