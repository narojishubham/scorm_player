import { Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./home";
import PlayerTest from "./Player";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/scorm-player" element={<PlayerTest />}></Route>
      </Routes>
    </>
  );
}

export default App;
