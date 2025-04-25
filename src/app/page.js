"use client";
import { useRouter } from "next/navigation";
import { Mail, User } from "lucide-react";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-700">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-16">
        <nav className="flex justify-between items-center mb-16">
          <h1 className="text-2xl font-bold text-white">MDC Reservation</h1>
          <div className="space-x-4">
            <button 
              onClick={() => router.push("/login")}
              className="bg-white text-blue-900 px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Login
            </button>
            <button 
              onClick={() => router.push("/signup")}
              className="bg-yellow-500 text-blue-900 px-6 py-2 rounded-lg hover:bg-yellow-400 transition-colors"
            >
              Sign up
            </button>
          </div>
        </nav>

        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Manage Your Facility Reservations with Ease
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Book conference rooms, gyms, and other facilities at MDC quickly and efficiently. 
              Track your reservations and manage your bookings all in one place.
            </p>
            <button 
              onClick={() => router.push("/signup")}
              className="bg-yellow-500 text-blue-900 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-yellow-400 transition-colors"
            >
              Get Started
            </button>
          </div>

          <div className="md:w-1/2 flex justify-center">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
              <h3 className="text-2xl font-bold text-blue-900 mb-4">Available Facilities</h3>
              <ul className="space-y-3">
                {[
                  "Conference Room",
                  "Gymnasium",
                  "Gym Campus 2",
                  "Chapel",
                  "Speech Laboratory"
                ].map((facility) => (
                  <li key={facility} className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">{facility}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-blue-900 mb-12">
            Why Choose Our Reservation System?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-blue-900 mb-2">Real-time Availability</h3>
              <p className="text-gray-600">Check facility availability instantly and book your preferred time slot.</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-blue-900 mb-2">Easy Management</h3>
              <p className="text-gray-600">Track and manage your reservations with our user-friendly interface.</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-blue-900 mb-2">Instant Notifications</h3>
              <p className="text-gray-600">Receive updates about your reservation status and reminders.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="mb-4 md:mb-0">&copy; 2024 MDC Reservation System. All rights reserved.</p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-yellow-500">Terms of Service</a>
              <a href="#" className="hover:text-yellow-500">Privacy Policy</a>
              <a href="#" className="hover:text-yellow-500">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
