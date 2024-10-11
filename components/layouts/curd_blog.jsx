import React, { useState } from "react";

const CrudBlog = () => {
    const [blogFiles, setblogFiles] = useState([]);

    const handleFileUpload = (event) => {
        const newFiles = Array.from(event.target.files);
        setblogFiles(prevFiles => [...prevFiles, ...newFiles]);
    };

    const handleDelete = (index) => {
        setblogFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    };

    const handleEdit = (index, event) => {
        const newFile = event.target.files[0];
        if (newFile) {
            setblogFiles(prevFiles => {
                const newFiles = [...prevFiles];
                newFiles[index] = newFile;
                return newFiles;
            });
        }
    };

    const handleRemoveAll = () => {
        setblogFiles([]);
    };

    return (
        <div className="crud_blog_container">
            <h2>blog Management</h2>
            
            {blogFiles.length > 0 && (
                <div className="blog_files">
                    <h3>Uploaded Blogs:</h3>
                    <ul>
                        {blogFiles.map((file, index) => (
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
                    Upload Blogs
                    <input type="file" accept="image/*" onChange={handleFileUpload} multiple style={{display: 'none'}} />
                </label>
                <button onClick={handleRemoveAll} className="crud_button remove_all">Remove All Blogs</button>
            </div>
        </div>
    )
}

export default CrudBlog;