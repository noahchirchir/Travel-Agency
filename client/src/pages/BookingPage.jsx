import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

function BookingPage() {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      location: "Malindi, Malindi, Kenya",
      hotel: "Ocean Beach Resort & Spa",
      checkInDate: "",
      checkOutDate: "",
      guests: 1,
      specialRequests: "",
    },
    validationSchema: Yup.object({
      checkInDate: Yup.date().required("Check-in date is required"),
      checkOutDate: Yup.date()
        .min(
          Yup.ref("checkInDate"),
          "Check-out date must be after check-in date"
        )
        .required("Check-out date is required"),
      guests: Yup.number()
        .min(1, "At least one guest is required")
        .required("Number of guests is required"),
    }),
    onSubmit: (values) => {
      fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
        .then((response) => {
          if (response.ok) {
            alert("Booking submitted successfully!");
            navigate("/bookings"); // Navigate to the bookings list or any other page
          } else {
            alert("Failed to submit booking.");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <form
        onSubmit={formik.handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Booking Form</h2>

        <div className="mb-4">
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700"
          >
            Location
          </label>
          <input
            id="location"
            type="text"
            value={formik.values.location}
            readOnly
            className="mt-1 block w-full p-2 border rounded-lg bg-gray-100"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="hotel"
            className="block text-sm font-medium text-gray-700"
          >
            Hotel
          </label>
          <input
            id="hotel"
            type="text"
            value={formik.values.hotel}
            readOnly
            className="mt-1 block w-full p-2 border rounded-lg bg-gray-100"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="checkInDate"
            className="block text-sm font-medium text-gray-700"
          >
            Check-in Date
          </label>
          <input
            id="checkInDate"
            type="date"
            {...formik.getFieldProps("checkInDate")}
            className={`mt-1 block w-full p-2 border rounded-lg ${
              formik.touched.checkInDate && formik.errors.checkInDate
                ? "border-red-500"
                : "border-gray-300"
            }`}
          />
          {formik.touched.checkInDate && formik.errors.checkInDate ? (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.checkInDate}
            </div>
          ) : null}
        </div>

        <div className="mb-4">
          <label
            htmlFor="checkOutDate"
            className="block text-sm font-medium text-gray-700"
          >
            Check-out Date
          </label>
          <input
            id="checkOutDate"
            type="date"
            {...formik.getFieldProps("checkOutDate")}
            className={`mt-1 block w-full p-2 border rounded-lg ${
              formik.touched.checkOutDate && formik.errors.checkOutDate
                ? "border-red-500"
                : "border-gray-300"
            }`}
          />
          {formik.touched.checkOutDate && formik.errors.checkOutDate ? (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.checkOutDate}
            </div>
          ) : null}
        </div>

        <div className="mb-4">
          <label
            htmlFor="guests"
            className="block text-sm font-medium text-gray-700"
          >
            Number of Guests
          </label>
          <input
            id="guests"
            type="number"
            {...formik.getFieldProps("guests")}
            className={`mt-1 block w-full p-2 border rounded-lg ${
              formik.touched.guests && formik.errors.guests
                ? "border-red-500"
                : "border-gray-300"
            }`}
          />
          {formik.touched.guests && formik.errors.guests ? (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.guests}
            </div>
          ) : null}
        </div>

        <div className="mb-4">
          <label
            htmlFor="specialRequests"
            className="block text-sm font-medium text-gray-700"
          >
            Special Requests
          </label>
          <textarea
            id="specialRequests"
            {...formik.getFieldProps("specialRequests")}
            className="mt-1 block w-full p-2 border rounded-lg border-gray-300"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-400 transition duration-300 ease-in-out"
        >
          Submit Booking
        </button>
      </form>
    </div>
  );
}

export default BookingPage;
