import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";

const ItineraryForm = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      start_date: "",
      end_date: "",
      activities: [{ name: "", description: "", date: "", time: "" }],
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      description: Yup.string().required("Description is required"),
      start_date: Yup.date().required("Start date is required").nullable(),
      end_date: Yup.date().required("End date is required").nullable(),
      activities: Yup.array().of(
        Yup.object({
          name: Yup.string().required("Activity name is required"),
          description: Yup.string().required(
            "Activity description is required"
          ),
          date: Yup.date().required("Activity date is required").nullable(),
          time: Yup.string().required("Activity time is required"),
        })
      ),
    }),
    onSubmit: (values) => {
      // Format activities to match backend structure
      const formattedActivities = values.activities.map((activity) => ({
        ...activity,
        datetime: `${activity.date}T${activity.time}`, // Combine date and time into datetime
      }));

      // Prepare data for submission
      const dataToSubmit = {
        ...values,
        start_date: `${values.start_date}T00:00:00`, // Add time part to dates
        end_date: `${values.end_date}T00:00:00`,
        activities: formattedActivities,
      };

      // JWT token
      const token = localStorage.getItem("access_token");

      fetch("https://travel-agency-d5rs.onrender.com/itineraries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSubmit),
      })
        .then((response) => {
          if (response.ok) {
            alert("Itinerary submitted successfully!");
            navigate("/itinerary");
          } else {
            alert("Failed to submit itinerary.");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    },
  });

  const handleActivityChange = (index, field, value) => {
    const newActivities = [...formik.values.activities];
    newActivities[index][field] = value;
    formik.setFieldValue("activities", newActivities);
  };

  const addActivity = () => {
    formik.setFieldValue("activities", [
      ...formik.values.activities,
      { name: "", description: "", date: "", time: "" },
    ]);
  };

  const removeActivity = (index) => {
    const newActivities = formik.values.activities.filter(
      (_, i) => i !== index
    );
    formik.setFieldValue("activities", newActivities);
  };

  return (
    <>
      <NavBar />
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <form
          onSubmit={formik.handleSubmit}
          className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">
            Add a New Itinerary
          </h2>

          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              {...formik.getFieldProps("name")}
              className={`mt-1 block w-full p-2 border rounded-lg ${
                formik.touched.name && formik.errors.name
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {formik.touched.name && formik.errors.name ? (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.name}
              </div>
            ) : null}
          </div>

          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              {...formik.getFieldProps("description")}
              className={`mt-1 block w-full p-2 border rounded-lg ${
                formik.touched.description && formik.errors.description
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {formik.touched.description && formik.errors.description ? (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.description}
              </div>
            ) : null}
          </div>

          <div className="mb-4">
            <label
              htmlFor="start_date"
              className="block text-sm font-medium text-gray-700"
            >
              Start Date
            </label>
            <input
              id="start_date"
              type="date"
              {...formik.getFieldProps("start_date")}
              className={`mt-1 block w-full p-2 border rounded-lg ${
                formik.touched.start_date && formik.errors.start_date
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {formik.touched.start_date && formik.errors.start_date ? (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.start_date}
              </div>
            ) : null}
          </div>

          <div className="mb-4">
            <label
              htmlFor="end_date"
              className="block text-sm font-medium text-gray-700"
            >
              End Date
            </label>
            <input
              id="end_date"
              type="date"
              {...formik.getFieldProps("end_date")}
              className={`mt-1 block w-full p-2 border rounded-lg ${
                formik.touched.end_date && formik.errors.end_date
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {formik.touched.end_date && formik.errors.end_date ? (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.end_date}
              </div>
            ) : null}
          </div>

          <div className="mb-4">
            <h3 className="text-xl font-semibold mb-2">Activities</h3>
            {formik.values.activities.map((activity, index) => (
              <div
                key={index}
                className="border border-gray-300 p-4 rounded mb-4"
              >
                <div className="flex justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Activity Name
                  </label>
                  {formik.values.activities.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeActivity(index)}
                      className="text-red-500"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  value={activity.name}
                  onChange={(e) =>
                    handleActivityChange(index, "name", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded mb-2"
                  required
                />

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={activity.description}
                  onChange={(e) =>
                    handleActivityChange(index, "description", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded mb-2"
                  rows="2"
                  required
                />

                <div className="flex space-x-4 mb-2">
                  <div className="w-1/2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      value={activity.date}
                      onChange={(e) =>
                        handleActivityChange(index, "date", e.target.value)
                      }
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    />
                  </div>
                  <div className="w-1/2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time
                    </label>
                    <input
                      type="time"
                      value={activity.time}
                      onChange={(e) =>
                        handleActivityChange(index, "time", e.target.value)
                      }
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addActivity}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Add Activity
            </button>
          </div>

          <button
            type="submit"
            className="bg-lime-900 text-white px-4 py-2 rounded w-full"
          >
            Submit
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default ItineraryForm;
