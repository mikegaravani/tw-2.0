import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import HomePage from "./components/HomePage/HomePage";
import Calendar from "./components/Calendar/Calendar";
import Notes from "./components/Notes/Notes";
import Login from "./components/Login/Login";
import Signup from "./components/Login/Signup";
// @ts-ignore
import Pomodoro from "./components/Pomodoro/Pomodoro";

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* ROUTES WITH SIDEBAR LAYOUT */}
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/pomodoro" element={<Pomodoro />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/notes" element={<Notes />} />
          </Route>

          {/* ROUTES WITHOUT SIDEBAR LAYOUT */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
