"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, User } from "lucide-react";
import { useMemo } from "react";

export default function Home() {
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [form, setForm] = useState({
    specificRequest: "",
    name: "",
    position: "",
    batch: "",
    date: "",
    startTime: "",
    endTime: "",
    room: "Conference Room",
  });

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const [editingIndex, setEditingIndex] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) =>
      booking.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [bookings, searchQuery]);
  

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };
  
  const addBooking = async (event) => {
    event.preventDefault(); // Prevents page reload
  
    console.log("Form State:", form);
  
    if (
      !form.name.trim() ||
      !form.position.trim() ||
      !form.batch.trim() ||
      !form.date.trim() ||
      !form.startTime.trim() ||
      !form.endTime.trim() ||
      !form.room.trim()
    ) {
      setErrorMessage("All fields must be filled out.");
      return;
    }
  
    // Move the duplicate check inside the function
    const isDuplicate = bookings.some(
      (booking) =>
        booking.date === form.date &&
        booking.startTime === form.startTime &&
        booking.endTime === form.endTime &&
        booking.room === form.room
    );
  
    if (isDuplicate) {
      setErrorMessage("Date and facility not available.");
      return;
    }
  
    try {
      const res = await fetch("http://localhost:5000/api/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
  
      if (!res.ok) {
        throw new Error("Failed to send request");
      }
  
      const newBooking = await res.json();
      setBookings((prev) => [...prev, newBooking]); // Ensure state updates properly
      setForm({
        name: "",
        position: "",
        batch: "",
        date: "",
        startTime: "",
        endTime: "",
        room: "Conference Room",
        specificRequest: "",
      });
      setErrorMessage("");
    } catch (error) {
      console.error("Error sending request:", error);
      setErrorMessage("Failed to send request. Please try again.");
    }
  };
  
  

  const deleteBooking = (index) => {
    setBookings((prevBookings) => prevBookings.filter((_, i) => i !== index));
  };

  const startEditing = (index) => {
    setEditingIndex(index);
  };

  const handleTableChange = (index, field, value) => {
    const updatedBookings = [...bookings];
    updatedBookings[index] = { ...updatedBookings[index], [field]: value };
    setBookings(updatedBookings);
  };

  const saveChanges = () => {
    setEditingIndex(null);
  };

  const to12HourFormat = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":").map(Number);
    const suffix = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${suffix}`;
  };
  

  return (
    <div className="min-h-screen p-6 font-poppins bg-gray-100">
      <header className="flex justify-between items-center bg-blue-800 text-white p-4 rounded-lg">
        <h1 className="text-lg font-bold">MDC Reservation for Facilities</h1>
        <div className="flex gap-2 ml-50">
          <button onClick={() => router.push("/signup")} className="bg-yellow-500 text-black px-4 py-2 rounded-lg  hover:bg-gray-500">Sign up</button>
          <button onClick={() => router.push("/login")} className="bg-yellow-500 text-black px-4 py-2 rounded-lg  hover:bg-gray-500">Login</button>
         </div>
    <div className="flex items-center gap-4 pl-100">
       {/* Mail Button */}
       <button 
         onClick={() => router.push("/Mail")}
          className="relative bg-yellow-500 text-black p-2 rounded-full hover:bg-gray-600">
         <Mail className="w-5 h-5" /> {/* Mail Icon */}
          <span className="absolute top-0 right-0 rounded-full px-1"></span>
       </button>
       {/* Profile Button */}
        <button 
         onClick={() => router.push("/profile")}
         className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-600 bg-yellow-500 text-black">
         <User className="w-6 h-6" /> {/* Profile Icon */}
        </button>
   
        <input 
       type="text" 
       placeholder="Search..." 
       className="p-2 rounded text-black" 
       value={searchQuery || ""} 
       onChange={handleSearchChange} 
       />

     </div>
   </header>

      <main className="flex gap-6 mt-6">
  <aside className="bg-white p-6 shadow-md rounded-lg w-1/3">
    <h2 className="text-lg font-bold mb-4">Book a Facility</h2>
    {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}
    
    <div className="flex flex-col gap-4 p-4 rounded-lg">
    <input type="text" id="name" placeholder="Your Name" 
  className="input border-2 border-gray-300 p-2 rounded-lg" 
  onChange={handleChange} value={form.name} />

<select id="position" 
  className="input border-2 border-gray-300 p-2 rounded-lg" 
  onChange={handleChange} value={form.position}>
  <option value="">Select Position</option>
  <option value="Student">Student</option>
  <option value="Faculty">Faculty</option>
  <option value="Staff">Staff</option>
  <option value="Administrator">Administrator</option>
</select>


<input type="text" id="batch" placeholder="Year level" 
  className="input border-2 border-gray-300 p-2 rounded-lg" 
  onChange={handleChange} value={form.batch} />

<input type="date" id="date" 
  className="input border-2 border-gray-300 p-2 rounded-lg " 
  onChange={handleChange} value={form.date} />

<input
  type="time"
  id="startTime"
  className="input border-2 border-gray-300 p-2 rounded-lg "
  onChange={handleChange}
  value={form.startTime || ""} 
/>

<input
  type="time"
  id="endTime"
  className="input border-2 border-gray-300 p-2 rounded-lg "
  onChange={handleChange}
  value={form.endTime || ""} 
/>


<select id="room" 
  className="input border-2 border-gray-300 p-2 rounded-lg " 
  onChange={handleChange} value={form.room}>
  <option>Conference Room</option>
  <option>Gym</option>
  <option>Gym Campus 2</option>
  <option>Chapel</option>
  <option>Speech Laboratory</option>
</select>

      <input
        type="text"
        id="specificRequest"
        placeholder="Specific Requests (e.g., 5 chairs)"
        className="input border-2 border-gray-300 p-2 rounded-lg"
        onChange={handleChange}
        value={form.specificRequest}
      />
      <button onClick={addBooking} className="bg-blue-800 text-white py-2 rounded-lg hover:bg-gray-500 ">Add Booking Request</button>
    </div>
  </aside>

  <section className="bg-white p-6 shadow-md rounded-lg flex-1">
    <h2 className="text-lg font-bold mb-4">Reservations</h2>
    <table className="w-full border-collapse border border-gray-300">
      <thead>
      <tr className="bg-gray-200">
      <th className="border border-gray-300 p-2">Name</th>
      <th className="border border-gray-300 p-2">Position</th>
      <th className="border border-gray-300 p-2">Year</th>
      <th className="border border-gray-300 p-2">Date</th>
      <th className="border border-gray-300 p-2">Time (Start - End)</th>
      <th className="border border-gray-300 p-2">Room</th>
      <th className="border border-gray-300 p-2">Specific Requests</th>
      <th className="border border-gray-300 p-2">Actions</th>
    </tr>
      </thead>
      <tbody>
      {filteredBookings.length > 0 ? (
  filteredBookings.map((booking, index) => (

            <tr key={index} className="border border-gray-300">
              <td className="border border-gray-300 p-2">
                {editingIndex === index ? (
                  <input
                    type="text"
                    value={booking.name}
                    onChange={(e) => handleTableChange(index, "name", e.target.value)}
                    className="border p-1 rounded w-full"
                  />
                ) : (
                  booking.name
                )}
              </td>
              <td className="border border-gray-300 p-2">
                {editingIndex === index ? (
                  <input
                    type="text"
                    value={booking.position}
                    onChange={(e) => handleTableChange(index, "position", e.target.value)}
                    className="border p-1 rounded w-full"
                  />
                ) : (
                  booking.position
                )}
              </td>
              <td className="border border-gray-300 p-2">
                {editingIndex === index ? (
                  <input
                    type="text"
                    value={booking.batch}
                    onChange={(e) => handleTableChange(index, "batch", e.target.value)}
                    className="border p-1 rounded w-full"
                  />
                ) : (
                  booking.batch
                )}
              </td>
              <td className="border border-gray-300 p-2">
                {editingIndex === index ? (
                  <input
                    type="date"
                    value={booking.date}
                    onChange={(e) => handleTableChange(index, "date", e.target.value)}
                    className="border p-1 rounded w-full"
                  />
                ) : (
                  booking.date
                )}
              </td>
              <td className="border border-gray-300 p-2">
  {editingIndex === index ? (
    <>
      <input
        type="time"
        value={booking.startTime}
        onChange={(e) => handleTableChange(index, "startTime", e.target.value)}
        className="border p-1 rounded w-full"
      />
      <input
        type="time"
           value={booking.endTime}
           onChange={(e) => handleTableChange(index, "endTime", e.target.value)}
           className="border p-1 rounded w-full"
         />
       </>
      ) : (
       `${to12HourFormat(booking.startTime)} - ${to12HourFormat(booking.endTime)}` 
      )}
     </td>

              <td className="border border-gray-300 p-2">
                {editingIndex === index ? (
                  <select
                    value={booking.room}
                    onChange={(e) => handleTableChange(index, "room", e.target.value)}
                    className="border p-1 rounded w-full"
                  >
                    <option>Conference Room</option>
                    <option>Gym</option>
                    <option>Gym Campus 2</option>
                    <option>Chapel</option>
                    <option>Speech Laboratory</option>
                  </select>
                ) : (
                  booking.room
                )}
              </td>
              <td className="border border-gray-300 p-2">{booking.specificRequest}</td>
              <td className="border border-gray-300 p-2 flex gap-2">
                {editingIndex === index ? (
                  <button onClick={saveChanges} className="bg-green-500 text-white px-2 py-1 rounded-lg">Save</button>
                ) : (
                  <button onClick={() => startEditing(index)} className="bg-yellow-500 text-white px-2 py-1 rounded-lg">Edit</button>
                )}
                <button onClick={() => deleteBooking(index)} className="bg-red-500 text-white px-2 py-1 rounded-lg">Delete</button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="8" className="text-center p-4">No bookings available</td>
          </tr>
        )}
      </tbody>
    </table>
  </section>
</main>
    </div>
  );
}
