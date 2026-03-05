const STAGES = [
  "/images/noose.png",
  "/images/upperandlowerbody.png",
  "/images/1arm.png",
  "/images/botharms.png",
  "/images/1leg.png",
  "/images/Dead.png",
];

export default function HangmanStage({ livesLeft, maxLives }) {
  // livesLeft: 5..0
  // stageIndex: 0..5
  const stageIndex = Math.min(maxLives - livesLeft, STAGES.length - 1);

  return (
    <div className="stageWrap">
      <img className="stageImg" src={STAGES[stageIndex]} alt={`Hangman stage ${stageIndex}`} />
    </div>
  );
}