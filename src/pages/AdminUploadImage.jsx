import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";

export default function AdminUploadImage() {
  const [form, setForm] = useState({ title: "", description: "" });
  const [files, setFiles] = useState([]); // multiple files
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [existingImages, setExistingImages] = useState([]);
  const [fetchingExisting, setFetchingExisting] = useState(false);

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files || []);
    setFiles(selected);
  };

  const fetchExistingImages = async () => {
    try {
      setFetchingExisting(true);
      const res = await axios.get(
        "http://localhost:5000/api/images/images/admin",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Backend returns an array from GET /images/admin
      setExistingImages(res.data || []);
    } catch (error) {
      console.error(
        "Error fetching existing images:",
        error.response?.data || error.message
      );
    } finally {
      setFetchingExisting(false);
    }
  };

  useEffect(() => {
    fetchExistingImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!files || files.length === 0) {
      setMessage("Please select at least one image");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description || "");

      // 🔥 bulk upload: send all files under "images"
      files.forEach((file) => {
        formData.append("images", file); // must match upload.array("images")
      });

      const res = await axios.post(
        "http://localhost:5000/api/images/images/admin",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Backend response:", res.data);
      setMessage(
        files.length === 1
          ? "Image uploaded successfully ✔"
          : `${files.length} images uploaded successfully ✔`
      );

      setForm({ title: "", description: "" });
      setFiles([]);

      // reload existing images info
      fetchExistingImages();
    } catch (error) {
      console.error("Upload error:", error.response?.data || error.message);
      setMessage("Upload failed ❌");
    } finally {
      setLoading(false);
    }
  };

  const totalImages = existingImages.length;
  const firstImage = totalImages > 0 ? existingImages[0] : null;

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <main style={{ padding: 30, flex: 1 }}>
        <h1 style={{ marginBottom: 20 }}>Upload Image(s)</h1>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label>Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label>Description (optional)</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              style={styles.textarea}
            />
          </div>

          <div style={styles.formGroup}>
            <label>Select Image(s)</label>
            <input
              type="file"
              accept="image/*"
              multiple // 🔥 allow bulk upload
              onChange={handleFileChange}
            />
            {files.length > 0 && (
              <small style={{ marginTop: 5 }}>
                {files.length} file{files.length > 1 ? "s" : ""} selected
              </small>
            )}
          </div>

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? "Uploading..." : "Upload"}
          </button>
        </form>

        {message && <p style={styles.message}>{message}</p>}

        {/* Existing images summary */}
        <section style={{ marginTop: 30 }}>
          <h2>Existing Uploads</h2>
          {fetchingExisting ? (
            <p>Loading existing data...</p>
          ) : (
            <>
              <p>
                Total images in database: <strong>{totalImages}</strong>
              </p>

              {firstImage && firstImage.image_url && (
                <div style={{ marginTop: 10 }}>
                  <p>Sample image (latest / first record):</p>
                  <img
                    src={firstImage.image_url}
                    alt={firstImage.title || "Uploaded image"}
                    style={{ maxWidth: 250, borderRadius: 8 }}
                  />
                  {firstImage.title && (
                    <p style={{ marginTop: 5 }}>Title: {firstImage.title}</p>
                  )}
                </div>
              )}

              {totalImages === 0 && (
                <p>No images found in the database yet.</p>
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
}

const styles = {
  form: {
    maxWidth: 450,
    background: "#fff",
    padding: 20,
    borderRadius: 10,
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  },
  formGroup: { marginBottom: 15, display: "flex", flexDirection: "column" },
  input: { padding: 10, borderRadius: 6, border: "1px solid #ccc" },
  textarea: {
    padding: 10,
    borderRadius: 6,
    border: "1px solid #ccc",
    minHeight: 80,
  },
  button: {
    padding: "10px 20px",
    border: "none",
    background: "#2563eb",
    color: "#fff",
    borderRadius: 6,
    cursor: "pointer",
  },
  message: { marginTop: 15, fontSize: 16 },
};
