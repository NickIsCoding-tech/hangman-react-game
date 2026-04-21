# Hangman Game V2

## Overview

This project is an upgraded Hangman game built using React, Vite, Express, DynamoDB Local, and Docker Compose.
It allows users to log in by name, track wins and losses, and view their win percentage in real time.

## Features
Player login system
Checks if player exists in database (GET request)
Creates new player if not found (POST request)
Tracks wins and losses
Calculates and displays win percentage
Updates player stats when the game ends (PUT request)
Dockerized frontend, backend, and database
Unit testing for both UI and API


## Technologies used
React
Vite
JavaScript
Express.js
DynamoDB Local
Docker & Docker Compose
Vitest + React Testing Library (Frontend Testing)
Jest + Supertest (Backend Testing)

## How to Run the Project
Start the full application
docker compose up --build
Access Points
Frontend: http://localhost:5173
Backend API: http://localhost:3001
DynamoDB Local: http://localhost:8000

## API Endpoints
### Create Player

POST /api/players

{
  "playerName": "Nick"
}
### Get Player

GET /api/player?playerName=Nick

### Update Player Stats

PUT /api/player

{
  "playerName": "Nick",
  "wins": 2,
  "losses": 1
}
### How It Works
1. User enters a name and logs in.
2. The frontend sends a GET request to check if the player exists.
3. If not found, a POST request creates a new player.
4. The player's stats are displayed on the screen.
5. When the game ends:
* Stats are updated locally in React
* A PUT request updates the database
6. The UI updates automatically with new stats.

## Testing
### Frontend Test (UI)
npx vitest --run

Tests:

Verifies login input renders
Verifies login button renders

### Backend Test (API)
cd api
npm test

Tests:

GET route validation
POST route validation
PUT route validation
Docker Setup

## The application uses Docker Compose to run:

React frontend
Express backend
DynamoDB Local (in-memory)

To restart clean:

docker compose down -v
docker compose up --build
Git Branch

### This project was completed on the following branch:

feature/player-stats

Submission Checklist

Working frontend (login + game)

Working backend API (GET, POST, PUT)

DynamoDB Local integration

Docker Compose setup

Unit tests (frontend + backend)

Updated README

Code pushed to GitHub branch

Demo Summary

## This project demonstrates:

Full-stack integration using React and Express
REST API design with GET, POST, and PUT
State management in React
Database interaction using DynamoDB Local
Containerized development with Docker
Basic unit testing for both frontend and backend