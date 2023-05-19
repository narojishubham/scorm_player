import { useEffect } from "react";

function Home() {
  useEffect(() => {
    console.log("Suspense Data: ", localStorage.getItem("suspend"));
    console.log("Video Data:", localStorage.getItem("videoTime"));
    console.log("Complete Data:", localStorage.getItem("complete"));
  }, []);
  const loadFrame = () => {
    window.open("/scorm-player", "_blank", "width=800,height=600");
  };
  return (
    <>
      <button onClick={loadFrame}>Load Frame</button>
    </>
  );
}

export default Home;
