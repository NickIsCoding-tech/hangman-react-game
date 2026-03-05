export const WORD_BANK = [
  "APPLE",
  "BANANA",
  "ORANGE",
  "PIZZA",
  "BURGER",
  "TIGER",
  "LION",
  "HORSE",
  "MONKEY",
  "ZEBRA",
  "BREAD",
  "CHEESE",
  "COOKIE",
  "DONUT",
  "CANDY",
  "OCEAN",
  "RIVER",
  "ISLAND",
  "FOREST",
  "MOUNTAIN",
  "SUNSHINE",
  "RAINBOW",
  "GUITAR",
  "SOCCER",
  "BASKETBALL"
];

export function pickNewWord(prevWord = "") {
  if (WORD_BANK.length === 0) return "REACT";

  let next = prevWord;
  
  if (WORD_BANK.length === 1) return WORD_BANK[0];

  while (next === prevWord) {
    next = WORD_BANK[Math.floor(Math.random() * WORD_BANK.length)];
  }
  return next.toUpperCase();
}