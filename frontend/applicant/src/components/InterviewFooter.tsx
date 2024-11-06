import "../styles/dark_mode_footer.css";

function InterviewFooter() {
  return (
    <footer className="interview-footer">
      <span className="footer-left">
        <i className="bi bi-moon"></i>
      </span>
      <span className="footer-right">
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

export default InterviewFooter;
