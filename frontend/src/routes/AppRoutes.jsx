import { Routes, Route } from "react-router-dom";
import Profile from "../pages/Profile";
import LandingPage from "../pages/LandingPage";
import Home from "../pages/Home";
import Explore from "../pages/Explore";
import About from "../pages/About";
import Login from "../pages/Login";
import Register from "../pages/Register";
import PostDetails from "../pages/PostDetails";
import CreatePost from "../pages/CreatePost";
import RequireAuth from "../components/RequireAuth";
import NotFound from "../pages/NotFound";
import UpdatePost from "../pages/UpdatePost";
import VerifyEmail from "../pages/VerifyEmail";
import RequireOwner from "../components/RequireOwner";
import OwnerDashboard from "../pages/OwnerDashboard";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/home" element={<Home />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email" element={<VerifyEmail />} />

      <Route element={<RequireAuth />}>
        <Route path="/posts/create" element={<CreatePost />} />
        <Route path="/posts/:postId/edit" element={<UpdatePost />} />
      </Route>

      <Route element={<RequireOwner />}>
          <Route path="/owner" element={<OwnerDashboard />} />
      </Route>

      <Route path="/posts/:postId" element={<PostDetails />} />
      <Route path="/profile" element={<Profile />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
