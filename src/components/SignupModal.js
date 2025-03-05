"use client";

export default function SignupModal({ showSignup, setShowSignup, handleSignupChange, signupForm, errorLogs }) {
  if (!showSignup) return null; // Hide modal if showSignup is false

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-1/3">
        <h2 className="text-lg font-bold mb-4 text-black">Sign Up</h2>
        
        <input
          type="text"
          id="fullName"
          placeholder="Full Name"
          className="border-2 border-gray-300 p-2 rounded-lg w-full mb-2"
          onChange={handleSignupChange}
          value={signupForm.fullName}
        />

        <input
          type="email"
          id="email"
          placeholder="Email"
          className="border-2 border-gray-300 p-2 rounded-lg w-full mb-2"
          onChange={handleSignupChange}
          value={signupForm.email}
        />

        <input
          type="tel"
          id="phone"
          placeholder="Phone Number"
          className="border-2 border-gray-300 p-2 rounded-lg w-full mb-2"
          onChange={handleSignupChange}
          value={signupForm.phone}
        />

        <input
          type="password"
          id="password"
          placeholder="Create Password"
          className="border-2 border-gray-300 p-2 rounded-lg w-full mb-2"
          onChange={handleSignupChange}
          value={signupForm.password}
        />

        <input
          type="password"
          id="confirmPassword"
          placeholder="Confirm Password"
          className="border-2 border-gray-300 p-2 rounded-lg w-full mb-2"
          onChange={handleSignupChange}
          value={signupForm.confirmPassword}
        />
    {
          errorLogs != '' && <p className="text-red-500">{errorLogs}</p>
        }
        <button className="bg-green-600 text-white py-2 w-full rounded-lg">Sign Up</button>
        
        <button onClick={() => setShowSignup(false)} className="mt-4 text-red-500 w-full">Close</button>
      </div>
    </div>
  );
}
