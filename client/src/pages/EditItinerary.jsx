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
    activities: [],
  });
  const [newActivity, setNewActivity] = useState({
    name: "",
    description: "",
    date: "",
    time: "",
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    fetch(`https://travel-agency-d5rs.onrender.com/itineraries/${id}`, {
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

  const handleNewActivityChange = (e) => {
    const { name, value } = e.target;
    setNewActivity({
      ...newActivity,
      [name]: value,
    });
  };

  const handleAddActivity = () => {
    const token = localStorage.getItem("access_token");

    fetch(`https://travel-agency-d5rs.onrender.com/itineraries/${id}/activities`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newActivity),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Activity added to itinerary successfully") {

          setNewActivity({
            name: "",
            description: "",
            date: "",
            time: "",
          });
          return fetch(`https://travel-agency-d5rs.onrender.com/itineraries/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        } else {
          throw new Error(data.message);
        }
      })
      .then((response) => response.json())
      .then((data) => {
        setItinerary(data)
        navigate('/itinerary')
      })
      .catch((error) => {
        console.error("Error adding activity:", error);
        setError(error.message);
      });
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");

    fetch(`https://travel-agency-d5rs.onrender.com/itineraries/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(itinerary),
    })
      .then(() => {
        navigate("/itinerary");
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
                <div>
                  <h3 className="text-lg font-semibold">{activity.name}</h3>
                  <p>{activity.description}</p>
                  <p>{new Date(activity.datetime).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Add New Activity</h2>
            <div>
              <label
                htmlFor="new-activity-name"
                className="block text-gray-700"
              >
                Activity Name
              </label>
              <input
                type="text"
                id="new-activity-name"
                name="name"
                value={newActivity.name}
                onChange={handleNewActivityChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label
                htmlFor="new-activity-description"
                className="block text-gray-700"
              >
                Description
              </label>
              <textarea
                id="new-activity-description"
                name="description"
                value={newActivity.description}
                onChange={handleNewActivityChange}
                className="w-full p-2 border rounded"
                rows="3"
                required
              />
            </div>
            <div>
              <label
                htmlFor="new-activity-date"
                className="block text-gray-700"
              >
                Date
              </label>
              <input
                type="date"
                id="new-activity-date"
                name="date"
                value={newActivity.date}
                onChange={handleNewActivityChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label
                htmlFor="new-activity-time"
                className="block text-gray-700"
              >
                Time
              </label>
              <input
                type="time"
                id="new-activity-time"
                name="time"
                value={newActivity.time}
                onChange={handleNewActivityChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
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
