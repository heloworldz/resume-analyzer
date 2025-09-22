import React, { useState } from "react";
import axios from "axios";
import "./App.css"; // Styles

function App() {
  const [resumeText, setResumeText] = useState("");
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Analyze pasted text
  const analyzeText = async () => {
    if (!resumeText.trim()) {
      setError("Please enter some resume text.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await axios.post("http://localhost:3000/analyze", {
        resumeText,
      });
      setAnalysis(response.data);
    } catch (err) {
      setError("Analysis failed. Please try again.");
      console.error(err);
    }
    setLoading(false);
  };

  // Analyze uploaded PDF/DOCX file
  const uploadResume = async () => {
    if (!file) return alert("Select a file first!");

    const formData = new FormData();
    formData.append("resume", file);

    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        "http://localhost:3000/analyze-file",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setAnalysis(response.data);
    } catch (err) {
      setError("File analysis failed. Check console.");
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="App">
      <h1>AI-Powered Resume Analyzer</h1>

      <section>
        <h2>Paste Resume Text</h2>
        <textarea
          placeholder="Paste your resume here..."
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
        />
        <button onClick={analyzeText} disabled={loading}>
          {loading ? "Analyzing..." : "Analyze Text"}
        </button>
      </section>

      <hr />

      <section>
        <h2>Upload Resume (PDF / DOCX)</h2>
        <input
          type="file"
          accept=".pdf,.docx"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button onClick={uploadResume} disabled={loading}>
          {loading ? "Analyzing..." : "Upload & Analyze"}
        </button>
      </section>

      {error && <p className="error">{error}</p>}

      {analysis && (
        <div className="analysis-result">
          <h2>Analysis Result</h2>
          <p><strong>Education:</strong> {analysis.education}</p>
          <p><strong>Experience:</strong> {analysis.experience}</p>
          <p><strong>Skills:</strong> {analysis.skills.join(", ")}</p>
          <p><strong>Summary:</strong> {analysis.summary}</p>
        </div>
      )}
    </div>
  );
}

export default App;
