import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar   from "./components/Navbar";
import Footer   from "./components/Footer";
import Home     from "./pages/Home";
import Working  from "./pages/Working";
import AboutUs  from "./pages/AboutUs";
import Contacts from "./pages/Contacts";
import Blogs    from "./pages/Blogs";
import FAQs     from "./pages/FAQs";

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/"         element={<Home />} />
        <Route path="/working"  element={<Working />} />
        <Route path="/about"    element={<AboutUs />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/blogs"    element={<Blogs />} />
        <Route path="/faqs"     element={<FAQs />} />
      </Routes>
      <Footer />
    </Router>
  );
}
