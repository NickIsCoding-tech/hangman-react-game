const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function LetterPad({ guessed, onPickLetter, disabled }) {
  const used = new Set(guessed.map((c) => c.toUpperCase()));

  return (
    <div className="pad">
      {LETTERS.map((letter) => {
        const already = used.has(letter);
        return (
          <button
            key={letter}
            className="padBtn"
            disabled={disabled || already}
            onClick={() => onPickLetter(letter)}
            aria-label={`pick ${letter}`}
            title={already ? "Already chosen" : `Choose ${letter}`}
          >
            {letter}
          </button>
        );
      })}
    </div>
  );
}