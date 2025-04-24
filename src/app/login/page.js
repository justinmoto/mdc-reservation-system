"use client"; // Required for client-side interactivity

import { useState, useEffect} from "react";
import { useRouter } from "next/navigation";
import LoginModal from "@/components/LoginModal";
import LogoutButton from "@/components/LogoutButton";

export default function LoginPage() {
  const router = useRouter();
  const [showLogin, setShowLogin] = useState(true);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [errorLogs, setErrorLogs] = useState('');

  // useEffect(() => {
  //   const userToken = localStorage.getItem("userToken");
  //   if (userToken) {
  //     // If token exists, you can either redirect or skip the login
  //     alert("You are already logged in.");
  //     // Redirect user or show a different UI
  //   }
  // }, []);

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
        } catch (error) {
          setErrorLogs(error.message); // Handle error
        }
      };

      fetchUserDetails();
    }
  }, []);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: loginForm.email,
          password: loginForm.password,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("userToken", data.token); // Store the token returned by the backend
        router.push("/home"); // Redirect to home page after successful login
      } else {
        setErrorLogs(data.message);
      }
    } catch (error) {
      console.error("Error during login:", error);
      setErrorLogs("Failed to login. Please try again.");
    }
  };

  const handleLoginChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.id]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-900 to-blue-700">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-blue-900 mb-6">Login to MDC Reservation</h2>
        {errorLogs && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {errorLogs}
          </div>
        )}
        <form onSubmit={handleLoginSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={loginForm.email}
              onChange={handleLoginChange}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={loginForm.password}
              onChange={handleLoginChange}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-900 text-white py-2 px-4 rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <button
            onClick={() => router.push("/signup")}
            className="text-blue-900 hover:text-blue-700 font-medium"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}
