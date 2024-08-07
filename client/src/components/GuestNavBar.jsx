import { Link, Outlet } from "react-router-dom";

function GuestNavBar() {
  return (
    <>
      <nav className="bg-lime-900 flex justify-between">
        <img src="" className="h-12 ml-4 mt-2" alt="" />
        <ul className="flex py-5 space-x-10 justify-end mr-11">
          <Link to="/login" className="cursor-pointer text-white font-bold ">
            Login
          </Link>
          <Link to="/register" className="cursor-pointer text-white font-bold ">
            Register
          </Link>
        </ul>
      </nav>
      <Outlet />
    </>
  );
}

export default GuestNavBar;
