import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";

function EditJournalPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [journal, setJournal] = useState({
    title: "",
    entry_date: "",
    content: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJournal = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5555/journals/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch journal entry");
        }
        const data = await response.json();
        setJournal(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJournal();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJournal({
      ...journal,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`http://127.0.0.1:5555/journals/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(journal),
    })
      .then(() => {
        navigate(`/journals/${id}`);
      })
      .catch((error) => {
        setError(error.message);
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
            <label htmlFor="title" className="block text-gray-700">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={journal.title}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label htmlFor="entry_date" className="block text-gray-700">
              Entry Date
            </label>
            <input
              type="date"
              id="entry_date"
              name="entry_date"
              value={journal.entry_date.split("T")[0]} // Format the date value
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label htmlFor="content" className="block text-gray-700">
              Content
            </label>
            <textarea
              id="content"
              name="content"
              value={journal.content}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows="6"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-400 transition"
          >
            Save Changes
          </button>
        </form>
      </div>
    </>
  );
}

export default EditJournalPage;
