### Hangman Game (React + Docker)

## Project Overview

This project is a Hangman game built using React and Vite. The player guesses letters to reveal a hidden word before the hangman drawing is completed. The game includes multiple React components, interactive letter selection, and visual updates based on the player's guesses.

The application is containerized using Docker so it can run consistently across different environments.

## Features

Displays the current Hangman stage with images

Allows users to select letters

Shows previously chosen letters

Displays the hidden word with blanks

Pop-up message when the player wins or loses

New Game button to restart the game

Built with multiple React components

## Technologies Used

React

Vite

JavaScript

HTML / CSS

Docker

Node.js

# Installation (Run Locally)

Clone the repository:

git clone https://github.com/YOUR_USERNAME/hangman-react-game.git
cd hangman-react-game

## Install dependencies:

npm install

## Start the development server:

npm run dev

## Open the browser at:

http://localhost:5173

# Running the Application with Docker

## Build the Docker image:

docker build -t hangman-game .

## Run the container:

docker run -p 5173:5173 hangman-game

## Then open:

http://localhost:5173