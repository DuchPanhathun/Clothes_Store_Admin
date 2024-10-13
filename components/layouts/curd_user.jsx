import React, { useState, useEffect } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc, collection, query, orderBy, getDocs, deleteDoc, updateDoc } from "firebase/firestore";
import { app } from '../../firebase/config';
import { signUp } from '../../utils/auth'; // Create this file to house the signUp function

const CrudUser = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");

    const auth = getAuth(app);
    const db = getFirestore(app);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const userList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(userList);
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            await signUp(email, password);
            // Clear form fields and maybe refresh user list
            setName("");
            setEmail("");
            setPassword("");
            // Fetch users again or update local state
            fetchUsers();
        } catch (error) {
            console.error("Error creating user:", error);
            // Handle error (e.g., show error message to user)
            setError("Failed to create user: " + error.message);
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            await deleteDoc(doc(db, "users", userId));
            fetchUsers();
        } catch (error) {
            setError("Failed to delete user: " + error.message);
        }
    };

    const handleUpdateUser = async (userId, newName) => {
        try {
            await updateDoc(doc(db, "users", userId), { name: newName });
            fetchUsers();
        } catch (error) {
            setError("Failed to update user: " + error.message);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">User Management</h1>
            
            {/* Create User Form */}
            <div className="mb-8 bg-white p-4 rounded shadow">
                <h2 className="text-xl font-semibold mb-2">Create User</h2>
                <form onSubmit={handleCreateUser} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                        Add User
                    </button>
                </form>
                {error && <p className="text-red-500 mt-2">{error}</p>}
            </div>
            
            {/* User List */}
            <div className="bg-white p-4 rounded shadow">
                <h2 className="text-xl font-semibold mb-2">User List</h2>
                <ul className="divide-y">
                    {users.map((user) => (
                        <li key={user.id} className="py-4 flex justify-between items-center">
                            <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-gray-600">{user.email}</p>
                            </div>
                            <div className="space-x-2">
                                <button
                                    onClick={() => handleUpdateUser(user.id, prompt("Enter new name", user.name))}
                                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDeleteUser(user.id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default CrudUser;
