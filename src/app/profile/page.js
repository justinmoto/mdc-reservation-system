'use client';

import { useState } from 'react';
import { Upload, Settings } from 'lucide-react';

export default function ProfilePage() {
  const [profileImage, setProfileImage] = useState(null);
  const [userInfo, setUserInfo] = useState({
    name: 'John Doe',
    contact: '123-456-7890',
    email: 'johndoe@example.com',
  });

  const [reservations, setReservations] = useState([
    { id: 1, facility: 'Conference Room', date: '2025-03-01', status: 'Upcoming' },
    { id: 2, facility: 'Gym', date: '2025-02-20', status: 'Completed' },
  ]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-poppins">
      <div className="max-w-3xl mx-auto bg-white p-6 shadow-md rounded-lg">
        <div className="flex items-center gap-4">
          <label className="relative cursor-pointer">
            <input type="file" className="hidden" onChange={handleImageUpload} />
          </label>
          <div>
            <h2 className="text-xl font-bold">{userInfo.name}</h2>
            <p className="text-gray-600">{userInfo.contact}</p>
            <p className="text-gray-600">{userInfo.email}</p>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold">Reservations</h3>
          <div className="mt-2">
            {reservations.length > 0 ? (
              reservations.map((res) => (
                <div key={res.id} className="bg-gray-200 p-3 rounded-md mb-2">
                  <p><strong>Facility:</strong> {res.facility}</p>
                  <p><strong>Date:</strong> {res.date}</p>
                  <p><strong>Status:</strong> <span className={res.status === 'Upcoming' ? 'text-blue-600' : 'text-green-600'}>{res.status}</span></p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No reservations yet.</p>
            )}
          </div>
        </div>

        <button className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-500">
          <Settings className="w-5 h-5" /> Account Settings
        </button>
      </div>
    </div>
  );
}
