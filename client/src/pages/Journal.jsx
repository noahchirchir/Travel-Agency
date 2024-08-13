import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

function Journal() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    fetch("http://127.0.0.1:5555/journals", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch journals");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data); // Log data for debugging
        setEntries(data);
      })
      .catch((error) => console.error("Error fetching journals:", error));
  }, []);

  return (
    <>
      <NavBar />
      <div className="h-screen">
        <h1 className="text-center text-4xl mt-12">Journal</h1>
        <div className="flex justify-between px-72 space-x-10 mt-12">
          <h2 className="text-2xl">My entries</h2>
          <Link to="/journal-form">
            <button className="bg-lime-900 text-white py-2 px-5 rounded-full hover:bg-lime-800 transition duration-300 ease-in-out text-lg ml-4">
              Add new entry
            </button>
          </Link>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-8 pb-20 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 px-24">
          {entries.map((journal) => (
            <div
              key={journal.id}
              className="bg-white shadow-lg rounded-lg p-4 mt-12"
            >
              <h2 className="text-2xl">{journal.date}</h2>
              <h3 className="text-xl font-semibold">{journal.title}</h3>
              <Link to={`/journals/${journal.id}`}>
                <button className="bg-lime-900 text-white py-1 px-2 rounded-md hover:bg-lime-800 transition duration-300 ease-in-out text-lg mt-5">
                  View
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Journal;
