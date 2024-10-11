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
        <div className="crud_banner_container">
            <h2>Banner Management</h2>
            
            {bannerFiles.length > 0 && (
                <div className="banner_files">
                    <h3>Uploaded Banners:</h3>
                    <ul>
                        {bannerFiles.map((file, index) => (
                            <li key={index}>
                                {file.name}
                                <label className="edit_file">
                                    Edit
                                    <input type="file" accept="image/*" onChange={(e) => handleEdit(index, e)} style={{display: 'none'}} />
                                </label>
                                <button onClick={() => handleDelete(index)} className="delete_file">Delete</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            
            <div className="crud_buttons flex gap-4">
                <label className="crud_button upload">
                    Upload Banners
                    <input type="file" accept="image/*" onChange={handleFileUpload} multiple style={{display: 'none'}} />
                </label>
                <button onClick={handleRemoveAll} className="crud_button remove_all">Remove All Banners</button>
            </div>
        </div>
    )
}

export default CrudBanner;