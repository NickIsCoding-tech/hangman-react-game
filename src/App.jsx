import { useMemo, useState } from "react";
import "./App.css";
import HangmanStage from "./components/HangmanStage";
import WordSlots from "./components/WordSlots";
import LetterPad from "./components/LetterPad";
import PickedLetters from "./components/PickedLetters";
import GamePopup from "./components/GamePopup";
import { pickNewWord } from "./words";

const MAX_LIVES = 5;

function normalizeLetter(input) {
  return (input || "").toUpperCase().replace(/[^A-Z]/g, "");
}

export default function App() {
  const [secretWord, setSecretWord] = useState(() => pickNewWord(""));
  const [guessedLetters, setGuessedLetters] = useState([]); 
  const [livesLeft, setLivesLeft] = useState(MAX_LIVES);
  const [previousWord, setPreviousWord] = useState("");

  const guessedUpper = useMemo(
    () => guessedLetters.map((c) => c.toUpperCase()),
    [guessedLetters]
  );

  const remainingLetters = useMemo(() => {
    const uniqueInWord = Array.from(new Set(secretWord.split("")));
    return uniqueInWord.filter((ch) => !guessedUpper.includes(ch));
  }, [secretWord, guessedUpper]);

  const isWin = remainingLetters.length === 0;
  const isLose = livesLeft <= 0;
  const isOver = isWin || isLose;

  const outcome = isWin ? "win" : "lose";

  const handlePickLetter = (letter) => {
    if (isOver) return;

    const cleaned = normalizeLetter(letter);
    if (!cleaned) return;

    if (guessedUpper.includes(cleaned)) return;

    setGuessedLetters((prev) => [...prev, cleaned]);

    if (!secretWord.includes(cleaned)) {
      setLivesLeft((prev) => Math.max(0, prev - 1));
    }
  };

  const startNewGame = () => {
    setPreviousWord(secretWord);
    setSecretWord(pickNewWord(secretWord));
    setGuessedLetters([]);
    setLivesLeft(MAX_LIVES);
  };

  return (
    <div className="page">
      <header className="header">
        <h1 className="title">Hangman</h1>
        <p className="subtitle">
          Pick letters to guess the word. Wrong guesses reduce your lives.
        </p>
      </header>

      <section className="topRow">
        <div className="card">
          <HangmanStage livesLeft={livesLeft} maxLives={MAX_LIVES} />
          <p className="livesText">
            Lives Left: <strong>{livesLeft}</strong> / {MAX_LIVES}
          </p>
        </div>

        <div className="card">
          <h2 className="cardTitle">Word</h2>
          <WordSlots word={secretWord} guessed={guessedLetters} revealAll={isOver} />
          <p className="hint">
            {isOver
              ? "Game ended. Start a new game to play again."
              : "Tip: Choose letters you haven’t tried yet."}
          </p>
        </div>
      </section>

      <section className="card">
        <h2 className="cardTitle">Choose a Letter</h2>
        <LetterPad guessed={guessedLetters} onPickLetter={handlePickLetter} disabled={isOver} />
      </section>

      <section className="card">
        <PickedLetters guessed={guessedLetters} />
        <div className="btnRow">
          <button className="primaryBtn" onClick={startNewGame}>
            New Game
          </button>
        </div>
        <p className="muted small">
          Previous word (for testing): {previousWord ? previousWord : "None yet"}
        </p>
      </section>

      <GamePopup open={isOver} outcome={outcome} word={secretWord} onRestart={startNewGame} />
    </div>
  );
}