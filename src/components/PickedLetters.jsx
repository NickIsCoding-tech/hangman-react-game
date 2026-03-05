export default function PickedLetters({ guessed }) {
  const list = guessed.map((c) => c.toUpperCase());

  return (
    <div className="picked">
      <h3 className="pickedTitle">Chosen Letters</h3>
      {list.length === 0 ? (
        <p className="muted">No letters chosen yet.</p>
      ) : (
        <div className="pickedRow">
          {list.map((l, i) => (
            <span key={`${l}-${i}`} className="chip">
              {l}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}