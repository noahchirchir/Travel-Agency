import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

function Itinerary() {
  const [itineraries, setItineraries] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    fetch("http://127.0.0.1:5555/itineraries", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setItineraries(data))
      .catch((error) => setError(error.message));
  }, []);

  const handleCheckboxChange = (id) => {
    setItineraries(
      itineraries.map((itinerary) =>
        itinerary.id === id
          ? { ...itinerary, done: !itinerary.done }
          : itinerary
      )
    );
  };

  const handleDelete = (id) => {
    const token = localStorage.getItem("access_token");

    fetch(`http://127.0.0.1:5555/itineraries/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(() => {
        setItineraries(itineraries.filter((itinerary) => itinerary.id !== id));
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <>
      <NavBar />
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex justify-between mb-5">
          <h1 className="text-2xl font-bold mb-4">Itineraries</h1>
          <Link to="/add-itinerary">
            <button className="bg-lime-900 text-white py-2 px-5 rounded-full hover:bg-lime-800 transition duration-300 ease-in-out text-lg ml-4">
              New Itinerary
            </button>
          </Link>
        </div>
        <ul className="space-y-4">
          {itineraries.map((itinerary) => (
            <li
              key={itinerary.id}
              className="flex items-center p-4 border rounded-lg shadow-md"
            >
              <input
                type="checkbox"
                checked={itinerary.done || false}
                onChange={() => handleCheckboxChange(itinerary.id)}
                className="mr-4"
              />
              <div className="flex-grow">
                <h2 className="text-xl font-semibold">{itinerary.name}</h2>
                <p className="text-gray-600">{itinerary.description}</p>
                <p className="text-gray-400">
                  Start Date:{" "}
                  {new Date(itinerary.start_date).toLocaleDateString()}
                </p>
                <p className="text-gray-400">
                  End Date: {new Date(itinerary.end_date).toLocaleDateString()}
                </p>
                <div className="mt-2">
                  {itinerary.activities && itinerary.activities.length > 0 && (
                    <div>
                      <h3 className="font-semibold">Activities:</h3>
                      <ul className="list-disc list-outside pl-4">
                        {itinerary.activities.map((activity) => (
                          <li key={activity.id}>
                            <p className="font-medium">{activity.name}</p>
                            <p className="text-gray-600">
                              {activity.description}
                            </p>
                            <p className="text-gray-400">
                              Date:{" "}
                              {new Date(activity.datetime).toLocaleDateString()}
                            </p>
                            <p className="text-gray-400">
                              Time:{" "}
                              {new Date(activity.datetime).toLocaleTimeString()}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              <div className="ml-4 flex space-x-2">
                <Link to={`/edit-itinerary/${itinerary.id}`}>
                  <button className="bg-lime-900 text-white py-2 px-4 rounded hover:bg-lime-700 transition duration-300 ease-in-out">
                    Edit
                  </button>
                </Link>
                <button
                  className="bg-red-500 text-white py-1 px-4 rounded hover:bg-red-400 transition"
                  onClick={() => handleDelete(itinerary.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <Footer />
    </>
  );
}

export default Itinerary;
