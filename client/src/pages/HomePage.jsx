import "./HomePage.css";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <main className="">
      <NavBar />
      <div className="user m-10 h-96 py-20 px-11 bg-white">
        <div className="flex justify-center items-center mb-10">
          <img
            src="https://i.pinimg.com/564x/68/28/bf/6828bfd781a29146f67726f116fcac91.jpg"
            alt="travel-guy"
            className="w-48 h-48"
          />
        </div>

        <h1 className="text-center text-black text-3xl">
          🎉 Welcome to your best trip planning experience! 🎉
        </h1>
        <h2 className="text-center text-black text-2xl italic ">
          What would you like to do today?
        </h2>
        <div className="flex justify-evenly">
          <Link to="/trips">
            <button
              className="bg-lime-900 text-white py-2 px-5 rounded-full
        hover:bg-lime-800 dark:hover:bg-lime-700 transition duration-300 ease-in-out mt-10 text-lg"
            >
              My Trips
            </button>
          </Link>
          <Link to="/itinerary">
            <button
              className="bg-lime-900 text-white py-2 px-5 rounded-full
        hover:bg-lime-800 dark:hover:bg-lime-700 transition duration-300 ease-in-out mt-10 text-lg"
            >
              Check my itinerary
            </button>
          </Link>
          <Link to="/journal">
            <button
              className="bg-lime-900 text-white py-2 px-5 rounded-full
        hover:bg-lime-800 dark:hover:bg-lime-700 transition duration-300 ease-in-out mt-10 text-lg"
            >
              Journal Entry
            </button>
          </Link>
        </div>
      </div>
      <Footer />
    </main>
  );
}

export default HomePage;
