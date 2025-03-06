"use client"; // Required for client-side interactivity

import { useState, useEffect} from "react";
import LoginModal from "@/components/LoginModal"; // Ensure the file path is correct
import LogoutButton from "@/components/LogoutButton";

export default function LoginPage() {
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
          setError(error.message); // Handle error
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
        alert(data.message); // Handle successful login
      } else {
        setErrorLogs(data.message);
        alert(data.message); // Handle error
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };


  const handleLoginChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.id]: e.target.value });
  };

  return (
    <div>
      <form onSubmit={handleLoginSubmit}>
        <LoginModal
          showLogin={showLogin}
          setShowLogin={setShowLogin}
          handleLoginChange={handleLoginChange}
          loginForm={loginForm}
          errorLogs={errorLogs}
        />


        <button type="submit">Login</button>
        <LoginModal />
   
      </form>

    </div>
  );
}
