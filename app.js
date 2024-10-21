const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const authRoutes = require("./routes/auth");
const path = require("path");

const app = express();

// Set view engine to EJS
app.set("view engine", "ejs");

// Middleware for parsing request body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware for session management
app.use(
  session({
    secret: "secret", // Change this to a secure random string in production
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set true if using HTTPS
  })
);

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

// Middleware for authentication
app.use((req, res, next) => {
  if (!req.session.user && req.path !== "/auth/login" && req.path !== "/auth/register") {
    return res.redirect("/auth/login");
  } else if (req.session.user && req.path === "/") {
    return res.redirect("/auth/profile");
  }
  next();
});

// Authentication routes
app.use("/auth", authRoutes);

// Root route redirect
app.get("/", (req, res) => {
  if (req.session.user) {
    return res.redirect("/auth/profile");
  } else {
    return res.redirect("/auth/login");
  }
});

// Global error handling middleware (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
