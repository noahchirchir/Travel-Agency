import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import { Link } from "react-router-dom";

const Community = () => {
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState({});
  const [userNames, setUserNames] = useState({}); // Map to store user names by user ID

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    // Fetch comments
    fetch("http://127.0.0.1:5555/comments", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setComments(data);
      })
      .catch((error) => {
        console.error("Error fetching comments:", error);
      });

    // Fetch likes
    fetch("http://127.0.0.1:5555/likes", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const likesMap = data.reduce((acc, like) => {
          acc[like.comment_id] = (acc[like.comment_id] || 0) + 1;
          return acc;
        }, {});
        setLikes(likesMap);
      })
      .catch((error) => {
        console.error("Error fetching likes:", error);
      });

    // Fetch user names
    fetch("http://127.0.0.1:5555/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const userNamesMap = data.reduce((acc, user) => {
          acc[user.id] = user.name; // Assuming user object has 'id' and 'name' properties
          return acc;
        }, {});
        setUserNames(userNamesMap);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <NavBar />
      <div className="h-full p-8 bg-gray-100">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-3xl font-bold">Community Trips</h1>
          <Link to="/add-share-journal">
            <button className="bg-lime-900 text-white py-1 px-3 rounded-full hover:bg-lime-800 transition-colors duration-300 ease-in-out text-lg">
              Share Experience
            </button>
          </Link>
        </div>
        <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Display each comment */}
          {comments.length === 0 ? (
            <div>No comments available.</div>
          ) : (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-white border border-gray-200 rounded-lg shadow-lg p-4"
              >
                <div className="p-4">

                  <h2 className="text-xl font-semibold">
                    Community Journal {comment.id}
                  </h2>
                  <p className="text-gray-500 mb-2">
                    {new Date(comment.created_at).toDateString()}
                  </p>
                  <p className="text-gray-700 mb-4">{comment.content}</p>
                  <p className="text-gray-400">
                    User: {userNames[comment.user_id] || "Anonymous"}
                  </p>
                  <p className="text-gray-500 mt-2">
                    Likes: {likes[comment.id] || 0}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Community;
