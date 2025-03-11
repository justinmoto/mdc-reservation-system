"use client";
import React, { useState, useEffect } from "react";

const page = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");



    useEffect(() => {
        const adminSession = localStorage.getItem("adminSession");
        if (adminSession) {
            setIsLoggedIn(true);
        }
    }, []);

    const handleLogin = (e) => {
        e.preventDefault();
        if (username === "admin" && password === "password123") {
            localStorage.setItem("adminSession", "true");
            setIsLoggedIn(true);


            window.location.href = "http://localhost:3000/admin/dashboard";

        } else {
            alert("Invalid credentials");
        }
    };

    useEffect(() => {
        const adminSession = localStorage.getItem("adminSession");

        if (adminSession) {
            setIsLoggedIn(true);
            
            window.location.href = "http://localhost:3000/admin/dashboard";
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("adminSession");
        setIsLoggedIn(false);
    };

    if (!isLoggedIn) {
        return (
            <div className="h-screen flex items-center justify-center bg-gray-100 text-black">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
                    <h2 className="text-xl font-bold mb-4 text-center">Admin Login</h2>
                    <form onSubmit={handleLogin} className="flex flex-col gap-3">
                        <input
                            type="text"
                            placeholder="Username"
                            className="border p-2 rounded"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            className="border p-2 rounded"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                            Login
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div>
            <button onClick={handleLogout} className="bg-red-500 text-white p-2 rounded">
                Logout
            </button>
            {children}
        </div>
    );
};

export default page;
