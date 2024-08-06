import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .max(50, "Must be 50 characters or less")
        .required("Required"), // Updated to match API
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string()
        .min(8, "Must be at least 8 characters")
        .required("Required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Required"),
    }),
    onSubmit: (values) => {
      fetch("http://127.0.0.1:5555/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: values.username,
          email: values.email,
          password: values.password,
        }),
      })
        .then((response) => {
          if (response.ok) {
            alert("Registration successful!");
            navigate("/login"); // Navigate to the login form after registration
          } else {
            return response.json().then((data) => {
              alert(data.message || "Registration failed");
            });
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={formik.handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700"
          >
            Username
          </label>
          <input
            id="username" // Updated to match API
            type="text"
            {...formik.getFieldProps("username")} // Updated to match API
            className={`mt-1 block w-full p-2 border rounded-lg ${
              formik.touched.username && formik.errors.username
                ? "border-red-500"
                : "border-gray-300"
            }`}
          />
          {formik.touched.username && formik.errors.username ? (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.username}
            </div>
          ) : null}
        </div>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            {...formik.getFieldProps("email")}
            className={`mt-1 block w-full p-2 border rounded-lg ${
              formik.touched.email && formik.errors.email
                ? "border-red-500"
                : "border-gray-300"
            }`}
          />
          {formik.touched.email && formik.errors.email ? (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.email}
            </div>
          ) : null}
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            {...formik.getFieldProps("password")}
            className={`mt-1 block w-full p-2 border rounded-lg ${
              formik.touched.password && formik.errors.password
                ? "border-red-500"
                : "border-gray-300"
            }`}
          />
          {formik.touched.password && formik.errors.password ? (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.password}
            </div>
          ) : null}
        </div>
        <div className="mb-4">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700"
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            {...formik.getFieldProps("confirmPassword")}
            className={`mt-1 block w-full p-2 border rounded-lg ${
              formik.touched.confirmPassword && formik.errors.confirmPassword
                ? "border-red-500"
                : "border-gray-300"
            }`}
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.confirmPassword}
            </div>
          ) : null}
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-lime-900 text-white py-2 px-5 rounded-full hover:bg-lime-800 transition duration-300 ease-in-out"
          >
            Register
          </button>
        </div>
        <p className="mt-4">
          Already have an account?
          <Link to="/login" className="text-green-950 underline ml-1">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
