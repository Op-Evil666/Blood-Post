
import { useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AppRoutes from "./routes/AppRoutes";
import "./App.css";

function App() {
  const { pathname } = useLocation();
  const isLandingPage = pathname === "/";

  return (
    <div className="min-h-screen flex flex-col bg-[#100609] text-gray-100">
      {!isLandingPage && <Navbar />}

      <main className="flex-1">
        <AppRoutes />
      </main>

      {!isLandingPage && <Footer />}
    </div>
  );
}

export default App;
