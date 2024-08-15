import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import { Link } from "react-router-dom";

const Community = () => {
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  const mockCards = [
    {
      title: "Community Journal 1",
      subtitle: "August 15, 2024",
      image: "/static/images/cards/paella.jpg",
      description:
        "This is a brief description or summary of the journal entry.",
      comments: [
        {
          id: 1,
          content:
            "This is a fantastic journal entry! Loved the insights shared.",
          user: "John Doe",
          date: "August 15, 2024",
        },
        {
          id: 2,
          content: "Very informative and well-written. Thank you for sharing!",
          user: "Jane Smith",
          date: "August 14, 2024",
        },
        {
          id: 3,
          content: "I found this journal entry very inspiring. Great job!",
          user: "Alice Johnson",
          date: "August 13, 2024",
        },
      ],
    },
    // Add more mock cards if needed
  ];

  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <NavBar />
      <div className="h-full p-8 bg-gray-100">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-3xl font-bold">Community Journals</h1>
          <Link to="/add-share-journal">
            <button className="bg-lime-900 text-white py-1 px-3 rounded-full hover:bg-lime-800 transition-colors duration-300 ease-in-out text-lg">
              Share Journal Entry
            </button>
          </Link>
        </div>
        <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockCards.map((card, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg shadow-lg p-4"
            >
              <img
                src={card.image}
                alt={card.title}
                className="w-full h-40 object-cover rounded-t-lg"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold">{card.title}</h2>
                <p className="text-gray-500 mb-2">{card.subtitle}</p>
                <p className="text-gray-700 mb-4">{card.description}</p>
                <div>
                  {card.comments.length === 0 ? (
                    <p>No comments available.</p>
                  ) : (
                    <ul className="list-none pl-5 text-gray-600">
                      {card.comments.map((comment) => (
                        <li key={comment.id} className="mb-2">
                          <p className="font-semibold">{comment.user}</p>
                          <p>{comment.content}</p>
                          <p className="text-gray-400">{comment.date}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Community;
