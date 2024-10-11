import React from "react";

const CrudUser = () => {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">User Management</h1>
            
            {/* Create User Form */}
            <div className="mb-8 bg-white p-4 rounded shadow">
                <h2 className="text-xl font-semibold mb-2">Create User</h2>
                <form className="space-y-4">
                    <input type="text" placeholder="Name" className="w-full p-2 border rounded" />
                    <input type="email" placeholder="Email" className="w-full p-2 border rounded" />
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                        Add User
                    </button>
                </form>
            </div>
            
            {/* User List */}
            <div className="bg-white p-4 rounded shadow">
                <h2 className="text-xl font-semibold mb-2">User List</h2>
                <ul className="divide-y">
                    {/* Example user item */}
                    <li className="py-4 flex justify-between items-center">
                        <div>
                            <p className="font-medium">John Doe</p>
                            <p className="text-gray-600">john@example.com</p>
                        </div>
                        <div className="space-x-2">
                            <button className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">
                                Edit
                            </button>
                            <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                                Delete
                            </button>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default CrudUser;