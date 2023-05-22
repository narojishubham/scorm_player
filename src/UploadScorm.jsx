import React, { useState } from "react";
import AdmZip from "adm-zip";
import JSZip from "jszip";

function UploadScorm() {
  const [file, setFile] = useState();
  const [extractedFiles, setExtractedFiles] = useState([]);

  const handleExtract = (event) => {
    const file = event.target.files[0];
    const targetDirectory = "src/scormExtract";
    if (!file) {
      return;
    }

    const zip = new JSZip();
    zip
      .loadAsync(file)
      .then((zip) => {
        const extractedFilePaths = [];

        zip.forEach((relativePath, zipEntry) => {
          if (!zipEntry.dir) {
            zipEntry.async("blob").then((blob) => {
              const extractedFile = new File(
                [blob],
                targetDirectory + zipEntry.name,
                {
                  type: zipEntry.comment,
                }
              );
              extractedFilePaths.push(extractedFile);
            });
          }
        });

        Promise.all(extractedFilePaths)
          .then((files) => {
            setExtractedFiles(files);
            console.log("Success");
          })
          .catch((error) => {
            console.error("Error extracting files:", error);
          });
      })
      .catch((error) => {
        console.error("Error loading zip file:", error);
      });
  };

  return (
    <div>
      <input type="file" accept=".zip" onChange={handleExtract} />

      <button type="button" onClick={handleExtract}>
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
