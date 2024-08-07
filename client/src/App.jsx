import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Booking from "./pages/Booking";
import Journal from "./pages/Journal";
import Itinerary from "./pages/Itinerary";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={HomePage} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/bookings" component={Booking} />
        <Route path="/journal" component={Journal} />
        <Route path="/itinerary" component={Itinerary} />
      </Switch>
    </Router>
  );
}

export default App;
