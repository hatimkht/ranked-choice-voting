import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <h2>FRUCHT<span className="dot">.</span></h2>
          <p>Eine Hommage an die Natur.<br />Designed mit Liebe zum Detail.</p>
        </div>
        <div className="footer-links">
          <Link to="/">Home</Link>
          <Link to="/katalog">Katalog</Link>
          <Link to="/ueber">Über</Link>
          <Link to="/playground">Playground</Link>
        </div>
        <div className="footer-copy">
          <p>&copy; 2026 FRUCHT Studio — Alle Rechte vorbehalten.</p>
        </div>
      </div>
    </footer>
  )
}
