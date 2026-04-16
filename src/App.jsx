import { useMemo, useState, useEffect } from "react";
import Login from "./Login";
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
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [gameRecorded, setGameRecorded] = useState(false);

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
  setSecretWord(pickNewWord(secretWord));
  setGuessedLetters([]);
  setLivesLeft(MAX_LIVES);
  setGameRecorded(false);
  };

  async function handleLogin(playerName) {
  try {
    const response = await fetch(
      `http://localhost:3001/api/player?playerName=${encodeURIComponent(playerName)}`
    );

    if (response.ok) {
      const data = await response.json();
      setCurrentPlayer(data.item);
      setIsLoggedIn(true);
      return;
    }

    if (response.status === 404) {
      const createResponse = await fetch("http://localhost:3001/api/players", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ playerName }),
      });

      if (createResponse.ok) {
        const createData = await createResponse.json();
        setCurrentPlayer(createData.item);
        setIsLoggedIn(true);
      }
    }
  } catch (error) {
    console.error("Login error:", error);
  }
}

async function updatePlayerStats(didWin) {
  if (!currentPlayer) return;

  const updatedPlayer = {
    ...currentPlayer,
    wins: didWin ? currentPlayer.wins + 1 : currentPlayer.wins,
    losses: didWin ? currentPlayer.losses : currentPlayer.losses + 1,
  };

  const totalGames = updatedPlayer.wins + updatedPlayer.losses;
  updatedPlayer.winPercentage =
    totalGames === 0 ? 0 : Number(((updatedPlayer.wins / totalGames) * 100).toFixed(1));

  setCurrentPlayer(updatedPlayer);

  try {
    await fetch("http://localhost:3001/api/player", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        playerName: updatedPlayer.playerName,
        wins: updatedPlayer.wins,
        losses: updatedPlayer.losses,
      }),
    });
  } catch (error) {
    console.error("Failed to update player stats:", error);
  }
}

useEffect(() => {
  if (!isLoggedIn || !currentPlayer || gameRecorded) return;
  if (isWin) {
    updatePlayerStats(true);
    setGameRecorded(true);
  } else if (isLose) {
    updatePlayerStats(false);
    setGameRecorded(true);
  }
}, [isWin, isLose, isLoggedIn, currentPlayer, gameRecorded]);

  return (
    <div className="page">
      <header className="header">
        <h1 className="title">Hangman</h1>
        <p className="subtitle">
          Pick letters to guess the word. Wrong guesses reduce your lives.
        </p>
      </header>

      {!isLoggedIn ? (
      <Login onLogin={handleLogin} />
    ) : (
      <section className="card">
        <h2 className="cardTitle">Current Player</h2>
        <p><strong>Name:</strong> {currentPlayer?.playerName}</p>
        <p><strong>Wins:</strong> {currentPlayer?.wins}</p>
        <p><strong>Losses:</strong> {currentPlayer?.losses}</p>
        <p><strong>Win Percentage:</strong> {currentPlayer?.winPercentage}%</p>
      </section>
    )}

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
      </section>

      <GamePopup open={isOver} outcome={outcome} word={secretWord} onRestart={startNewGame} />
    </div>
  );
}