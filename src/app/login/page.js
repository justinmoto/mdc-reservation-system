"use client"; // Required for client-side interactivity

import { useState } from "react";
import LoginModal from "@/components/LoginModal"; // Ensure the file path is correct

export default function LoginPage() {
  const [showLogin, setShowLogin] = useState(true);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginForm),
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message); // Handle successful login
      } else {
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
        />
        <button type="submit">Login</button>
      </form>

    </div>
  );
}
