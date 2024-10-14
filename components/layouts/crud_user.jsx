import React, { useState, useEffect } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc, collection, query, orderBy, getDocs, deleteDoc, updateDoc } from "firebase/firestore";
import { app } from '../../firebase/config';
import { signUp } from '../../utils/auth';

const CrudUser = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");
    const [editingUser, setEditingUser] = useState(null);

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
            setEmail("");
            setPassword("");
            fetchUsers();
        } catch (error) {
            console.error("Error creating user:", error);
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

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        try {
            const userRef = doc(db, "users", editingUser.id);
            await updateDoc(userRef, {
                firstName: editingUser.firstName,
                lastName: editingUser.lastName,
                address: editingUser.address,
                city: editingUser.city,
                phoneNumber: editingUser.phoneNumber,
                paymentMethod: {
                    nameOnCard: editingUser.paymentMethod.nameOnCard,
                    cardNumber: editingUser.paymentMethod.cardNumber,
                    expMonth: editingUser.paymentMethod.expMonth,
                    expYear: editingUser.paymentMethod.expYear,
                    cvv: editingUser.paymentMethod.cvv
                }
            });
            setEditingUser(null);
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
                                <p className="font-medium">{user.email}</p>
                                <p className="text-gray-600">{user.firstName} {user.lastName}</p>
                            </div>
                            <div className="space-x-2">
                                <button
                                    onClick={() => setEditingUser(user)}
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

            {/* Edit User Modal */}
            {editingUser && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Edit User</h3>
                        <form onSubmit={handleUpdateUser} className="space-y-4">
                            <input
                                type="text"
                                placeholder="First Name"
                                value={editingUser.firstName}
                                onChange={(e) => setEditingUser({...editingUser, firstName: e.target.value})}
                                className="w-full p-2 border rounded"
                            />
                            <input
                                type="text"
                                placeholder="Last Name"
                                value={editingUser.lastName}
                                onChange={(e) => setEditingUser({...editingUser, lastName: e.target.value})}
                                className="w-full p-2 border rounded"
                            />
                            <input
                                type="text"
                                placeholder="Address"
                                value={editingUser.address}
                                onChange={(e) => setEditingUser({...editingUser, address: e.target.value})}
                                className="w-full p-2 border rounded"
                            />
                            <input
                                type="text"
                                placeholder="City"
                                value={editingUser.city}
                                onChange={(e) => setEditingUser({...editingUser, city: e.target.value})}
                                className="w-full p-2 border rounded"
                            />
                            <input
                                type="text"
                                placeholder="Phone Number"
                                value={editingUser.phoneNumber}
                                onChange={(e) => setEditingUser({...editingUser, phoneNumber: e.target.value})}
                                className="w-full p-2 border rounded"
                            />
                            <h4 className="font-medium">Payment Method</h4>
                            <input
                                type="text"
                                placeholder="Name on Card"
                                value={editingUser.paymentMethod.nameOnCard}
                                onChange={(e) => setEditingUser({...editingUser, paymentMethod: {...editingUser.paymentMethod, nameOnCard: e.target.value}})}
                                className="w-full p-2 border rounded"
                            />
                            <input
                                type="text"
                                placeholder="Card Number"
                                value={editingUser.paymentMethod.cardNumber}
                                onChange={(e) => setEditingUser({...editingUser, paymentMethod: {...editingUser.paymentMethod, cardNumber: e.target.value}})}
                                className="w-full p-2 border rounded"
                            />
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    placeholder="Exp Month"
                                    value={editingUser.paymentMethod.expMonth}
                                    onChange={(e) => setEditingUser({...editingUser, paymentMethod: {...editingUser.paymentMethod, expMonth: e.target.value}})}
                                    className="w-1/2 p-2 border rounded"
                                />
                                <input
                                    type="text"
                                    placeholder="Exp Year"
                                    value={editingUser.paymentMethod.expYear}
                                    onChange={(e) => setEditingUser({...editingUser, paymentMethod: {...editingUser.paymentMethod, expYear: e.target.value}})}
                                    className="w-1/2 p-2 border rounded"
                                />
                            </div>
                            <input
                                type="text"
                                placeholder="CVV"
                                value={editingUser.paymentMethod.cvv}
                                onChange={(e) => setEditingUser({...editingUser, paymentMethod: {...editingUser.paymentMethod, cvv: e.target.value}})}
                                className="w-full p-2 border rounded"
                            />
                            <div className="flex justify-end space-x-2">
                                <button type="button" onClick={() => setEditingUser(null)} className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CrudUser;
