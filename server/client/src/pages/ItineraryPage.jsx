import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function ItineraryPage() {
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
          throw new Error("Failed to fetch itinerary");
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
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Itinerary Details</h1>
      {error && <p className="text-red-500">{error}</p>}
      {!itinerary ? (
        <p>Loading...</p>
      ) : (
        <div>
          <h2 className="text-2xl font-semibold">{itinerary.name}</h2>
          <p>{itinerary.description}</p>
          <h3 className="text-xl font-semibold mt-6">Activities</h3>
          <ul>
            {itinerary.activities.map((activity) => (
              <li key={activity.id} className="mb-2">
                <p>{activity.name}</p>
                <p>{activity.description}</p>
                <p>{activity.datetime}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ItineraryPage;
