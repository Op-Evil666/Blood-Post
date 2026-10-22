import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="blood-footer">
      <div className="blood-footer-inner">
        <Link to="/" className="blood-footer-brand">
          BLOOD POST<span>®</span>
        </Link>

        <p className="blood-footer-copyright">
          © 2026 Blood Post. All rights reserved.
        </p>

        <nav className="blood-footer-links" aria-label="Footer navigation">
          <Link to="/about">About</Link>
          <Link to="/explore">Explore</Link>
          <Link to="/login">Login</Link>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;
