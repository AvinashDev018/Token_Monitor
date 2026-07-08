import { useState } from "react";
import axios from "axios";

function UploadImage() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleImage = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const uploadImage = async () => {
    if (!image) {
      alert("Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/gemini/analyze",
        formData
      );

      console.log(res.data);
      alert("Image Uploaded Successfully!");
    } catch (err) {
        console.error(err);
        if (err.response) {
            alert(err.response.data.message);
            console.log(err.response.data);
        } else {
            alert(err.message);
        }
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Upload Image</h2>

      <input
        type="file"
        accept="image/*"
        onChange={handleImage}
      />

      <br /><br />

      {preview && (
        <img
          src={preview}
          alt="Preview"
          width="250"
        />
      )}

      <br /><br />

      <button onClick={uploadImage}>
        Analyze Image
      </button>
    </div>
  );
}

export default UploadImage;