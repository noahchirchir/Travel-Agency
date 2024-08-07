import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

function Booking() {
  const [searchQuery, setSearchQuery] = useState("");
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    fetch("http://127.0.0.1:5555/bookings", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setBookings(data))
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredBookings = bookings.filter(
    (booking) =>
      booking.booking_details &&
      booking.booking_details.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <NavBar />
      <div className="h-screen">
        <div>
          <h1 className="text-center text-4xl text-lime-900 mt-12">Bookings</h1>
        </div>
        <div className="flex items-center justify-center mt-10">
          <Link to="/add-booking">
            <button className="bg-lime-900 text-white py-2 px-5 rounded-full hover:bg-lime-800 transition duration-300 ease-in-out text-lg ml-4">
              Add booking
            </button>
          </Link>
          <input
            type="search"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearch}
            className="ml-4 py-2 px-4 rounded-full border border-lime-900 focus:outline-none focus:ring-2 focus:ring-lime-800"
          />
        </div>
        <div className="grid grid-cols-3 gap-4 mt-10 px-10">
          {filteredBookings.map((booking) => (
            <div key={booking.id} className="border p-4 rounded-lg shadow-lg">
              <p className="text-xl font-bold">{booking.booking_details}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Booking;
