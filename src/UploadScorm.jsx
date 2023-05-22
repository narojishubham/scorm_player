import React, { useState } from "react";
import * as JSZip from "jszip";
function UploadScorm() {
  const [file, setFile] = useState();
  const [extractedFiles, setExtractedFiles] = useState([]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    console.log();
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    const compressedFile = file;

    if (!compressedFile) {
      return;
    }

    try {
      const zip = await JSZip.loadAsync(compressedFile);
      const extractedFilePaths = [];

      zip.forEach(async (relativePath, zipEntry) => {
        if (!zipEntry.dir) {
          const extractedFile = await zip.file(zipEntry.name).async("blob");
          const srcFolderPath =
            "/home/shubham/Desktop/Infipre/test/scorm_player/src/" +
            file.name +
            "/" +
            zipEntry.name; // Target folder path in the src folder
          const newFile = new File([extractedFile], srcFolderPath);
          extractedFilePaths.push(newFile);

          // Store the file in the src folder
          const fileReader = new FileReader();
          fileReader.onload = () => {
            const fileData = fileReader.result;
            const a = document.createElement("a");
            a.href = fileData;
            a.download = srcFolderPath;
            a.style.display = "none";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          };
          fileReader.readAsDataURL(file);
        }
        console.log("Unzipped");
      });

      setExtractedFiles(extractedFilePaths);
    } catch (error) {
      console.error("Error extracting files:", error);
    }
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

      <button type="button" onClick={handleDrop}>
        Submit
      </button>
      {extractedFiles.length > 0 && (
        <div>
          <h3>Extracted Files:</h3>
          <ul>
            {extractedFiles.map((file) => (
              <li key={file.name}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default UploadScorm;
