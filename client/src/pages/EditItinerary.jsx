import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

function EditItinerary() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [itinerary, setItinerary] = useState({
    name: "",
    description: "",
    start_date: "",
    end_date: "",
    activities: [], // Added activities to state
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    fetch(`http://127.0.0.1:5555/itineraries/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setItinerary(data))
      .catch((error) => setError(error.message));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItinerary({
      ...itinerary,
      [name]: value,
    });
  };

  const handleActivityChange = (index, e) => {
    const { name, value } = e.target;
    const updatedActivities = itinerary.activities.map((activity, i) =>
      i === index ? { ...activity, [name]: value } : activity
    );
    setItinerary({
      ...itinerary,
      activities: updatedActivities,
    });
  };

  const handleAddActivity = () => {
    setItinerary({
      ...itinerary,
      activities: [
        ...itinerary.activities,
        { name: "", description: "", datetime: "" },
      ],
    });
  };

  const handleRemoveActivity = (index) => {
    setItinerary({
      ...itinerary,
      activities: itinerary.activities.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");

    fetch(`http://127.0.0.1:5555/itineraries/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(itinerary),
    })
      .then(() => {
        navigate("/itineraries");
      })
      .catch((error) => setError(error.message));
  };

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <>
      <NavBar />
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Edit Itinerary</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={itinerary.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={itinerary.description}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows="4"
              required
            />
          </div>
          <div>
            <label htmlFor="start_date" className="block text-gray-700">
              Start Date
            </label>
            <input
              type="date"
              id="start_date"
              name="start_date"
              value={itinerary.start_date.split("T")[0]} // Format the date value
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label htmlFor="end_date" className="block text-gray-700">
              End Date
            </label>
            <input
              type="date"
              id="end_date"
              name="end_date"
              value={itinerary.end_date.split("T")[0]} // Format the date value
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Activities</h2>
            {itinerary.activities.map((activity, index) => (
              <div key={index} className="border p-4 rounded mb-4">
                <button
                  type="button"
                  className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-400 transition mb-2"
                  onClick={() => handleRemoveActivity(index)}
                >
                  Remove Activity
                </button>
                <div>
                  <label
                    htmlFor={`activity-name-${index}`}
                    className="block text-gray-700"
                  >
                    Activity Name
                  </label>
                  <input
                    type="text"
                    id={`activity-name-${index}`}
                    name="name"
                    value={activity.name}
                    onChange={(e) => handleActivityChange(index, e)}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor={`activity-description-${index}`}
                    className="block text-gray-700"
                  >
                    Description
                  </label>
                  <textarea
                    id={`activity-description-${index}`}
                    name="description"
                    value={activity.description}
                    onChange={(e) => handleActivityChange(index, e)}
                    className="w-full p-2 border rounded"
                    rows="3"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor={`activity-datetime-${index}`}
                    className="block text-gray-700"
                  >
                    Date and Time
                  </label>
                  <input
                    type="datetime-local"
                    id={`activity-datetime-${index}`}
                    name="datetime"
                    value={activity.datetime}
                    onChange={(e) => handleActivityChange(index, e)}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddActivity}
              className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-400 transition"
            >
              Add Activity
            </button>
          </div>
          <button
            type="submit"
            className="bg-lime-900 text-white py-2 px-4 rounded hover:bg-lime-700 transition duration-300 ease-in-out"
          >
            Save Changes
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
}

export default EditItinerary;
