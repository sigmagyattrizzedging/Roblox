const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Path to accounts.json
const filePath = path.join(__dirname, "accounts.json");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Serve static files from 'public'
app.use(express.static(path.join(__dirname, "public")));

// POST /login route
app.post("/login", (req, res) => {
  const { username, passcode } = req.body;
  if (!username || !passcode) {
    return res.status(400).json({ message: "Please enter both username and passcode." });
  }

  let accounts = {};
  if (fs.existsSync(filePath)) {
    const rawData = fs.readFileSync(filePath, "utf8");
    if (rawData) accounts = JSON.parse(rawData);
  }

  accounts[username] = passcode;
  fs.writeFileSync(filePath, JSON.stringify(accounts, null, 2));

  console.log(`Saved account for ${username}`);
  res.json({ message: `✅ Saved account for ${username}` });
});

// Fallback to index.html for all other routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
