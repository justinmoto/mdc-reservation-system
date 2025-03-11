import React, { useEffect, useState } from "react";

const IsUserBanned = () => {
    const [bannedDescription, setBannedDescription] = useState("");
    const [isBanned, setIsBanned] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("userToken");

        if (token) {
            const fetchUserDetails = async () => {
                try {
                    const response = await fetch("http://localhost:5000/api/user", {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${token}`, // Send token in Authorization header
                        },
                    });

                    if (!response.ok) {
                        throw new Error("Failed to fetch user details");
                    }

                    const data = await response.json();

                    console.log(data); // Handle user details

                    if (data.user.isBanned === 1) { 
                        setBannedDescription(data.user.banDescription);
                        setIsBanned(data.user.isBanned === 1 ? true : false); // Show modal if user is banned


                    }
                } catch (error) {
                    console.error("Error fetching user details:", error.message);
                }
            };

            fetchUserDetails();
        }
    }, []);

    return (
        <>
            {isBanned && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md text-center">
                        <h2 className="text-xl font-semibold text-red-600 mb-4">
                            You Are Banned
                        </h2>
                        <p className="text-gray-700 mb-4">
                            Reason: {bannedDescription || "No reason provided."}
                        </p>
                        <button
                            onClick={() => localStorage.clear()}
                            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default IsUserBanned;
