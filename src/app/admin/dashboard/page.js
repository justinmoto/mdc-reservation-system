"use client";
import Description from '@/components/Description';
import React, { useEffect, useState } from 'react'
import Link from 'next/link';

const Page = () => {
    const [errorLogs, setErrorLogs] = useState('');
    const [requests, setRequests] = useState([]);
    const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
    const [filters, setFilters] = useState({
        search: '',
        status: 'all',
        position: 'all',
        room: 'all',
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

    const fetchRequests = async () => {
        if(!isAdminLoggedIn) return;

        try {
            const response = await fetch("http://localhost:5000/api/requests", {
                method: "GET",
            });

            if (!response.ok) {
                throw new Error("Failed to fetch requests");
            }

            const data = await response.json();
            console.log(data);
            setRequests(data);
        } catch (error) {
            setErrorLogs(error.message);
        }
    }

    useEffect(() => {
        fetchRequests();
    }, [isAdminLoggedIn]);

    const [isRejectOpen, setIsRejectOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);

    const handleRejectClick = (reqId) => {
        setSelectedRequest(reqId);
        setIsRejectOpen(true);
    }

    async function rejectRequest(rejectionDesc) {
        try {
            const response = await fetch(`http://localhost:5000/api/reject/${selectedRequest}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    rejectionDesc: rejectionDesc
                }),
            });

            const result = await response.json();
            alert(result.message);
            fetchRequests();

            const updatedRequests = requests.map((req) => {
                if (req.id === selectedRequest) {
                    return { ...req, status: "rejected" };
                }
                return req;
            });

            setIsRejectOpen(false);
            setSelectedRequest(null);
            setRequests(updatedRequests);
        } catch (error) {
            console.error("Error rejecting request:", error);
        }
    }

    async function approveRequest(id) {
        try {
            const response = await fetch(`http://localhost:5000/api/approve/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
            });

            const result = await response.json();
            alert(result.message);
            fetchRequests();

            const updatedRequests = requests.map((req) => {
                if (req.id === id) {
                    return { ...req, status: "approved" };
                }
                return req;
            });

            setRequests(updatedRequests);
        } catch (error) {
            console.error("Error approving request:", error);
        }
    }

    const handleLogout = () => {
        localStorage.removeItem("adminSession");
        window.location.href = "http://localhost:3000/admin";
    };

    // Add this new function for filtering
    const filteredRequests = requests.filter(req => {
        const matchesSearch = 
            req.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
            req.batch?.toLowerCase().includes(filters.search.toLowerCase());
        
        const matchesStatus = 
            filters.status === 'all' || 
            req.status === filters.status;

        const matchesPosition =
            filters.position === 'all' ||
            req.position === filters.position;

        const matchesRoom =
            filters.room === 'all' ||
            req.room === filters.room;

        return matchesSearch && matchesStatus && matchesPosition && matchesRoom;
    });

    // Get unique values for dropdowns
    const uniquePositions = [...new Set(requests.map(req => req.position))];
    const uniqueRooms = [...new Set(requests.map(req => req.room))];

    return (
        <div className='w-full h-screen bg-white overflow-auto pb-5'>
            <div className='p-5 bg-white z-50 relative h-screen text-black mx-auto max-w-[1200px]'>
                {/* Navbar */}
                <div className='mb-5 border-b-[1px] pb-5 flex gap-5 items-center justify-between'>
                    <div className="flex items-center gap-5">
                        <Link href="/admin/dashboard" className="text-blue-600">
                            Requests
                        </Link>
                        <Link href="/admin/users" className="hover:text-blue-600">
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
                    <h1 className='text-2xl font-bold text-black'>
                        Welcome back, Admin!
                    </h1>
                    <p className="text-gray-600 mt-2">
                        You can manage your users, requests, and other admin-related tasks here.
                    </p>
                </div>

                <div className='mt-5'>
                    <h1 className='text-xl font-bold mt-8 mb-4'>
                        Requests List
                    </h1>

                    {/* Add filtering controls */}
                    <div className="mb-4 flex gap-4 items-center flex-wrap">
                        <input
                            type="text"
                            placeholder="Search by name or batch..."
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
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>
                        <select
                            className="p-2 border border-gray-300 rounded-md"
                            value={filters.position}
                            onChange={(e) => setFilters(prev => ({ ...prev, position: e.target.value }))}
                        >
                            <option value="all">All Positions</option>
                            {uniquePositions.map(pos => (
                                <option key={pos} value={pos}>{pos}</option>
                            ))}
                        </select>
                        <select
                            className="p-2 border border-gray-300 rounded-md"
                            value={filters.room}
                            onChange={(e) => setFilters(prev => ({ ...prev, room: e.target.value }))}
                        >
                            <option value="all">All Rooms</option>
                            {uniqueRooms.map(room => (
                                <option key={room} value={room}>{room}</option>
                            ))}
                        </select>
                    </div>

                    <div className="w-full overflow-auto max-h-[600px] border border-gray-700 rounded-lg">
                        <table className="w-full bg-black text-white border-collapse relative z-0">
                            <thead className="bg-gray-900 sticky top-0">
                                <tr className="text-left">
                                    <th className="p-3 border-b border-gray-700">ID</th>
                                    <th className="p-3 border-b border-gray-700">Name</th>
                                    <th className="p-3 border-b border-gray-700">Position</th>
                                    <th className="p-3 border-b border-gray-700">Batch</th>
                                    <th className="p-3 border-b border-gray-700">Booking Date</th>
                                    <th className="p-3 border-b border-gray-700">Time</th>
                                    <th className="p-3 border-b border-gray-700">Room</th>
                                    <th className="p-3 border-b border-gray-700">Request</th>
                                    <th className="p-3 border-b border-gray-700">Status</th>
                                    <th className="p-3 border-b border-gray-700">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {!filteredRequests.length && (
                                    <tr>
                                        <td colSpan={10} className="text-center p-5 border-b border-gray-700">
                                            No requests found
                                        </td>
                                    </tr>
                                )}
                                {filteredRequests.map((req, index) => (
                                    <tr key={index} className="hover:bg-gray-800">
                                        <td className="p-3 border-b border-gray-700">{req.id}</td>
                                        <td className="p-3 border-b border-gray-700">{req.name}</td>
                                        <td className="p-3 border-b border-gray-700">{req.position}</td>
                                        <td className="p-3 border-b border-gray-700">{req.batch}</td>
                                        <td className="p-3 border-b border-gray-700">
                                            {new Date(req.booking_date).toLocaleDateString()}
                                        </td>
                                        <td className="p-3 border-b border-gray-700">
                                            {req.start_time} - {req.end_time}
                                        </td>
                                        <td className="p-3 border-b border-gray-700">{req.room}</td>
                                        <td className="p-3 border-b border-gray-700">
                                            {req.specificRequest || "N/A"}
                                        </td>
                                        <td className="p-3 border-b border-gray-700 capitalize">
                                            {req.status}
                                        </td>
                                        <td className="p-3 border-b border-gray-700">
                                            {req.status === "pending" ? (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => approveRequest(req.id)}
                                                        className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700">
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleRejectClick(req.id)}
                                                        className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700">
                                                        Reject
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">Processed</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {isRejectOpen && (
                            <Description
                                isOpen={isRejectOpen}
                                onClose={() => setIsRejectOpen(false)}
                                onSubmit={rejectRequest}
                                type="Rejection"
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Page

