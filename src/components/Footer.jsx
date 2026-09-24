function Footer() {
  return (
    <footer className="app-footer">
      <div className="container">
        <div className="footer-brand">GoNect</div>
        <ul className="footer-links">
          <li><a href="#tos" onClick={(e) => e.preventDefault()}>Terms of Service</a></li>
          <li><a href="#privacy" onClick={(e) => e.preventDefault()}>Privacy Policy</a></li>
          <li><a href="#support" onClick={(e) => e.preventDefault()}>Contact Support</a></li>
        </ul>
        <div className="footer-copy">
          &copy; 2024 GoNect. Professional Exchange.
        </div>
      </div>
    </footer>
  )
}

export default Footer
