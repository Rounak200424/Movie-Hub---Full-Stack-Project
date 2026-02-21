🎬 MovieHub – Full Stack Movie Discovery & Review Platform
📌 Overview

MovieHub is a full-stack web application that allows users to discover movies, like them, and share reviews securely.
It features JWT authentication, Google OAuth login, protected routes, and a MongoDB-powered backend.

The platform integrates with the OMDB API to fetch real-time movie data and provides a clean, interactive user experience.

🚀 Features
🔐 Authentication System
✅ User Signup

New users can create an account using:

Username

Email

Password

Passwords are securely hashed using bcrypt.

JWT token is generated upon successful registration.

✅ User Login

Existing users can log in using email and password.

Credentials are verified securely.

JWT token issued for authenticated sessions.

✅ Google OAuth Login

Users can log in using their Google account.

Google authentication handled using Passport.js.

If user exists → account linked automatically.

If new user → account created seamlessly.

Google profile picture is stored and displayed.

✅ Forgot Password

Users can request a password reset.

Secure token is generated.

Password reset token expires after 10 minutes.

Prevents unauthorized reset attempts.

✅ Logout

JWT token and user session cleared from local storage.

User is logged out instantly.


🎥 Movie Features
🔎 Movie Discovery

Fetches live movie data using OMDB API.

Displays:

Movie Poster

Title

Release Year

Responsive grid layout for smooth browsing.

🔍 Search Functionality

Real-time movie search.

Clears previous results before displaying new ones.

❤️ Like System

Logged-in users can like movies.

Protected route (JWT required).

Like count stored in MongoDB.

Like count dynamically updates.

📝 Review System

Logged-in users can:

Add reviews

Edit their reviews

Delete their reviews

Users cannot modify others’ reviews.

Reviews sorted by latest first.

Secure ownership validation before modification.


👤 Profile System

Displays logged-in username in navbar.

Shows Google profile picture if logged in via Google.

Clean avatar fallback if no profile picture.

Profile dropdown for settings and logout.

🛡 Security Features

Password hashing using bcrypt.

JWT-based authentication.

Protected API routes.

Token-based request validation.

Duplicate user prevention.

Secure MongoDB indexes.

🗄 Database Structure
Users Collection

username

email (unique)

password (hashed)

googleId (optional)

profilePic (optional)

resetToken

resetTokenExpire

Likes Collection

movie title

total likes

Reviews Collection

username

movie title

review text

timestamps

🏗 Project Structure
MovieHub Project
│
├── MovieHub-Full          (Frontend)
│   ├── mainpg.html
│   ├── discover.html
│   ├── review.html
│   ├── mainpg.js
│   └── CSS files
│
└── MovieHub-FullStack     (Backend)
    ├── server.js
    ├── routes/
    ├── models/
    ├── middleware/
    ├── database.js
    └── .env
🧰 Tech Stack
Frontend

HTML5

CSS3

JavaScript (Vanilla JS)

Backend

Node.js

Express.js

MongoDB

Mongoose

Passport.js (Google OAuth)

JWT (JSON Web Token)

bcrypt

Nodemailer (for password reset)

API Integration

OMDB API (for movie data)

⚙️ Installation & Setup
1️⃣ Clone the Repository
git clone https://github.com/YOUR_USERNAME/MovieHub-FullStack.git
2️⃣ Install Backend Dependencies
cd MovieHub-FullStack
npm install
3️⃣ Create .env File
JWT_SECRET=your_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
MONGO_URI=your_mongodb_connection_string
4️⃣ Start Backend
node server.js

Backend runs on:

http://localhost:3000
5️⃣ Run Frontend

Open MovieHub-Full folder
Right-click mainpg.html
Click Open with Live Server

Frontend runs on:

http://localhost:5500
📈 Future Improvements

One-like-per-user enforcement

User dashboard page

Movie recommendation system

Admin panel

Refresh token authentication

Deployment on Render / Vercel

Role-based access control

🎯 Learning Outcomes

This project demonstrates:

Full-stack application architecture

Secure authentication implementation

Google OAuth integration

JWT session handling

MongoDB schema design

REST API development

Protected route implementation

Frontend-backend integration

📌 Author

Developed by Rounak Sarkar

