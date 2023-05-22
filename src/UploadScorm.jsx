import React, { useState } from "react";
import AdmZip from "adm-zip";
import { saveAs } from "file-saver";
import JSZip from "jszip";

function UploadScorm() {
  const [file, setFile] = useState();
  const [extractedFiles, setExtractedFiles] = useState([]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const saveFile = (filePath, fileData) => {
    const blob = new Blob([fileData]);
    saveAs(blob, filePath);
  };

  const handleFileUpload = () => {
    if (file) {
      const reader = new FileReader();

      reader.onload = (event) => {
        const zip = new JSZip();
        const zipFile = event.target.result;

        zip
          .loadAsync(zipFile)
          .then((zipContents) => {
            zipContents.forEach((relativePath, zipEntry) => {
              if (!zipEntry.dir) {
                zipEntry.async("uint8array").then((fileData) => {
                  // Store the file in a folder (e.g., 'unzipped') using the relative path
                  const filePath = `/home/shubham/Desktop/Infipre/test/scorm_player/src/scormExtract/${relativePath}`;
                  saveFile(filePath, fileData);
                  // TODO: Save the file data or perform any other desired operations
                  console.log(filePath, fileData);
                });
              }
            });
          })
          .catch((error) => {
            console.error("Error unzipping file:", error);
          });
      };

      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <div>
      <input type="file" accept=".zip" onChange={handleFileChange} />

      <button type="button" onClick={handleFileUpload}>
        Submit
      </button>
    </div>
  );
}

export default UploadScorm;
