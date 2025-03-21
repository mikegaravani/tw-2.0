import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import HomePage from "./components/HomePage/HomePage";
import Calendar from "./components/Calendar/Calendar";
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
          </Route>

          {/* ROUTES WITHOUT SIDEBAR LAYOUT */}
        </Routes>
      </Router>
    </>
  );
}

export default App;
