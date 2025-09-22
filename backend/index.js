// backend/index.js
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/analyze", (req, res) => {
  const { resumeText } = req.body;
  if (!resumeText || resumeText.trim() === "") {
    return res.status(400).json({ error: "Resume text cannot be empty." });
  }

  // MOCK RESPONSE
  res.json({
    skills: ["Python", "Node.js", "JavaScript"],
    experience: "2 years",
    education: "BCA",
    summary: "Strong in backend development and full-stack JavaScript."
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
