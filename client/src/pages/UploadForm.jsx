import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";

// Validation schema for the form
const validationSchema = Yup.object({
  image: Yup.mixed().required("Image is required"),
  comment: Yup.string().required("Comment is required"),
});

// Function to upload an image
const uploadImage = (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return fetch("http://127.0.0.1:5555/uploads", {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
  }).then((response) => {
    if (!response.ok) {
      return response.json().then((data) => {
        throw new Error(data.message || "Image upload failed");
      });
    }
    return response.json();
  });
};

// Function to post a comment
const postComment = (comment) => {
  return fetch("http://127.0.0.1:5555/comments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
    body: JSON.stringify({ content: comment }),
  }).then((response) => {
    if (!response.ok) {
      return response.json().then((data) => {
        throw new Error(data.message || "Comment post failed");
      });
    }
    return response.json();
  });
};

function UploadAndCommentForm() {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      image: null,
      comment: "",
    },
    validationSchema,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      // Handle image upload and comment post
      const imageUploadPromise = values.image
        ? uploadImage(values.image)
        : Promise.resolve();

      const commentPostPromise = postComment(values.comment);

      Promise.all([imageUploadPromise, commentPostPromise])
        .then(() => {
          alert("Image uploaded and comment posted successfully!");
          resetForm();
          navigate("/community");
        })
        .catch((error) => {
          alert(error.message);
        })
        .finally(() => {
          setSubmitting(false);
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
            Share your experience
          </h2>

          <div className="mb-4">
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700"
            >
              Image
            </label>
            <input
              id="image"
              name="image"
              type="file"
              onChange={(event) => {
                formik.setFieldValue("image", event.currentTarget.files[0]);
              }}
              className={`mt-1 block w-full border rounded-lg p-2 ${
                formik.touched.image && formik.errors.image
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {formik.touched.image && formik.errors.image ? (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.image}
              </div>
            ) : null}
          </div>

          <div className="mb-4">
            <label
              htmlFor="comment"
              className="block text-sm font-medium text-gray-700"
            >
              Comment
            </label>
            <textarea
              id="comment"
              name="comment"
              {...formik.getFieldProps("comment")}
              className={`mt-1 block w-full p-2 border rounded-lg ${
                formik.touched.comment && formik.errors.comment
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              rows="4"
            />
            {formik.touched.comment && formik.errors.comment ? (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.comment}
              </div>
            ) : null}
          </div>

          <button
            type="submit"
            className="bg-lime-900 text-white py-1 px-3 rounded-lg hover:bg-lime-800 transition-colors duration-300 ease-in-out text-lg"
          >
            Submit
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
}

export default UploadAndCommentForm;
