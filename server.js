import express from "express";
import cors from "cors";
import fs from "fs";

const app = express();
app.use(cors());
app.use(express.json());

const USERS_FILE = "./users.json";

// 🧠 Helper functions
function loadUsers() {
  if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, "[]");
  return JSON.parse(fs.readFileSync(USERS_FILE));
}

function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// 📝 Sign Up
app.post("/signup", (req, res) => {
  const { username, password, email } = req.body;
  let users = loadUsers();

  if (users.find(u => u.username === username || u.email === email)) {
    return res.json({ success: false, message: "❌ Username or Email already exists" });
  }

  users.push({ username, email, password, coins: 0 });
  saveUsers(users);

  res.json({ success: true, message: "✅ Account created!" });
});

// 🔐 Login
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  let users = loadUsers();
  const user = users.find(
    u => (u.username === username || u.email === username) && u.password === password
  );

  if (!user) return res.json({ success: false, message: "❌ Invalid credentials" });

  res.json({
    success: true,
    data: {
      username: user.username,
      email: user.email,
      coins: user.coins
    }
  });
});

// 🪙 Get user data by username (optional)
app.get("/user/:username", (req, res) => {
  let users = loadUsers();
  const user = users.find(u => u.username === req.params.username);
  if (!user) return res.json({ success: false, message: "User not found" });

  res.json({
    success: true,
    data: {
      username: user.username,
      email: user.email,
      coins: user.coins
    }
  });
});

// 🧪 Root
app.get("/", (req, res) => {
  res.send("🚀 PlayCentrix Auth API is live!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
