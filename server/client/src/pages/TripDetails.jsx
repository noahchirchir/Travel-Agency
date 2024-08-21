import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

function TripDetails() {
  const { id } = useParams();
  const [itinerary, setItinerary] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    fetch(`http://127.0.0.1:5555/itineraries/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch itinerary details");
        }
        return response.json();
      })
      .then((data) => {
        setItinerary(data);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, [id]);

  return (
    <>
      <NavBar />
      <div className="p-8 h-screen text-center mt-16">
        {error && <p className="text-red-500">{error}</p>}
        {itinerary ? (
          <div>
            <h1 className="text-3xl font-bold mb-6">{itinerary.name}</h1>
            <p className="mb-4">{itinerary.description}</p>
            <p className="font-semibold">
              Start Date: {new Date(itinerary.start_date).toLocaleDateString()}
            </p>
            <p className="font-semibold">
              End Date: {new Date(itinerary.end_date).toLocaleDateString()}
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-4">Activities:</h2>
            {itinerary.activities.length === 0 ? (
              <p>No activities planned for this trip.</p>
            ) : (
              <ul>
                {itinerary.activities.map((activity) => (
                  <li key={activity.id} className="mb-4">
                    <h3 className="text-lg font-semibold">{activity.name}</h3>
                    <p>{activity.description}</p>
                    <p className="font-semibold">
                      Date & Time:{" "}
                      {new Date(activity.datetime).toLocaleString()}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <Footer />
    </>
  );
}

export default TripDetails;
