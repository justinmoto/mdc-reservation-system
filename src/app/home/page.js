"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Mail, User } from "lucide-react";
import { useMemo } from "react";
import IsUserBanned from "@/components/IsUserBanned";

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
    console.log("Filtering bookings:", bookings);
    return bookings.filter((booking) =>
      booking.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [bookings, searchQuery]);
  

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };


  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    const userToken = localStorage.getItem("userToken");

    if(!userToken) {
      return;
    }
    
    if (userToken) {
      fetch("http://localhost:5000/api/user", {
        headers: {
          Authorization: "Bearer " + userToken,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setAccounts(data);
        })
        .catch((error) => {
          console.log("Error fetching accounts:", error);
        });
    }
  }, []);



  console.log(accounts)

  const addBooking = async (event) => {
    event.preventDefault(); // Prevents page reload

    console.log("Form State:", form);

    if(accounts.length === 0) {
      setErrorMessage("Please login to make a booking request.");
      return;
    }

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

    console.log("Form State:", form);

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

    console.log("id", accounts.user.id);

    try {
      const res = await fetch("http://localhost:5000/api/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          position: form.position,
          batch: form.batch,
          booking_date: form.date,
          start_time: form.startTime,
          end_time: form.endTime,
          room: form.room,
          specificRequest: form.specificRequest,
          userId: accounts?.user?.id,
        })
        
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



  // const deleteBooking = (index) => {
  //   setBookings((prevBookings) => prevBookings.filter((_, i) => i !== index));
  // };

  const startEditing = (index) => {
    setEditingIndex(index);
  };

  // const handleTableChangeEditTab = (index, field, value) => {
  //   const updatedBookings = [...bookings];
  //   updatedBookings[index] = { ...updatedBookings[index], [field]: value };
  //   setBookings(updatedBookings);
  // };

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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };




  const [myRequests, setMyRequests] = useState([]);


  function getMyRequests() {
    if(accounts.length === 0) {
      setErrorMessage("Please login to view your booking requests.");
      return;
    }

    fetch(`http://localhost:5000/api/requests/${accounts?.user?.id}`)
      .then((res) => res.json())
      .then((data) => {
        setMyRequests(data);
        console.log("My Requests:", data);
      })
      .catch((error) => {
        console.error("Error fetching requests:", error);
      });
  }


  function deleteBooking(index) {
    const booking = myRequests[index];
    fetch(`http://localhost:5000/api/requests/${accounts?.user?.id}/${booking.id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Delete Response:", data);
        getMyRequests();
      })
      .catch((error) => {
        console.error("Error deleting request:", error);
      });
  }


  useEffect(() => {
    getMyRequests();
  }, [accounts]);




  const [editIndex, setEditIndex] = useState(null);


  const [editForm, setEditForm] = useState({
    specificRequest: "",
    name: "",
    position: "",
    year: "",
    batch: "",
    date: "",
    startTime: "",
    endTime: "",
    room: "",
  });

  const handleTableChangeEditTab = (field, value) => {
    console.log("Field:", field, "Value:", value);
    setEditForm((prevForm) => ({
      ...prevForm,
      [field]: value,
    }));
  };
  
  
  const handleEdit = (index) => {
    setEditIndex(index);
    setEditForm(myRequests[index]); // Load the selected row into editForm
  };
  


  function saveChangesForEdit() {
    fetch(`http://localhost:5000/api/requests/${accounts?.user?.id}/${myRequests[editIndex].id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({

        name: editForm.name,
        position: editForm.position,
        batch: editForm.batch,
        booking_date: editForm.date,
        start_time: editForm.startTime,
        end_time: editForm.endTime,
        room: editForm.room,
        specificRequest: editForm.specific

      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Edit Response:", data);
        setEditIndex(null);
        getMyRequests();
      })
      .catch((error) => {
        console.error("Error editing request:", error);
      });
  }




  return (
    <div className="min-h-screen p-6 font-poppins bg-gray-100">

     <IsUserBanned/>

      <header className="flex justify-between items-center bg-blue-800 text-white p-4 rounded-lg">
        <h1 className="text-lg font-bold">MDC Reservation for Facilities</h1>
        <div className="flex gap-2 ml-50">
          {accounts.user?.id && (
            <button 
              onClick={() => {
                localStorage.removeItem("userToken");
                router.push("/");
              }} 
              className="bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-gray-500"
            >
              Logout
            </button>
          )}
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
          <h2 className="text-lg font-bold mb-4 text-black">Book a Facility</h2>
          {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}
          {!accounts.user?.id && (
            <p className="text-red-500 text-sm mb-4">Please login to view your booking requests.</p>
          )}

          <div className="flex flex-col gap-4 p-4 rounded-lg">
            <input 
              type="text" 
              id="name" 
              placeholder="Your Name" 
              className="input border-2 border-gray-300 p-2 rounded-lg text-black placeholder-gray-500 focus:border-blue-500 focus:outline-none"
              onChange={handleChange} 
              value={form.name} 
            />

            <select 
              id="position" 
              className="input border-2 border-gray-300 p-2 rounded-lg text-black focus:border-blue-500 focus:outline-none"
              onChange={handleChange} 
              value={form.position}
            >
              <option value="" className="text-gray-500">Select Position</option>
              <option value="Student">Student</option>
              <option value="Faculty">Faculty</option>
              <option value="Staff">Staff</option>
              <option value="Administrator">Administrator</option>
            </select>

            <input 
              type="text" 
              id="batch" 
              placeholder="Year level" 
              className="input border-2 border-gray-300 p-2 rounded-lg text-black placeholder-gray-500 focus:border-blue-500 focus:outline-none"
              onChange={handleChange} 
              value={form.batch} 
            />

            <input 
              type="date" 
              id="date" 
              className="input border-2 border-gray-300 p-2 rounded-lg text-black focus:border-blue-500 focus:outline-none" 
              onChange={handleChange} 
              value={form.date}
            />

            <input 
              type="time" 
              id="startTime" 
              className="input border-2 border-gray-300 p-2 rounded-lg text-black focus:border-blue-500 focus:outline-none" 
              onChange={handleChange} 
              value={form.startTime || ""} 
            />

            <input 
              type="time" 
              id="endTime" 
              className="input border-2 border-gray-300 p-2 rounded-lg text-black focus:border-blue-500 focus:outline-none" 
              onChange={handleChange} 
              value={form.endTime || ""} 
            />

            <select 
              id="room" 
              className="input border-2 border-gray-300 p-2 rounded-lg text-black focus:border-blue-500 focus:outline-none"
              onChange={handleChange} 
              value={form.room}
            >
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
              className="input border-2 border-gray-300 p-2 rounded-lg text-black placeholder-gray-500 focus:border-blue-500 focus:outline-none"
              onChange={handleChange} 
              value={form.specificRequest} 
            />

            <button 
              onClick={addBooking} 
              className="bg-blue-800 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Booking Request
            </button>
          </div>
        </aside>

        <section className="bg-white p-6 shadow-md rounded-lg flex-1">
          <h2 className="text-xl font-bold mb-4 text-black">Reservations</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-blue-800 text-white">
                  <th className="border border-gray-300 p-3 text-left whitespace-nowrap">Name</th>
                  <th className="border border-gray-300 p-3 text-left whitespace-nowrap">Position</th>
                  <th className="border border-gray-300 p-3 text-left whitespace-nowrap">Year</th>
                  <th className="border border-gray-300 p-3 text-left whitespace-nowrap">Date</th>
                  <th className="border border-gray-300 p-3 text-left whitespace-nowrap">Time (Start - End)</th>
                  <th className="border border-gray-300 p-3 text-left whitespace-nowrap">Room</th>
                  <th className="border border-gray-300 p-3 text-left whitespace-nowrap">Specific Requests</th>
                  <th className="border border-gray-300 p-3 text-left whitespace-nowrap">Status</th>
                  <th className="border border-gray-300 p-3 text-left whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody>
                {myRequests.length > 0 ? (
                  myRequests.map((booking, index) => (
                    <tr key={index} className="border text-black border-gray-300 hover:bg-gray-50">
                      <td className="border border-gray-300 p-3 whitespace-nowrap overflow-hidden text-ellipsis">{index === editIndex ? (
                        <input type="text" value={editForm.name} onChange={(e) => handleTableChangeEditTab("name", e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" />
                      ) : booking.name}</td>
                      <td className="border border-gray-300 p-3 whitespace-nowrap">{index === editIndex ? (
                        <select value={editForm.position} onChange={(e) => handleTableChangeEditTab("position", e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500">
                          <option value="Student">Student</option>
                          <option value="Faculty">Faculty</option>
                          <option value="Staff">Staff</option>
                          <option value="Administrator">Administrator</option>
                        </select>
                      ) : booking.position}</td>
                      <td className="border border-gray-300 p-3 whitespace-nowrap">{index === editIndex ? (
                        <input type="text" value={editForm.batch} onChange={(e) => handleTableChangeEditTab("batch", e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" />
                      ) : booking.batch}</td>
                      <td className="border border-gray-300 p-3 whitespace-nowrap">{index === editIndex ? (
                        <input type="date" value={editForm.date} onChange={(e) => handleTableChangeEditTab("date", e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" />
                      ) : formatDate(booking.booking_date)}</td>
                      <td className="border border-gray-300 p-3 whitespace-nowrap">{index === editIndex ? (
                        <div className="flex gap-2">
                          <input type="time" value={editForm.startTime} onChange={(e) => handleTableChangeEditTab("startTime", e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" />
                          <input type="time" value={editForm.endTime} onChange={(e) => handleTableChangeEditTab("endTime", e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" />
                        </div>
                      ) : `${to12HourFormat(booking.start_time)} - ${to12HourFormat(booking.end_time)}`}</td>
                      <td className="border border-gray-300 p-3 whitespace-nowrap overflow-hidden text-ellipsis">{index === editIndex ? (
                        <select value={editForm.room} onChange={(e) => handleTableChangeEditTab("room", e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500">
                          <option>Conference Room</option>
                          <option>Gym</option>
                          <option>Gym Campus 2</option>
                          <option>Chapel</option>
                          <option>Speech Laboratory</option>
                        </select>
                      ) : booking.room}</td>
                      <td className="border border-gray-300 p-3 whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">{index === editIndex ? (
                        <input type="text" value={editForm.specificRequest} onChange={(e) => handleTableChangeEditTab("specificRequest", e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" />
                      ) : booking.specificRequest}</td>
                      <td className="border border-gray-300 p-3 whitespace-nowrap">
                        {booking.status === "approved" ? (
                          <span className="inline-block bg-green-500 text-white px-3 py-1 rounded-md font-medium">Approved</span>
                        ) : booking.status === "rejected" ? (
                          <div className="relative group">
                            <span className="inline-block bg-red-500 text-white px-3 py-1 rounded-md font-medium cursor-help">Rejected</span>
                            {booking.rejectionDesc && (
                              <div className="absolute hidden group-hover:block bg-gray-900 text-white p-2 rounded-md w-48 z-50 -translate-y-full left-0 top-0 text-sm">
                                {booking.rejectionDesc}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="inline-block bg-yellow-500 text-white px-3 py-1 rounded-md font-medium">Pending</span>
                        )}
                      </td>
                      <td className="border border-gray-300 p-3 whitespace-nowrap">
                        {booking.status !== "rejected" && (
                          <div className="flex gap-2">
                            {index !== editIndex && booking.status !== "approved" && (
                              <button onClick={() => handleEdit(index)}
                                className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition-colors">
                                Edit
                              </button>
                            )}
                            {index !== editIndex && (
                              <button onClick={() => deleteBooking(index)}
                                className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors">
                                Delete
                              </button>
                            )}
                            {index === editIndex && (
                              <>
                                <button onClick={() => setEditIndex(null)}
                                  className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors">
                                  Cancel
                                </button>
                                <button onClick={() => saveChangesForEdit()}
                                  className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition-colors">
                                  Save
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center p-4 text-gray-500">No bookings available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}