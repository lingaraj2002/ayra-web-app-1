import "./Footer.scss";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>AYRA Health Mix</h3>
          <p>
            Traditional homemade foods prepared with love, purity, and authentic
            South Indian taste.
          </p>
        </div>
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/list">Shop</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
            <li>
              <Link to="/admin">Admin</Link>
            </li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Policies</h4>
          <ul>
            <li>
              <Link to="/policies">Privacy Policy</Link>
            </li>
            <li>
              <Link to="/policies">Refund Policy</Link>
            </li>
            <li>
              <Link to="/policies">Shipping Policy</Link>
            </li>
            <li>
              <Link to="/policies">Terms & Conditions</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} AYRA | Developed by{" "}
          <a
            href="https://lingaraj2002.github.io/leetrix/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Leetrix Studios
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
