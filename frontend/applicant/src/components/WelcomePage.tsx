function WelcomePage({ handleStart }: WelcomePageProps) {
  return (
    <>
      <h2>Welcome, applicant!</h2>
      <div>Proceed once you are ready</div>
      <button onClick={handleStart}>Start</button>
    </>
  );
}

interface WelcomePageProps {
  handleStart: () => void;
}

export default WelcomePage;
