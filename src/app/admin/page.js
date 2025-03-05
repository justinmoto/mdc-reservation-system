"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router"; // Importing useRouter
import { User } from 'some-icon-library'; // Ensure to replace with the actual import path for the User icon

export default function AdminPage() {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [requests, setRequests] = useState([]);
const [errorMessage, setErrorMessage] = useState(""); // State for error messages

  const router = useRouter(); // Defining router

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/requests");
      if (!res.ok) throw new Error("Failed to fetch requests");
      const data = await res.json();
      setRequests(data);
    } catch (error) {
      console.error("Error fetching requests:", error);
      setErrorMessage("Failed to load requests. Please try again later."); // Set error message
    }
  };

  const handleLogout = () => {
    console.log("User logged out");
    // Example: localStorage.removeItem('user');
    // window.location.href = '/login';
  };

  const handleAction = async (id, status) => {
    try {
      const res = await fetch(`http://localhost:5000/api/requests/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error("Failed to update request");

      // Update UI
      setRequests(requests.filter((req) => req.id !== id));
    } catch (error) {
      console.error("Error updating request:", error);
      setErrorMessage("Failed to update request. Please try again."); // Set error message
    }
  };

  return (
    <div className="p-6 relative">
      <div className="absolute top-4 right-4">
        <button 
          onClick={() => setDropdownVisible(!dropdownVisible)} // Toggle dropdown visibility
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-600 bg-yellow-500 text-black">
          <User className="w-6 h-6" /> {/* Profile Icon */}
        </button>
        {dropdownVisible && (
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg">
            <div className="p-2">
              <p>Username: {/* Display username here */}</p>
              <button onClick={handleLogout} className="w-full text-left p-2 hover:bg-gray-200">Logout</button>
            </div>
          </div>
        )}
      </div>

      <h1 className="text-2xl font-bold">Admin Panel</h1>
      {errorMessage && <p className="text-red-600">{errorMessage}</p>} {/* Display error message */}

      <table className="w-full border-collapse border border-gray-300 mt-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2">Name</th>
            <th className="border border-gray-300 p-2">Position</th>
            <th className="border border-gray-300 p-2">Batch</th>
            <th className="border border-gray-300 p-2">Date</th>
            <th className="border border-gray-300 p-2">Time</th>
            <th className="border border-gray-300 p-2">Room</th>
            <th className="border border-gray-300 p-2">Status</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req.id} className="border border-gray-300">
              <td className="border border-gray-300 p-2">{req.name}</td>
              <td className="border border-gray-300 p-2">{req.position}</td>
              <td className="border border-gray-300 p-2">{req.batch}</td>
              <td className="border border-gray-300 p-2">{req.booking_date}</td>
              <td className="border border-gray-300 p-2">{`${req.start_time} - ${req.end_time}`}</td>
              <td className="border border-gray-300 p-2">{req.room}</td>
              <td className={`border border-gray-300 p-2 ${req.status === "Approved" ? "text-green-600" : "text-red-600"}`}>
                {req.status}
              </td>
              <td className="border border-gray-300 p-2 flex gap-2">
                <button onClick={() => handleAction(req.id, "Approved")} className="bg-green-500 text-white px-2 py-1 rounded-lg">
                  Approve
                </button>
                <button onClick={() => handleAction(req.id, "Declined")} className="bg-red-500 text-white px-2 py-1 rounded-lg">
                  Decline
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
