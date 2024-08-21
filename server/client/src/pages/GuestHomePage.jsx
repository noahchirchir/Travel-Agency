import { useEffect, useState } from "react";
import "./HomePage.css";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import GuestNavBar from "../components/GuestNavBar";

const images = [
  "https://images.unsplash.com/photo-1712998000675-3f534ecbc836?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2NlbmFyaWVzfGVufDB8fDB8fHww",
  "https://images.unsplash.com/photo-1672713617866-2d62ace408ec?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8c2NlbmFyaWVzfGVufDB8fDB8fHww",
  "https://images.unsplash.com/photo-1674884070779-494e64e5c140?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHNjZW5hcmllc3xlbnwwfHwwfHx8MA%3D%3D",
  "https://images.unsplash.com/photo-1548115184-bc6544d06a58?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2NlbmFyaWVzJTIwa29yZWF8ZW58MHx8MHx8fDA%3D",
  "https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c2NlbmFyaWVzJTIwa29yZWF8ZW58MHx8MHx8fDA%3D",
];

function GuestHomePage() {
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setImageIndex((prevImage) => (prevImage + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <GuestNavBar />
      <div
        className="hero"
        style={{ backgroundImage: `url(${images[imageIndex]})` }}
      >
        <div className="hero-text">
          <h1 className="font-extrabold">Welcome to our Travel Planner</h1>
          <p className="font-extrabold">Plan your perfect trip with us</p>
        </div>
      </div>
      <div className="about bg-lime-900 py-36 px-11 text-white">
        <h1 className="font-extrabold text-center text-4xl">
          What can our app do?
        </h1>
        <div className="flex justify-between">
          <div className="mt-24 w-1/3">
            <div className="flex justify-center items-center">
              <ion-icon name="airplane-outline"></ion-icon>
            </div>
            <p className="text-lg text-center mt-10">
              You can book flights and hotels easily without struggle
            </p>
          </div>
          <div className="mt-24 w-1/3">
            <div className="flex justify-center items-center">
              <ion-icon name="journal-outline"></ion-icon>
            </div>
            <p className="text-lg text-center mt-10">
              You can create itineraries for your trips
            </p>
          </div>
          <div className="mt-24 w-1/3">
            <div className="flex justify-center items-center">
              <ion-icon name="create-outline"></ion-icon>
            </div>
            <p className="text-lg text-center mt-10">
              You can create entries in your own personal journal
            </p>
          </div>
        </div>
      </div>
      <div className="start bg-slate-300 py-36">
        <h1 className="text-lime-900 text-center text-4xl">
          Ready to get started?
        </h1>
        <div className="flex justify-center items-center">
            <Link to="/login">
          <button
            className="bg-lime-900 text-white py-2 px-5 rounded-full
        hover:bg-lime-800 transition duration-300 ease-in-out mt-10 text-lg"
          >
            Login
          </button>
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default GuestHomePage;
