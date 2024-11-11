import InfoSupportMailSupport from "./InfoSupportMailSupport";
import "../styles/dark_mode_footer.css";

function Footer() {
  return (
    <footer className="footer">
      <span className="footer__left">
        <InfoSupportMailSupport
          element={<i className="bi bi-question-circle"></i>}
        />
        <i className="bi bi-moon"></i>
      </span>
      <span className="footer__right">
        <span className="question-menu">
          <span>Question Menu</span>
          <i className="bi bi-list"></i>
        </span>
        <span className="next-question">
          <span>Next Question</span>
          <i className="bi bi-play-circle"></i>
        </span>
      </span>
    </footer>
  );
}

export default Footer;
