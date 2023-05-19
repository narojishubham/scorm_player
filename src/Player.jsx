import { useState, useEffect, useRef } from "react";
import ScormProvider from "@alexisab/react-scorm-provider";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;
function Player() {
  const searchParams = new URLSearchParams(window.location.search);
  const ScormCourseUrl = searchParams.get("scormUrl");
  const ScormId = searchParams.get("scormId");
  const token = "Bearer " + localStorage.getItem("ApiToken");
  const [api, setApi] = useState();
  const [suspendData, setSuspendData] = useState(null);
  const iframeRef = useRef(null);

  const [scormTrackData, setScormTrackData] = useState([]);

  const getSuspendData = (Id) => {
    axios
      .get(`${API_URL}/getScormTrackingById/${Id}`, {
        headers: { Authorization: token },
      })
      .then((response) => {
        setScormTrackData(response.data.data);
      });
  };

  function getSuspend() {
    const API = window.API_1484_11;
    setApi(window.API_1484_11);
    if (API) {
      let suspendData = API.GetValue("cmi.suspend_data");

      let formData = new FormData();

      formData.append("scormId", ScormId);
      formData.append("element", "cmi.suspend_data");
      formData.append("value", suspendData);
      addSuspend(formData);
      localStorage.setItem("suspend", formData);
      API.Terminate();
    } else {
      console.error("SCORM API not found.");
    }
  }

  // Listen for messages from the other frame

  const handleIframeLoad = () => {
    // Get the suspend data using the GetValue function of the SCORM API
    const suspendData = scormTrackData ? scormTrackData.value : "";
    if (suspendData) {
      handleResume();
    }
    // Save the suspend data to the local storage
    //localStorage.setItem("suspend", suspendData);
    console.log("Course Loaded");
  };
  function Init() {
    const API = window.API_1484_11;
    setApi(window.API_1484_11);
    console.log({ api });
    if (API) {
      API.Initialize();
    } else {
      console.error("SCORM API not found.");
    }
  }

  const addSuspend = (form) => {
    axios
      .post(`${API_URL}/scormTracking`, form, {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log("Added");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    // Init();
    const otherFrame = window.parent.frames[0]; // Replace with the appropriate frame reference
    otherFrame.postMessage("Hello from frame 1!", "http://localhost:5173");

    if (suspendData) {
      handleResume();
    }

    window.addEventListener("beforeunload", () => {
      getSuspend();
      setTimeout(() => {
        window.close();
      }, 3000);
    });
    // In the parent page
    // const frame = document.getElementById("scorm_object");
    // frame.contentWindow.postMessage(
    //   "Hello from parent page!",
    //   "https://saferhub.com"
    // );
    // // In the frame content
    // window.addEventListener("message", (event) => {
    //   if (event.origin === "https://example.com") {
    //     console.log("Received message from parent page:", event.data);
    //   }
    // });

    window.API_1484_11 = (function () {
      var data = {
        "cmi.learner_id": "000100",
        "cmi.learner_name": "Mohit Kamat",
        "cmi.location": "",
        "cmi.completion_status": "not attempted",
        "cmi.suspend_data": "",
        "cmi.entry": "",
      };
      return {
        Initialize: function () {
          return "true";
        },
        Commit: function () {
          return "true";
        },
        Terminate: function () {
          return "true";
        },
        GetValue: function (model) {
          return data[model] || "";
        },
        SetValue: function (model, value) {
          data[model] = value;
          return "true";
        },
        GetLastError: function () {
          return "0";
        },
        GetErrorString: function (errorCode) {
          return "No error";
        },
        GetDiagnostic: function (errorCode) {
          return "No error";
        },
      };
    })();
    window.API = (function () {
      var data = {
        "cmi.core.student_id": "000100",
        "cmi.core.student_name": "Student, Joe",
        "cmi.core.lesson_location": "",
        "cmi.core.lesson_status": "not attempted",
        "cmi.suspend_data": "",
      };
      return {
        LMSInitialize: function () {
          return "true";
        },
        LMSCommit: function () {
          return "true";
        },
        LMSFinish: function () {
          return "true";
        },
        LMSGetValue: function (model) {
          return data[model] || "";
        },
        LMSSetValue: function (model, value) {
          data[model] = value;
          return "true";
        },
        LMSGetLastError: function () {
          return "0";
        },
        LMSGetErrorString: function (errorCode) {
          return "No error";
        },
        LMSGetDiagnostic: function (errorCode) {
          return "No error";
        },
      };
    })();
    // Check if there is any suspend data saved in the local storage
    const savedSuspendData = scormTrackData ? scormTrackData.value : "";

    setSuspendData(savedSuspendData);
    if (suspendData) {
      // Set the suspend data using the SetValue function of the SCORM API
      handleResume();
    }
  }, []);

  useEffect(() => {
    if (ScormId) {
      getSuspendData(ScormId);
    }
  }, [ScormId]);

  const handleResume = () => {
    // Set the suspend data using the setSuspendData function
    window.API_1484_11.SetValue("cmi.suspend_data", suspendData);
    setSuspendData(null);
    // Call the Commit function to save the changes
    window.API_1484_11.Commit();
  };
  // console.log("new new new ", localStorage.getItem("suspend"));
  // const resumeData = localStorage.getItem("suspend");

  // useEffect(() => {
  //   addSuspend();
  // }, [resumeData, suspendData]);

  return (
    <>
      <ScormProvider debug={true}>
        <div className="d-flex justify-content-center">
          <iframe
            ref={iframeRef}
            onLoad={handleIframeLoad}
            type="text/html"
            id="scorm_object"
            allowFullScreen={true}
            height={"1000px"}
            width={"1920px"}
            src={`src/AvoidingaCrashscorm/index_lms.html`}
            // src={ScormCourseUrl}
          ></iframe>
        </div>
      </ScormProvider>
    </>
  );
}
export default Player;
