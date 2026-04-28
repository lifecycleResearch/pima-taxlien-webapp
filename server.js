const express = require("express");
const path = require("path");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

// Serve static files from React build
app.use(express.static(path.join(__dirname, "client/dist")));

// API routes - proxy to Vercel
app.use("/api", createProxyMiddleware({
  target: "https://pima-taxlien-webapp.vercel.app",
  changeOrigin: true
}));

// All other routes serve React app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/dist/index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
