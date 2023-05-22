import React, { useState } from "react";

function UploadScorm() {
  const [file, setFile] = useState();
  const [extractedFiles, setExtractedFiles] = useState([]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("scormFile", file);
    console.log(file);
    axios
      .post("http://localhost/postman/extract.php", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log(res);
        window.location.href = "/showContents";
      });
    //form.append('file', file)
  };

  return (
    <div>
      <input type="file" accept=".zip" onChange={handleFileChange} />

      <button type="button" onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
}

export default UploadScorm;
