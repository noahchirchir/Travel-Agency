import { Link, Outlet } from "react-router-dom";
import Logo from "../assets/travel-planner-high-resolution-logo-black-transparent (1).svg"

function NavBar() {
  return (
    <>
      <nav className="flex justify-between border-b">
        <div className="flex py-5 space-x-10 justify-end mr-11 h-12">
          <Link to="/home">
          <img
            src={Logo}
            className="h-12 ml-4 -mt-4 cursor-pointer"
            alt="Travel Planner Logo"
          />
          </Link>
          <Link to="/community" className="cursor-pointer text-gray-500 font-semibold">
            Community Trips
          </Link>
        </div>
        <ul className="flex py-5 space-x-10 justify-end mr-11">
          <Link to="/home" className="cursor-pointer">
            Home
          </Link>
          <Link to="/trips" className="cursor-pointer">
            My Trips
          </Link>
          <Link to="/bookings" className="cursor-pointer">
            Bookings
          </Link>
          <Link to="/itinerary" className="cursor-pointer">
            Itinerary
          </Link>
          <Link to="/journal" className="cursor-pointer">
            Journal
          </Link>
          <Link to="/" className="cursor-pointer">
            Logout
          </Link>
        </ul>
      </nav>
      <Outlet />
    </>
  );
}

export default NavBar;
