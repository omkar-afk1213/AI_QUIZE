# AI Quiz Project

This project is a college-level AI-based quiz web application built with React, Vite, and Express.

## Features
- Generate AI-based multiple choice quiz questions
- Choose topic, difficulty, and number of questions
- Quiz flow with score calculation
- Backend fallback when an AI key is not configured
- Suitable for a final year college project

## Tech Stack
- Frontend: React + Vite
- Backend: Node.js + Express
- AI API: OpenRouter / OpenAI-compatible endpoint

## Project Structure
- `server.js` - Express backend API
- `src/App.jsx` - Main quiz UI
- `src/App.css` - Styling for the frontend
- `.env.example` - API environment variable template

## Setup
1. Install dependencies:
   npm install
2. Copy the environment file:
   copy .env.example .env
3. Add your OpenRouter or OpenAI API key in `.env` if available.
4. Start the app:
   npm run dev

The frontend runs on http://localhost:5173 and the backend runs on http://localhost:5000.

## Important Note
If no API key is configured, the app still works using a built-in fallback quiz generator so the project runs locally.
