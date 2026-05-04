# 🔗 URL Shortener Web App
A full-stack URL Shortener application that allows users to create short, shareable links, track clicks, and manage recent URLs with a clean and responsive interface.

## 🚀 Live Demo
🌐 Frontend: https://your-frontend-url.vercel.app
🔗 Backend API: https://your-backend-url.onrender.com

## 🧠 Features
 ✨ Create short links instantly
🔗 Custom alias support
 📊 Track number of clicks
 ⏳ Expiry support for links
 📋 View recently created links
 📱 Responsive UI (mobile-friendly)
 ⚡ Fast redirection system


## 🏗️ Architecture
### 🔹 Frontend (React)

* Form to submit long URLs
* Displays shortened links
* QR code preview (optional)
* Recent links list

### 🔹 Backend (Express.js)

* `POST /shorten` → Create short URL
* `GET /:code` → Redirect to original URL + increment clicks
* `GET /links` → Fetch recent links

### 🔹 Database (MongoDB)
Stores:

* `originalUrl`
* `shortCode`
* `clicks`
* `customAlias`
* `expiresAt`


## 🛠️ Tech Stack

**Frontend:** React, CSS, Axios
**Backend:** Node.js, Express.js
**Database:** MongoDB (Atlas)
**Deployment:** Vercel + Render
**Version Control:** Git & GitHub

## 📁 Project Structure

```
url-shortener/
├── backend/
│   ├── server.js
│   ├── routes/
│   ├── models/
│   └── package.json
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── .gitignore
└── README.md
```



## ⚙️ Setup Instructions

### 🔹 1. Clone the repository

git clone https://github.com/your-username/url-shortener.git
cd url-shortener


### 🔹 2. Backend setup

cd backend
npm install

Create a `.env` file:
MONGO_URI=your_mongodb_connection_string

Run backend:
npm start

### 🔹 3. Frontend setup

1. cd frontend
2. npm install
3. npm run dev


## 🌐 Environment Variables

| Variable  | Description            |
| --------- | ---------------------- |
| MONGO_URI | MongoDB connection URL |

---

## 🚀 Deployment

### 🔹 Backend (Render)

* Root Directory: `backend`
* Build Command: `npm install`
* Start Command: `npm start`

### 🔹 Frontend (Vercel)

* Root Directory: `frontend`
* Auto-detect React app

---

## 🔒 Best Practices

* `.env` files are not pushed to GitHub
* `node_modules` is ignored
* Clean folder structure maintained
* API URLs handled via environment variables


## 🤝 Contributing

Contributions are welcome!
Feel free to fork the repo and submit a pull request.

## 👩‍💻 Author

**Rati Yadav**
* GitHub: https://github.com/rati-yadav


## ⭐ Support
If you like this project, give it a ⭐ on GitHub!

