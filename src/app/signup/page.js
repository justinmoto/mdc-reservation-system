"use client"; // Required for client-side interactivity

import { useState } from "react";
import SignupModal from "@/components/SignupModal"; // Ensure correct path

export default function SignupPage() {
  const [showSignup, setShowSignup] = useState(true);

  const [signupForm, setSignupForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errorLogs, setErrorLogs] = useState('');

  const handleSignupSubmit = async (e) => {
    e.preventDefault();

    if(signupForm.password !== signupForm.confirmPassword){
      setErrorLogs('Passwords do not match');
      return;
    }

    console.log(signupForm)


    try {
      const response = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: signupForm.fullName,
          email: signupForm.email,
          password: signupForm.password,
          phonenumber: signupForm.phone,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message); // Handle successful signup
      } else {
        alert(data.message); // Handle error
      }
    } catch (error) {
      console.error("Error during signup:", error);
    }
  };


  const handleSignupChange = (e) => {
    setSignupForm({ ...signupForm, [e.target.id]: e.target.value });
  };

  return (
    <div>
      <form onSubmit={handleSignupSubmit}>
        <SignupModal
          showSignup={showSignup}
          setShowSignup={setShowSignup}
          handleSignupChange={handleSignupChange}
          signupForm={signupForm}
          errorLogs={errorLogs}
        />
    
        <button type="submit">Sign Up</button>
      </form>

    </div>
  );
}
