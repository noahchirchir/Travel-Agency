import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import NavBar from "../components/NavBar";

function EditJournalPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [journal, setJournal] = useState({
    title: "",
    content: "",
    entry_date: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    fetch(`https://travel-agency-d5rs.onrender.com/journals/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch journal entry");
        }
        return response.json();
      })
      .then((data) => {
        setJournal({
          title: data.title,
          content: data.content,
          entry_date: data.entry_date,
        });
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJournal((prevJournal) => ({
      ...prevJournal,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");

    fetch(`https://travel-agency-d5rs.onrender.com/journals/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(journal),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update journal entry");
        }
        navigate(`/journals/${id}`);
      })
      .catch((error) => {
        console.error("Error updating journal:", error);
      });
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  return (
    <>
      <NavBar />
      <div className="p-8 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Edit Journal Entry</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-lg font-semibold mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={journal.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div>
            <label
              htmlFor="entry_date"
              className="block text-lg font-semibold mb-2"
            >
              Date
            </label>
            <input
              type="date"
              id="entry_date"
              name="entry_date"
              value={journal.entry_date.split("T")[0]} // Format the date input
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div>
            <label
              htmlFor="content"
              className="block text-lg font-semibold mb-2"
            >
              Content
            </label>
            <textarea
              id="content"
              name="content"
              value={journal.content}
              onChange={handleChange}
              rows="6"
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-400 transition"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => navigate(`/journal/${id}`)}
              className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default EditJournalPage;
