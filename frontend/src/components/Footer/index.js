// import { NavLink } from "react-router-dom";
import "./Footer.css"

const Footer = () => {
  return (
    <footer>
      <div className="footer-container">
        <div style={{fontSize: "1.1rem"}}>
          BallBnB © 2023
        </div>
        <a style={{textDecoration: "none", color: "black", fontSize: "1.4rem"}} href="https://www.linkedin.com/in/andrew-chan-970844275/">
          <div><i class="fa-brands fa-linkedin"></i></div>
        </a>
        <a style={{textDecoration: "none", color: "black", fontSize: "1.4rem"}} href="https://github.com/andrew-khai">
          <div><i class="fa-brands fa-github"></i></div>
        </a>
      </div>
    </footer>
  )
}

export default Footer;
