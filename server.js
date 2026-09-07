const path = require("path");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// In-memory data store (resets on restart)
const messages = [];

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

app.get("/api/messages", (req, res) => {
  res.json(messages);
});

app.post("/api/messages", (req, res) => {
  const text = (req.body && req.body.text ? String(req.body.text) : "").trim();
  if (!text) {
    return res.status(400).json({ error: "text is required" });
  }
  const message = { id: messages.length + 1, text, createdAt: new Date().toISOString() };
  messages.push(message);
  res.status(201).json(message);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
