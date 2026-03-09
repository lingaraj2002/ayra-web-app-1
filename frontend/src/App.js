import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./styles/global.scss";
import MainLayout from "./Layouts/MainLayout";
import AdminLayout from "./Layouts/AdminLayout";

import Home from "./pages/Home/Home";
import List from "./pages/List/List";
import Details from "./pages/Details/Details";
import Contact from "./pages/Contact/Contact";
import Admin from "./pages/Admin/Admin";

function App() {
  return (
    <Router>
      <Routes>
        {/* USER SIDE */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/list" element={<List />} />
          <Route path="/details/:id" element={<Details />} />
          <Route path="/contact" element={<Contact />} />
        </Route>
        {/* ADMIN SIDE */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Admin />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
