export default function WordSlots({ word, guessed, revealAll }) {
  const guessedUpper = guessed.map((c) => c.toUpperCase());

  return (
    <div className="wordRow">
      {word.split("").map((ch, idx) => {
        const show = revealAll || guessedUpper.includes(ch);
        return (
          <span className="slot" key={`${ch}-${idx}`}>
            {show ? ch : ""}
          </span>
        );
      })}
    </div>
  );
}