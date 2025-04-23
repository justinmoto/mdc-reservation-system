"use client";
import Description from '@/components/Description';
import React, { useEffect, useState } from 'react'

const Page = () => {
    const [errorLogs, setErrorLogs] = useState('');
    const [accounts, setAccounts] = useState([]);
    const [requests, setRequests] = useState([]);

    const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

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
            console.log(data); // Handle user details
            setAccounts(data);
        } catch (error) {
            setErrorLogs(error.message); // Handle error
        }
    }

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
            console.log(data); // Handle requests
            setRequests(data);
        } catch (error) {
            setErrorLogs(error.message); // Handle error
        }
    }



    useEffect(() => {

        fetchUserDetails();
        fetchRequests();

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


            // Update the accounts list
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

            // Update the accounts list
            const updatedAccounts = accounts.map((account) => {
                if (account.id === userId) {
                    return { ...account, isBanned: 0 };
                }
                return account;
            }
            );

            setAccounts(updatedAccounts);

        } catch (error) {
            console.error("Error unbanning user:", error.message);
            alert("Error: " + error.message);
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

            // Update the requests list
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
            fetchRequests(); // Refresh list

            // Update the requests list
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


    const handleLogout = () => {
        localStorage.removeItem("adminSession");
        window.location.href = "http://localhost:3000/admin";
    };

    return (
        <div className='w-full h-screen bg-white  overflow-auto pb-5'>
            <div className='p-5 bg-white z-50 relative h-screen text-black mx-auto max-w-[1200px]'>
                <div className='mb-5 border-b-[1px] pb-5 flex gap-5 items-center justify-between'>
                  <div>
                  <h1 className='text-2xl font-bold'>
                        Welcome back, Admin!</h1>
                    <p>
                        You can manage your users, requests, and other admin-related tasks here.
                    </p>
                  </div>


                  <div 
                  onClick={handleLogout}
                  className='bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 cursor-pointer'>
                    Log out
                  </div>

                </div>

                <div className='mt-5'>
                    <h1 className='text-xl font-bold mt-8 mb-4'>
                        Users List
                    </h1>
                    <div className="w-full overflow-auto max-h-[400px] border border-gray-700 rounded-lg relative">
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
                                {!accounts.length && (
                                    <tr>
                                        <td colSpan={6} className="text-center p-5 border-b border-gray-700">
                                            No users found
                                        </td>
                                    </tr>
                                )}
                                {accounts.reverse().map((account, index) => (
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

                    {
                        isModalOpen && (
                            <Description
                                isOpen={isModalOpen}
                                onClose={() => setIsModalOpen(false)}
                                onSubmit={handleBanSubmit}
                                type="Ban"
                            />
                        )
                    }
                </div>


                <div className='mt-7 border-t-[1px] pt-5'>
                    <h1 className='text-xl font-bold mt-8 mb-4'>
                        Requests List
                    </h1>

                    <div className="w-full overflow-auto max-h-[400px] border border-gray-700 rounded-lg">
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
                                {!requests.length && (
                                    <tr>
                                        <td colSpan={10} className="text-center p-5 border-b border-gray-700">
                                            No requests found
                                        </td>
                                    </tr>
                                )}
                                {requests.reverse().map((req, index) => (
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




                        {
                            isRejectOpen && (
                                <Description
                                    isOpen={isRejectOpen}
                                    onClose={() => setIsRejectOpen(false)}
                                    onSubmit={rejectRequest}
                                    type="Rejection"
                                />
                            )
                        }
                    </div>

                </div>


            </div>
        </div>
    )
}

export default Page
