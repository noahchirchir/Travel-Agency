import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";

function JournalForm() {
  const navigate = useNavigate();

  // Update formik to use entry_date instead of date
  const formik = useFormik({
    initialValues: {
      title: "",
      content: "",
      entry_date: "", // Changed from date to entry_date
      created_at: new Date().toISOString().split("T")[0],
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      content: Yup.string().required("Content is required"),
      entry_date: Yup.date().required("Date is required").nullable(), // Changed from date to entry_date
    }),
    onSubmit: (values) => {
      // JWT token
      const token = localStorage.getItem("access_token");

      fetch("http://127.0.0.1:5555/journals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...values,
          // Pass the correct field name
          date: values.entry_date, // Update field name in request
        }),
      })
        .then((response) => {
          if (response.ok) {
            alert("Journal entry submitted successfully!");
            navigate("/journal"); // Navigate to the journal list or any other page
          } else {
            alert("Failed to submit journal entry.");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    },
  });

  return (
    <>
      <NavBar />
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <form
          onSubmit={formik.handleSubmit}
          className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">
            Add a New Journal Entry
          </h2>

          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              id="title"
              type="text"
              {...formik.getFieldProps("title")}
              className={`mt-1 block w-full p-2 border rounded-lg ${
                formik.touched.title && formik.errors.title
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {formik.touched.title && formik.errors.title ? (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.title}
              </div>
            ) : null}
          </div>

          <div className="mb-4">
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700"
            >
              Content
            </label>
            <textarea
              id="content"
              {...formik.getFieldProps("content")}
              className={`mt-1 block w-full p-2 border rounded-lg ${
                formik.touched.content && formik.errors.content
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {formik.touched.content && formik.errors.content ? (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.content}
              </div>
            ) : null}
          </div>

          <div className="mb-4">
            <label
              htmlFor="entry_date" // Updated field name
              className="block text-sm font-medium text-gray-700"
            >
              Date
            </label>
            <input
              id="entry_date" // Updated field name
              type="date"
              {...formik.getFieldProps("entry_date")} // Updated field name
              className={`mt-1 block w-full p-2 border rounded-lg ${
                formik.touched.entry_date && formik.errors.entry_date // Updated field name
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {formik.touched.entry_date && formik.errors.entry_date ? ( // Updated field name
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.entry_date} 
              </div>
            ) : null}
          </div>

          <input
            type="hidden"
            id="created_at"
            {...formik.getFieldProps("created_at")}
          />

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

export default JournalForm;
