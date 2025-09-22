// backend/index.js
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Example list of skills to search for
const SKILLS = [
  "Python",
  "JavaScript",
  "Node.js",
  "React",
  "MongoDB",
  "Express",
  "REST APIs",
  "C++",
  "Java",
  "SQL"
];

// Function to escape regex special characters
function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Function to estimate experience from text
function estimateExperience(text) {
  const regexMonths = /(\d+)\s*months?/gi;
  const regexYears = /(\d+)\s*years?/gi;
  let totalMonths = 0;

  let match;
  while ((match = regexMonths.exec(text)) !== null) {
    totalMonths += parseInt(match[1]);
  }
  while ((match = regexYears.exec(text)) !== null) {
    totalMonths += parseInt(match[1]) * 12;
  }

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  if (years === 0 && months === 0) return "Less than 1 month";
  if (months === 0) return `${years} year${years > 1 ? "s" : ""}`;
  if (years === 0) return `${months} month${months > 1 ? "s" : ""}`;
  return `${years} year${years > 1 ? "s" : ""} ${months} month${months > 1 ? "s" : ""}`;
}

// Function to extract skills from resume text
function extractSkills(text) {
  const foundSkills = SKILLS.filter(skill =>
    new RegExp(`\\b${escapeRegex(skill)}\\b`, "i").test(text)
  );
  return foundSkills;
}

// Function to extract education (simple keyword search)
function extractEducation(text) {
  const eduMatches = text.match(/BCA|MCA|B\.Tech|M\.Tech|MBA|Ph\.D/i);
  return eduMatches ? eduMatches[0] : "Not found";
}

// Simple summary generator
function generateSummary(skills, education, experience) {
  return `Strong in ${skills.join(", ")} with ${education} education and ${experience} experience.`;
}

app.post("/analyze", (req, res) => {
  const { resumeText } = req.body;
  if (!resumeText || resumeText.trim() === "") {
    return res.status(400).json({ error: "Resume text cannot be empty." });
  }

  const skills = extractSkills(resumeText);
  const experience = estimateExperience(resumeText);
  const education = extractEducation(resumeText);
  const summary = generateSummary(skills, education, experience);

  res.json({ skills, experience, education, summary });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
