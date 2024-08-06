import { useParams, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import { useEffect, useState } from "react";

function JournalPage() {
  const { id } = useParams();
  const [journal, setJournal] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://127.0.0.1:5555/journals/${id}`)
      .then((response) => response.json())
      .then((data) => setJournal(data));
  }, [id]);

  const handleEdit = () => {
    // Redirect to the edit page
    navigate(`/journals/edit/${id}`);
  };

  const handleDelete = () => {
    fetch(`http://127.0.0.1:5555/journals/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        // Redirect to the list page
        navigate("/journals");
      })
      .catch((error) => {
        console.error("Error deleting journal:", error);
      });
  };

  if (!journal) {
    return <p>Journal entry not found.</p>;
  }

  return (
    <>
      <NavBar />
      <div className="p-8 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">{journal.title}</h1>
        <h3 className="text-xl text-gray-600 mb-4">{journal.date}</h3>
        <p className="text-lg mb-6">{journal.content}</p>
        <div className="flex space-x-4">
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-400 transition"
            onClick={handleEdit}
          >
            Edit
          </button>
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
