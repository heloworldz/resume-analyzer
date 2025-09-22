const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");

const app = express();
app.use(cors());
app.use(express.json());

// Set up multer for file uploads
const upload = multer({ dest: "uploads/" });

// Skill list
const SKILLS = ["Python", "JavaScript", "Node.js", "React", "MongoDB", "Express", "REST APIs", "C++", "Java", "SQL"];

// Escape regex special characters
function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Extract skills
function extractSkills(text) {
  return SKILLS.filter(skill => new RegExp(`\\b${escapeRegex(skill)}\\b`, "i").test(text));
}

// Estimate experience
function estimateExperience(text) {
  const regexMonths = /(\d+)\s*months?/gi;
  const regexYears = /(\d+)\s*years?/gi;
  let totalMonths = 0;

  let match;
  while ((match = regexMonths.exec(text)) !== null) totalMonths += parseInt(match[1]);
  while ((match = regexYears.exec(text)) !== null) totalMonths += parseInt(match[1]) * 12;

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  if (years === 0 && months === 0) return "Less than 1 month";
  if (months === 0) return `${years} year${years > 1 ? "s" : ""}`;
  if (years === 0) return `${months} month${months > 1 ? "s" : ""}`;
  return `${years} year${years > 1 ? "s" : ""} ${months} month${months > 1 ? "s" : ""}`;
}

// Extract education
function extractEducation(text) {
  const eduMatches = text.match(/BCA|MCA|B\.Tech|M\.Tech|MBA|Ph\.D/i);
  return eduMatches ? eduMatches[0] : "Not found";
}

// Generate summary
function generateSummary(skills, education, experience) {
  return `Strong in ${skills.join(", ")} with ${education} education and ${experience} experience.`;
}

// Route to analyze uploaded file
app.post("/analyze-file", upload.single("resume"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded." });

  let resumeText = "";

  try {
    if (req.file.mimetype === "application/pdf") {
      const dataBuffer = fs.readFileSync(req.file.path);
      const data = await pdfParse(dataBuffer);
      resumeText = data.text;
    } else if (req.file.mimetype ===
               "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      const data = await mammoth.extractRawText({ path: req.file.path });
      resumeText = data.value;
    } else {
      return res.status(400).json({ error: "Unsupported file format." });
    }

    const skills = extractSkills(resumeText);
    const experience = estimateExperience(resumeText);
    const education = extractEducation(resumeText);
    const summary = generateSummary(skills, education, experience);

    res.json({ skills, experience, education, summary });

  } catch (err) {
    console.error("File parsing error:", err);
    res.status(500).json({ error: "Failed to parse resume." });
  } finally {
    // Clean up uploaded file
    fs.unlinkSync(req.file.path);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
