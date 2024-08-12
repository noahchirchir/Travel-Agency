import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import { Link } from "react-router-dom";

const Community = () => {
  const [sharedJournals, setSharedJournals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSharedJournals = () => {
      fetch("http://127.0.0.1:5555/journals/shared", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch shared journals");
          }
          return response.json();
        })
        .then((data) => {
          setSharedJournals(data);
        })
        .catch((error) => {
          console.error("Error fetching shared journals:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    };

    fetchSharedJournals();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <NavBar />
      <div className="h-screen">
        <div className="flex justify-between items-center px-8 py-4 mx-20 mt-16 mb-5">
          <h1 className="text-3xl font-bold">Community Journals</h1>
          <Link to="/add-share-journal">
          <button className="bg-lime-900 text-white py-1 px-3 rounded-full hover:bg-lime-800 transition-colors duration-300 ease-in-out text-lg">
            Share Journal Entry
          </button>
          </Link>
        </div>
        <div className="container mx-auto px-4">
          {sharedJournals.length === 0 ? (
            <p>No shared journals found.</p>
          ) : (
            <ul className="space-y-4">
              {sharedJournals.map((journal) => (
                <li key={journal.id} className="border p-4 rounded">
                  <h2 className="text-xl font-semibold">{journal.title}</h2>
                  <p className="mt-2">{journal.content}</p>
                  <p className="mt-2 text-gray-500">
                    Shared by: {journal.user}
                  </p>
                  <p className="mt-2 text-gray-400">
                    {new Date(journal.entry_date).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Community;
