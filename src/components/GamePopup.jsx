export default function GamePopup({ open, outcome, word, onRestart }) {
  if (!open) return null;

  const title = outcome === "win" ? "You Won! :) " : "You Lost :( ";
  const message =
    outcome === "win"
      ? "Nice job! You guessed the word."
      : `Out of lives. The word was: ${word}`;

  return (
    <div className="overlay">
      <div className="modal">
        <h2 style={{ marginTop: 0 }}>{title}</h2>
        <p>{message}</p>
        <button className="primaryBtn" onClick={onRestart}>
          New Game
        </button>
      </div>
    </div>
  );
}