import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";

function Trips() {
  const [itineraries, setItineraries] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    fetch("http://127.0.0.1:5555/itineraries", {
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

  const handleViewDetails = (id) => {
    navigate(`/itineraries/${id}`);
  };

  return (
    <>
      <NavBar />
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">My Trips</h1>
        {error && <p className="text-red-500">{error}</p>}
        {itineraries.length === 0 ? (
          <p>No trips found.</p>
        ) : (
          <ul>
            {itineraries.map((itinerary) => (
              <li key={itinerary.id} className="mb-4">
                <h2 className="text-xl font-semibold">{itinerary.name}</h2>
                <p>{itinerary.description}</p>
                <button
                  onClick={() => handleViewDetails(itinerary.id)}
                  className="bg-blue-500 text-white py-2 px-4 rounded mt-2"
                >
                  View Details
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

export default Trips;
