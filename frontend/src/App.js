import React, { useState } from "react";
import axios from "axios";

function App() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [result, setResult] = useState("");

  const handleFileChange = (e) => setFile(e.target.files[0]);
  const handleTextChange = (e) => setText(e.target.value);

  const uploadResume = async () => {
    if (!file) return alert("Select a file first");
    const formData = new FormData();
    formData.append("resume", file);
    const res = await axios.post("http://localhost:3000/upload", formData);
    alert(res.data.message);
  };

  const analyzeText = async () => {
    const res = await axios.post("http://localhost:3000/analyze", { resumeText: text });
    setResult(JSON.stringify(res.data, null, 2));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>AI-Powered Resume Analyzer</h2>
      <div>
        <h3>Upload Resume</h3>
        <input type="file" onChange={handleFileChange} />
        <button onClick={uploadResume}>Upload</button>
      </div>
      <div style={{ marginTop: "20px" }}>
        <h3>Or Paste Resume Text</h3>
        <textarea rows="10" cols="50" onChange={handleTextChange}></textarea>
        <br />
        <button onClick={analyzeText}>Analyze</button>
      </div>
      <div style={{ marginTop: "20px" }}>
        <h3>Analysis Result</h3>
        <pre>{result}</pre>
      </div>
    </div>
  );
}

export default App;
