## Project Title
Listora – Grocery List & Budget Tracker App

## Project Overview
- Listaura is a full-stack web application that helps users manage their grocery lists, track spending, and maintain a pantry. The app allows users to:
- Register and log in securely
- Create, view, and delete grocery lists
- Add items to lists with prices
- Track purchased items and move them to a pantry
- Set budgets for each list and monitor spent vs remaining
- Manage pantry items with optional expiry dates
- Enjoy a responsive and visually appealing interface
- The app is built using React, Node.js, Express, and Supabase as the backend database.

## Features Implemented
- User Features
- User registration and login with JWT authentication
- Create multiple grocery lists
- Add and delete items in lists
- Mark items as purchased, which moves them to the pantry automatically
- Track spending and budget per list
- Pantry management
- Responsive UI with Tailwind CSS

## Tech Stack
Frontend :-	React, React Router, Tailwind CSS, Axios
Backend	:- Node.js, Express, JWT, Supabase client
Database :-	Supabase (PostgreSQL)
Hosting	Frontend:- Netlify, Backend:- Render
Authentication :-	JWT Tokens

## Installation Steps
- Navigate to frontend folder:
cd Grocery-list-frontend

- Install dependencies:
npm install
Update API base URL in services/api.js:
const API = axios.create({
  baseURL: " "https://grocery-list-backend-h6ww.onrender.com",
",
});

- Start the development server:
npm run dev
Pages:
/ → Landing page
/login → Login
/register → Register
/dashboard → Dashboard
/add-list → Add list page
/list/:id → List details
/pantry → Pantry

## Deployment Link
(https://effortless-dasik-e5075c.netlify.app/)

## Backend API link
(https://grocery-list-backend-h6ww.onrender.com)

## Login credential (no credential needed)

## Screenshots
 ![Screenshot of landingpage] (src/Screenshots/landingPage.jpg)
 ![Screenshot of landingpage] (src/Screenshots/Registration.jpg)
 ![Screenshot of landingpage] (src/Screenshots/Login.jpg)
 ![Screenshot of landingpage] (src/Screenshots/Dashboard.jpg)
 ![Screenshot of landingpage] (src/Screenshots/Listdetails.jpg)
 ![Screenshot of landingpage] (src/Screenshots/Pantry.jpg)

 ## video walkthrough
 ![Video Walkthrough Link] (https://drive.google.com/file/d/1TibXUJUtwqYjecd7o1jAj40t234pfH3N/view?usp=sharing)
