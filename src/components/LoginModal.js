"use client";

export default function LoginModal({ showLogin, setShowLogin, handleLoginChange, loginForm }) {
  if (!showLogin) return null; // Hide modal if showLogin is false

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-1/3">
        <h2 className="text-lg font-bold mb-4">Login</h2>
        <input
          type="email"
          id="email"
          placeholder="Email"
          className="border-2 border-gray-300 p-2 rounded-lg w-full mb-2"
          onChange={handleLoginChange}
          value={loginForm.email}
        />
        <input
          type="password"
          id="password"
          placeholder="Password"
          className="border-2 border-gray-300 p-2 rounded-lg w-full mb-2"
          onChange={handleLoginChange}
          value={loginForm.password}
        />
        <button className="bg-blue-800 text-white py-2 w-full rounded-lg">Login</button>
        <p className="text-sm text-center mt-2 text-blue-500 cursor-pointer">Forgot Password?</p>
        <button onClick={() => setShowLogin(false)} className="mt-4 text-red-500 w-full">Close</button>
      </div>
    </div>
  );
}
