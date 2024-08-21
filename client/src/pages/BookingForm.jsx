import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";

function BookingForm() {
  const navigate = useNavigate();
  const [itineraries, setItineraries] = useState([]);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    fetch("https://travel-agency-d5rs.onrender.com/itineraries", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setItineraries(data))
      .catch((error) => console.error("Error fetching itineraries:", error));

    fetch("https://travel-agency-d5rs.onrender.com/activities", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setActivities(data))
      .catch((error) => console.error("Error fetching activities:", error));
  }, []);

  const formik = useFormik({
    initialValues: {
      activity_id: "",
      booking_details: "",
      itinerary_id: "",
    },
    validationSchema: Yup.object({
      activity_id: Yup.number().required("Activity is required"),
      booking_details: Yup.string().required("Booking details are required"),
      itinerary_id: Yup.number().required("Itinerary is required"),
    }),
    onSubmit: (values) => {
      const token = localStorage.getItem("access_token");

      fetch("https://travel-agency-d5rs.onrender.com/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      })
        .then((response) => {
          if (response.ok) {
            alert("Booking submitted successfully!");
            navigate("/bookings");
          } else {
            alert("Failed to submit booking.");
          }
        })
        .catch((error) => console.error("Error submitting booking:", error));
    },
  });

  return (
    <>
      <NavBar />
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <form
          onSubmit={formik.handleSubmit}
          className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">
            Add a New Booking
          </h2>

          <div className="mb-4">
            <label
              htmlFor="activity_id"
              className="block text-sm font-medium text-gray-700"
            >
              Activity
            </label>
            <select
              id="activity_id"
              {...formik.getFieldProps("activity_id")}
              className={`mt-1 block w-full p-2 border rounded-lg ${
                formik.touched.activity_id && formik.errors.activity_id
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            >
              <option value="" label="Select an activity" />
              {activities.map((activity) => (
                <option key={activity.id} value={activity.id}>
                  {activity.name}
                </option>
              ))}
            </select>
            {formik.touched.activity_id && formik.errors.activity_id ? (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.activity_id}
              </div>
            ) : null}
          </div>

          <div className="mb-4">
            <label
              htmlFor="booking_details"
              className="block text-sm font-medium text-gray-700"
            >
              Booking Details
            </label>
            <textarea
              id="booking_details"
              {...formik.getFieldProps("booking_details")}
              className={`mt-1 block w-full p-2 border rounded-lg ${
                formik.touched.booking_details && formik.errors.booking_details
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {formik.touched.booking_details && formik.errors.booking_details ? (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.booking_details}
              </div>
            ) : null}
          </div>

          <div className="mb-4">
            <label
              htmlFor="itinerary_id"
              className="block text-sm font-medium text-gray-700"
            >
              Itinerary
            </label>
            <select
              id="itinerary_id"
              {...formik.getFieldProps("itinerary_id")}
              className={`mt-1 block w-full p-2 border rounded-lg ${
                formik.touched.itinerary_id && formik.errors.itinerary_id
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            >
              <option value="" label="Select an itinerary" />
              {itineraries.map((itinerary) => (
                <option key={itinerary.id} value={itinerary.id}>
                  {itinerary.name}
                </option>
              ))}
            </select>
            {formik.touched.itinerary_id && formik.errors.itinerary_id ? (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.itinerary_id}
              </div>
            ) : null}
          </div>

          <button
            type="submit"
            className="bg-lime-900 text-white py-2 px-4 rounded-lg hover:bg-lime-700 transition duration-300 ease-in-out"
          >
            Submit
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
}

export default BookingForm;
