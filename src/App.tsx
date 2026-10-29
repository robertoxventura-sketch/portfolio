import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CaseStudy } from "./pages/CaseStudy";
import { Home } from "./pages/Home";
import { Writings } from "./pages/Writings";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/case/:id" element={<CaseStudy />} />
        <Route path="/writings" element={<Writings />} />
      </Routes>
    </BrowserRouter>
  );
}
