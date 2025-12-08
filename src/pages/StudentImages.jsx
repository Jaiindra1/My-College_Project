import { useEffect, useState } from "react";
import api from "../api/axiosInstance";

export default function StudentImages() {
  const [images, setImages] = useState([]);
  const [selected, setSelected] = useState({});
  const [selectAll, setSelectAll] = useState(false);
  const [isLoadingImages, setIsLoadingImages] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [previewImage, setPreviewImage] = useState(null); // full-screen preview

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await api.get("/images/images/student",
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );

        const data = res.data || [];
        setImages(data);

        const initial = {};
        data.forEach((img) => (initial[img.id] = false));
        setSelected(initial);
      } catch (error) {
        console.error(error);
        setStatusMessage("Unable to load images. Please try again later.");
      } finally {
        setIsLoadingImages(false);
      }
    };

    fetchImages();
  }, []);

  const toggleSelect = (id) => {
    setSelected((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleSelectAll = () => {
    setSelectAll((prev) => !prev);

    const updated = {};
    images.forEach((img) => (updated[img.id] = !selectAll));
    setSelected(updated);
  };

  // Single image OR ZIP download based on selected count
  const downloadSelected = async () => {
    const selectedImages = images.filter((img) => selected[img.id]);

    if (selectedImages.length === 0) {
      alert("Please select at least one image.");
      return;
    }

    const token = localStorage.getItem("token");
    setIsDownloading(true);
    setStatusMessage("");

    try {
      // If only one image selected → single image download
      if (selectedImages.length === 1) {
        const img = selectedImages[0];

        const response = await fetch(
          `http://localhost:5000/api/images/download/${img.id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          console.error("Single download failed:", response.status);
          setStatusMessage("Failed to download image. Please try again.");
          return;
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = (img.title || "image") + ".jpg";
        document.body.appendChild(a);
        a.click();
        a.remove();

        window.URL.revokeObjectURL(url);
        setStatusMessage("Download started for selected image.");
        return;
      }

      // More than one image selected → bulk ZIP download
      const ids = selectedImages.map((img) => img.id);

      const response = await axios.post(
        "http://localhost:5000/api/images/download/bulk",
        { ids },
        {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.data) {
        console.error("No data returned for bulk download");
        setStatusMessage("Failed to prepare ZIP file.");
        return;
      }

      const zipBlob = new Blob([response.data], { type: "application/zip" });
      const url = window.URL.createObjectURL(zipBlob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "images.zip";
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
      setStatusMessage("Download started for selected images as ZIP.");
    } catch (err) {
      console.error("Bulk download error:", err);
      setStatusMessage("Failed to download selected images.");
    } finally {
      setIsDownloading(false);
    }
  };

  const selectedCount = images.filter((img) => selected[img.id]).length;

  return (
    <div
      className="student-images"
      style={{
        padding: 24,
        backgroundColor: "#f4f5f7",
        minHeight: "100vh",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <header style={{ marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>
          Available Images
        </h2>
        <p style={{ margin: "6px 0 0", color: "#6b7280", fontSize: 14 }}>
          View and download images shared by admin.
        </p>
      </header>

      {/* Toolbar */}
      <section
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <input
              type="checkbox"
              checked={selectAll}
              onChange={toggleSelectAll}
            />
            <span style={{ fontSize: 14 }}>Select All</span>
          </label>
          <span style={{ fontSize: 13, color: "#6b7280" }}>
            {selectedCount === 0 &&
              "Select one image to download it, or select multiple to download them as a ZIP."}
            {selectedCount === 1 &&
              "1 image selected. Click Download to get this image."}
            {selectedCount > 1 &&
              `${selectedCount} images selected. They will be downloaded as a ZIP.`}
          </span>
        </div>

        <button
          onClick={downloadSelected}
          disabled={isDownloading || images.length === 0}
          style={{
            padding: "8px 18px",
            background: isDownloading ? "#1d4ed8aa" : "#2563eb",
            color: "#ffffff",
            border: "none",
            borderRadius: 6,
            cursor: isDownloading ? "not-allowed" : "pointer",
            fontSize: 14,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          {isDownloading && (
            <span
              style={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                border: "2px solid #ffffff",
                borderTopColor: "transparent",
                animation: "spin 0.7s linear infinite",
              }}
            />
          )}
          {isDownloading ? "Preparing download..." : "Download Selected"}
        </button>
      </section>

      {/* Status message */}
      {statusMessage && (
        <div
          style={{
            marginBottom: 12,
            padding: "8px 12px",
            backgroundColor: "#ecfdf5",
            border: "1px solid #6ee7b7",
            borderRadius: 6,
            fontSize: 13,
            color: "#047857",
          }}
        >
          {statusMessage}
        </div>
      )}

      {/* Loading state */}
      {isLoadingImages && (
        <p style={{ fontSize: 14, color: "#6b7280" }}>Loading images…</p>
      )}

      {/* Empty state */}
      {!isLoadingImages && images.length === 0 && (
        <div
          style={{
            marginTop: 40,
            padding: 24,
            background: "#ffffff",
            borderRadius: 12,
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            textAlign: "center",
            maxWidth: 400,
          }}
        >
          <div
            style={{
              fontSize: 40,
              marginBottom: 8,
            }}
          >
            📁
          </div>
          <h3 style={{ margin: "0 0 4px", fontSize: 18 }}>
            No images available yet
          </h3>
          <p style={{ margin: 0, fontSize: 14, color: "#6b7280" }}>
            Your teachers or admin will upload images here.
          </p>
        </div>
      )}

      {/* Image grid */}
      {!isLoadingImages && images.length > 0 && (
        <div
          className="image-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(310px, 1fr))",
            gap: 16,
            marginTop: 12,
          }}
        >
          {images.map((img) => {
            const isSelected = selected[img.id] || false;

            return (
              <div
                key={img.id}
                className="image-card"
                style={{
                  height: 340,
                  padding: 10,
                  borderRadius: 10,
                  backgroundColor: "#ffffff",
                  border: isSelected
                    ? "2px solid #2563eb"
                    : "1px solid #e5e7eb",
                  boxShadow: isSelected
                    ? "0 4px 10px rgba(37,99,235,0.2)"
                    : "0 1px 3px rgba(0,0,0,0.06)",
                  transition: "all 0.15s ease",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "stretch",
                }}
              >
                {/* Hover zoom + click full-screen preview */}
                <div className="image-zoom-container">
                  <img
                    src={img.image_url}
                    alt={img.title}
                    className="image-zoom"
                    onClick={() => setPreviewImage(img.image_url)}
                    style={{
                      width: "400%",
                      height: 210,
                      objectFit: "fit",
                      cursor: "zoom-in",
                    }}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: 8,
                    marginBottom: 6,
                  }}
                >
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: 13,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(img.id)}
                    />
                    <span>Select</span>
                  </label>
                </div>

                <h4
                  style={{
                    margin: "4px 0",
                    fontSize: 15,
                    fontWeight: 600,
                    color: "#111827",
                  }}
                >
                  {img.title}
                </h4>

                {img.description && (
                  <p
                    style={{
                      margin: "2px 0 4px",
                      fontSize: 13,
                      color: "#4b5563",
                    }}
                  >
                    {img.description}
                  </p>
                )}

                <small
                  style={{
                    fontSize: 12,
                    color: "#9ca3af",
                    marginTop: "auto",
                  }}
                >
                  {new Date(img.uploaded_at).toLocaleString()}
                </small>
              </div>
            );
          })}
        </div>
      )}

      {/* Full-screen preview modal */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            cursor: "zoom-out",
          }}
        >
          <img
            src={previewImage}
            alt="Full Preview"
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              borderRadius: 10,
              boxShadow: "0 0 20px rgba(0,0,0,0.5)",
            }}
          />
        </div>
      )}

      {/* inline CSS for hover zoom + spinner */}
      <style>
        {`
          .image-zoom-container {
            overflow: hidden;
            border-radius: 8px;
          }

          .image-zoom {
            transition: transform 0.25s ease;
          }

          .image-zoom:hover {
            transform: scale(1.8);
          }

          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}

