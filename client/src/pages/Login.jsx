import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string()
        .min(8, "Must be at least 8 characters")
        .required("Required"),
    }),
    onSubmit: (values) => {
      fetch("https://travel-agency-d5rs.onrender.com/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.access_token) {
            // Store the token in localStorage or a state management solution
            localStorage.setItem("access_token", data.access_token);
            alert("Login successful!");
            navigate("/home"); // Navigate to the home page after login
          } else {
            alert("Login failed: " + data.message);
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
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
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
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-lime-900 text-white py-2 px-5 rounded-full hover:bg-lime-800 transition duration-300 ease-in-out"
          >
            Login
          </button>
        </div>
        <p className="mt-4">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="text-green-950 underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
