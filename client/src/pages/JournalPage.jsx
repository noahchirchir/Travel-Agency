import { useParams, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function JournalPage() {
  const { id } = useParams();
  const [journal, setJournal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
        setJournal(data);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleEdit = () => {
    navigate(`/journals/edit/${id}`);
  };

  const handleDelete = () => {
    const token = localStorage.getItem("access_token");

    fetch(`https://travel-agency-d5rs.onrender.com/journals/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete journal entry");
        }
        navigate("/journals");
      })
      .catch((error) => {
        console.error("Error deleting journal:", error);
      });
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  if (!journal) {
    return <p>Journal entry not found.</p>;
  }

  return (
    <>
      <NavBar />
      <div className="p-8 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">{journal.title}</h1>
        <h3 className="text-xl text-gray-600 mb-4">{journal.entry_date}</h3>
        <p className="text-lg mb-6">{journal.content}</p>
        <div className="flex space-x-4">
          <Link to={`/journals/edit/${id}`}>
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-400 transition"
              onClick={handleEdit}
            >
              Edit
            </button>
          </Link>
          <button
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-400 transition"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </>
  );
}

export default JournalPage;
