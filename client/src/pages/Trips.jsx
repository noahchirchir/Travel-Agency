import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

function Trips() {
  const [itineraries, setItineraries] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    fetch("https://travel-agency-d5rs.onrender.com/itineraries", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch itineraries");
        }
        return response.json();
      })
      .then((data) => {
        setItineraries(data);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, []);

  return (
    <>
      <NavBar />
      <div className="h-full mb-20">
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6 pl-14">My Trips</h1>
        {error && <p className="text-red-500">{error}</p>}
        {itineraries.length === 0 ? (
          <p>No trips found.</p>
        ) : (
          <div className="grid grid-cols-3 gap-4 mt-10 px-10">
            {itineraries.map((itinerary) => (
              <div
                key={itinerary.id}
                className="border border-gray-300 rounded-lg p-4 shadow-md"
              >
                <h2 className="text-xl font-semibold mb-2">{itinerary.name}</h2>
                <p className="text-gray-700 mb-4">{itinerary.description}</p>
                <Link to={`/itineraries/${itinerary.id}`}>
                  <button className="bg-lime-900 text-white py-2 px-4 rounded mt-2 hover:bg-lime-800 transition">
                    View Details
                  </button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
      </div>
      <Footer />
    </>
  );
}

export default Trips;
