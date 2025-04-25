"use client";
import Description from '@/components/Description';
import React, { useEffect, useState } from 'react'
import Link from 'next/link';

const Page = () => {
    const [errorLogs, setErrorLogs] = useState('');
    const [accounts, setAccounts] = useState([]);
    const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
    const [filters, setFilters] = useState({
        search: '',
        status: 'all'
    });

    useEffect(() => {
        const adminSession = localStorage.getItem("adminSession");

        if (!adminSession) {
            window.location.href = "http://localhost:3000/admin";
            setIsAdminLoggedIn(false);
        } else {
            setIsAdminLoggedIn(true);
        }
    }, [isAdminLoggedIn]);

    const fetchUserDetails = async () => {
        if(!isAdminLoggedIn) return;

        try {
            const response = await fetch("http://localhost:5000/api/users", {
                method: "GET",
            });

            if (!response.ok) {
                throw new Error("Failed to fetch user details");
            }

            const data = await response.json();
            console.log(data);
            setAccounts(data);
        } catch (error) {
            setErrorLogs(error.message);
        }
    }

    useEffect(() => {
        fetchUserDetails();
    }, [isAdminLoggedIn]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const handleBanClick = (userId) => {
        setSelectedUser(userId);
        setIsModalOpen(true);
    };

    const handleBanSubmit = async (banDescription) => {
        if(!isAdminLoggedIn) return;

        try {
            const response = await fetch("http://localhost:5000/api/ban", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: selectedUser,
                    banDescription: banDescription
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to ban user");
            }

            alert("User banned successfully!");
            console.log(data);

            const updatedAccounts = accounts.map((account) => {
                if (account.id === selectedUser) {
                    return { ...account, isBanned: 1 };
                }
                return account;
            });

            setAccounts(updatedAccounts);
            setIsModalOpen(false);
            setSelectedUser(null);

        } catch (error) {
            console.error("Error banning user:", error.message);
            alert("Error: " + error.message);
        }
    };

    async function unbanUser(userId) {
        if(!isAdminLoggedIn) return;
        try {
            const response = await fetch("http://localhost:5000/api/unban", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: userId
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to unban user");
            }

            alert("User unbanned successfully!");
            console.log(data);

            const updatedAccounts = accounts.map((account) => {
                if (account.id === userId) {
                    return { ...account, isBanned: 0 };
                }
                return account;
            });

            setAccounts(updatedAccounts);

        } catch (error) {
            console.error("Error unbanning user:", error.message);
            alert("Error: " + error.message);
        }
    }

    const handleLogout = () => {
        localStorage.removeItem("adminSession");
        window.location.href = "http://localhost:3000/admin";
    };

    // Add this new function for filtering
    const filteredAccounts = accounts.filter(account => {
        const matchesSearch = 
            account.fullName?.toLowerCase().includes(filters.search.toLowerCase()) ||
            account.email?.toLowerCase().includes(filters.search.toLowerCase()) ||
            account.phonenumber?.includes(filters.search);
        
        const matchesStatus = 
            filters.status === 'all' || 
            (filters.status === 'active' && account.isBanned === 0) ||
            (filters.status === 'banned' && account.isBanned === 1);

        return matchesSearch && matchesStatus;
    });

    return (
        <div className='w-full h-screen bg-white overflow-auto pb-5'>
            <div className='p-5 bg-white z-50 relative h-screen text-black mx-auto max-w-[1200px]'>
                {/* Navbar */}
                <div className='mb-5 border-b-[1px] pb-5 flex gap-5 items-center justify-between'>
                    <div className="flex items-center gap-5">
                        <Link href="/admin/dashboard" className="hover:text-blue-600">
                            Requests
                        </Link>
                        <Link href="/admin/users" className="text-blue-600">
                            Users
                        </Link>
                    </div>
                    <div 
                        onClick={handleLogout}
                        className='bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 cursor-pointer'>
                        Log out
                    </div>
                </div>

                <div className="mb-8">
                    <h1 className='text-2xl font-bold'>
                        Welcome back, Admin!
                    </h1>
                    <p className="text-gray-600 mt-2">
                        You can manage your users, requests, and other admin-related tasks here.
                    </p>
                </div>

                <div className='mt-5'>
                    <h1 className='text-xl font-bold mt-8 mb-4'>
                        Users List
                    </h1>

                    {/* Add filtering controls */}
                    <div className="mb-4 flex gap-4 items-center">
                        <input
                            type="text"
                            placeholder="Search by name, email, or phone..."
                            className="p-2 border border-gray-300 rounded-md flex-1"
                            value={filters.search}
                            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                        />
                        <select
                            className="p-2 border border-gray-300 rounded-md"
                            value={filters.status}
                            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="banned">Banned</option>
                        </select>
                    </div>

                    <div className="w-full overflow-auto max-h-[600px] border border-gray-700 rounded-lg relative">
                        <table className="w-full bg-black text-white border-collapse">
                            <thead className="bg-gray-900 sticky top-0">
                                <tr className="text-left">
                                    <th className="p-3 border-b border-gray-700">ID</th>
                                    <th className="p-3 border-b border-gray-700">Name</th>
                                    <th className="p-3 border-b border-gray-700">Email</th>
                                    <th className="p-3 border-b border-gray-700">Phone Number</th>
                                    <th className="p-3 border-b border-gray-700">Status</th>
                                    <th className="p-3 border-b border-gray-700">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {!filteredAccounts.length && (
                                    <tr>
                                        <td colSpan={6} className="text-center p-5 border-b border-gray-700">
                                            No users found
                                        </td>
                                    </tr>
                                )}
                                {filteredAccounts.map((account, index) => (
                                    <tr key={index} className="hover:bg-gray-800">
                                        <td className="p-3 border-b border-gray-700">{account.id}</td>
                                        <td className="p-3 border-b border-gray-700">{account.fullName}</td>
                                        <td className="p-3 border-b border-gray-700">{account.email}</td>
                                        <td className="p-3 border-b border-gray-700">{account.phonenumber}</td>
                                        <td className="p-3 border-b border-gray-700">
                                            {account.isBanned === 0 ? "Active" : "Banned"}
                                        </td>
                                        <td className="p-3 border-b border-gray-700">
                                            {account.isBanned === 0 ? (
                                                <button
                                                    onClick={() => handleBanClick(account.id)}
                                                    className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700">
                                                    Ban
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => unbanUser(account.id)}
                                                    className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700">
                                                    Unban
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {isModalOpen && (
                        <Description
                            isOpen={isModalOpen}
                            onClose={() => setIsModalOpen(false)}
                            onSubmit={handleBanSubmit}
                            type="Ban"
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

export default Page