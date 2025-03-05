import { useState } from "react";

const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem("userToken");
  
    // Optionally, redirect the user to the login page or another page
    window.location.href = "/login";  // This is just an example
  };
  
  

export default function LogoutButton() {
  return <button className="bg-red-500 text-white py-2 px-4 rounded-lg"
   onClick={handleLogout}>Logout</button>;
}
