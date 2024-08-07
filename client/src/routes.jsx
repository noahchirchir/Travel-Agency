import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Booking from "./pages/Booking";
import Journal from "./pages/Journal";
import Itinerary from "./pages/Itinerary";
import GuestHomePage from "./pages/GuestHomePage";
import Trips from "./pages/Trips";
import Community from "./pages/Community"
import JournalPage from "./pages/JournalPage";
import BookingPage from "./pages/BookingPage";
import JournalForm from "./pages/JournalForm";
import ItineraryForm from "./pages/ItineraryForm";
import BookingForm from "./pages/BookingForm";
import ErrorPage from "./pages/ErrorPage";
import ItineraryPage from "./pages/ItineraryPage";


const routes = [
  {
    path: "/",
    element: <GuestHomePage />,
    errorElement: <ErrorPage />
  },
  {
    path: "/home",
    element: <HomePage />,
    errorElement: <ErrorPage />
  },
  {
    path: "/login",
    element: <Login />,
    errorElement: <ErrorPage />
  },
  {
    path: "/register",
    element: <Register />,
    errorElement: <ErrorPage />
  },
  {
    path: "/bookings",
    element: <Booking />,
    errorElement: <ErrorPage />
  },
  {
    path: "/journal",
    element: <Journal />,
    errorElement: <ErrorPage />
  },
  {
    path: "itinerary",
    element: <Itinerary />,
    errorElement: <ErrorPage />
  },
  {
    path: "/trips",
    element: <Trips />,
    errorElement: <ErrorPage />
  },
  {
    path: "/community",
    element: <Community />,
    errorElement: <ErrorPage />
  },
  {
    path: "/journal/:id",
    element: <JournalPage />,
    errorElement: <ErrorPage />
  },
  {
    path: "/bookings/:id",
    element: <BookingPage />,
    errorElement: <ErrorPage />
  },
  {
    path: "/journal-form",
    element: <JournalForm />,
    errorElement: <ErrorPage />
  },
  {
    path: "/add-itinerary",
    element: <ItineraryForm />,
    errorElement: <ErrorPage />
  },
  {
    path: "/add-booking",
    element: <BookingForm />,
    errorElement: <ErrorPage />
  },
  {
    path: "/itineraries:id",
    element: <ItineraryPage />,
    errorElement: <ErrorPage />
  }
];
export default routes;