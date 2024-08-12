import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";

function ShareJournal() {
  const { id } = useParams();
  const [allUsers, setAllUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:5555/users")
      .then((response) => response.json())
      .then((data) => setAllUsers(data.users))
      .catch((error) => setError(error.message));
  }, []);

  const formik = useFormik({
    initialValues: {
      user_ids: [],
    },
    validationSchema: Yup.object({
      user_ids: Yup.array()
        .of(Yup.number())
        .required("At least one user must be selected."),
    }),
    onSubmit: (values) => {
      fetch(`http://127.0.0.1:5555/journals/share/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify(values),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            return response.text().then((text) => {
              throw new Error(`HTTP error ${response.status}: ${text}`);
            });
          }
        })
        .then((data) => {
          alert("Journal entry shared successfully!");
          console.log(data)
        })
        .catch((error) => {
          console.error("Error sharing journal entry:", error);
          setError(error.message);
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
            Share Journal Entry
          </h2>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Select Users to Share With
            </label>
            <div className="space-y-2">
              {allUsers.map((user) => (
                <div key={user.id}>
                  <input
                    type="checkbox"
                    id={`user-${user.id}`}
                    value={user.id}
                    checked={formik.values.user_ids.includes(user.id)}
                    onChange={() => {
                      const newUserIds = formik.values.user_ids.includes(
                        user.id
                      )
                        ? formik.values.user_ids.filter((id) => id !== user.id)
                        : [...formik.values.user_ids, user.id];
                      formik.setFieldValue("user_ids", newUserIds);
                    }}
                    className="mr-2"
                  />
                  <label htmlFor={`user-${user.id}`} className="ml-2">
                    {user.username}
                  </label>
                </div>
              ))}
            </div>
            {formik.touched.user_ids && formik.errors.user_ids ? (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.user_ids}
              </div>
            ) : null}
          </div>

          <button
            type="submit"
            className="bg-lime-900 text-white py-2 px-4 rounded-lg hover:bg-lime-700 transition duration-300 ease-in-out mt-4"
          >
            Share Journal Entry
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
}

export default ShareJournal;
