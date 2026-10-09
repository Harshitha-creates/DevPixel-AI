import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function App() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("Java");
  const [task, setTask] = useState("Find Bugs & Review");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sfxEnabled, setSfxEnabled] = useState(true);

  const playRetroSound = (type) => {
    if (!sfxEnabled) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === "click") {
        osc.type = "square";
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.04);
      } else if (type === "submit") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      }
    } catch (e) {
      // AudioContext unavailable
    }
  };

  const handleSubmit = async () => {
    if (!code.trim()) {
      setOutput("⚠️ Please enter or paste code before submitting analysis!");
      return;
    }

    playRetroSound("submit");
    setLoading(true);
    setOutput("");

    try {
      const res = await fetch(
        "https://devpixel-ai-backend.onrender.com/api/analyze-code",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code, task, language }),
        },
      );

      if (res.ok) {
        const data = await res.json();
        setOutput(data.result || data.output || data.analysis);
      } else {
        setOutput("❌ Server returned an error response.");
      }
    } catch (err) {
      // Fallback preview report if backend server is not running yet
      setOutput(`## ☕ Retro Pixel Analysis Report (Sample Output)

| Section | Status | Recommendation |
| :--- | :---: | :--- |
| **Logic & Correctness** | ✅ | Code structure is sound. Ensure null parameters are guarded. |
| **Edge Cases** | ⚠️ | Consider boundary inputs such as empty lists or zero division. |
| **Performance** | ⚡ | Time complexity is optimal for expected standard workloads. |

### Suggested Refactored Version
\`\`\`java
public class RefactoredCode {
    public static void main(String[] args) {
        System.out.println("Clean, optimized retro code!");
    }
}
\`\`\`
`);
    }
    setLoading(false);
  };

  const handleClear = () => {
    playRetroSound("click");
    setCode("");
  };

  const loadSampleCode = () => {
    playRetroSound("click");
    setCode(`public class PrimeChecker {
    public static void main(String[] args) {
        int num = 29;
        boolean isPrime = true;
        for (int i = 2; i <= num / 2; ++i) {
            if (num % i == 0) {
                isPrime = false;
                break;
            }
        }
        System.out.println(num + (isPrime ? " is prime." : " is not prime."));
    }
}`);
    setLanguage("Java");
  };

  const lineCount = Math.max(code.split("\n").length, 8);
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1).join(
    "\n",
  );

  return (
    <div style={{ maxWidth: "960px", margin: "30px auto", padding: "0 20px" }}>
      {}
      <header
        className="pixel-window"
        style={{
          padding: "12px 16px",
          background: "#f4e4d4",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "32px" }}>☕</span>
          <div>
            <h1
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: "13px",
                margin: 0,
                color: "#121212",
              }}
            >
              PIXEL-AI OS v1.0
            </h1>
            <p style={{ margin: 0, fontSize: "16px", color: "#555" }}>
              Code Explainer & Reviewer Desktop
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <span className="retro-sticker" style={{ background: "#e2f0d9" }}>
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#2e7d32",
                display: "inline-block",
              }}
            ></span>{" "}
            SYSTEM READY
          </span>
          <button
            className="pixel-win-btn"
            style={{
              width: "auto",
              padding: "2px 8px",
              height: "auto",
              fontSize: "12px",
            }}
            onClick={() => setSfxEnabled(!sfxEnabled)}
          >
            {sfxEnabled ? "🔊 SFX: ON" : "🔇 SFX: OFF"}
          </button>
        </div>
      </header>

      {}
      <div className="pixel-window">
        <div className="pixel-header">
          <span>💾 CODE_INPUT_TERMINAL.EXE</span>
          <div style={{ display: "flex", gap: "4px" }}>
            <button className="pixel-win-btn" onClick={handleClear}>
              _
            </button>
            <button className="pixel-win-btn">▢</button>
            <button className="pixel-win-btn close" onClick={handleClear}>
              X
            </button>
          </div>
        </div>

        {/* Toolbar Controls */}
        <div
          style={{
            padding: "12px 16px",
            background: "#f8f1e5",
            borderBottom: "2px solid #121212",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "16px",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <label
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: "10px",
              }}
            >
              LANG:{" "}
              <select
                className="pixel-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="Java">Java</option>
                <option value="JavaScript">JavaScript</option>
                <option value="Python">Python</option>
                <option value="C++">C++</option>
                <option value="TypeScript">TypeScript</option>
              </select>
            </label>

            <label
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: "10px",
              }}
            >
              ACTION:{" "}
              <select
                className="pixel-select"
                value={task}
                onChange={(e) => setTask(e.target.value)}
              >
                <option value="Find Bugs & Review">Find Bugs & Review</option>
                <option value="Explain Code Simply">Explain Code Simply</option>
                <option value="Refactor & Optimize">Refactor & Optimize</option>
              </select>
            </label>
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <button
              className="pixel-btn pixel-btn-secondary"
              onClick={loadSampleCode}
            >
              📄 SAMPLE
            </button>
            <button
              className="pixel-btn pixel-btn-secondary"
              style={{ background: "#f28b82" }}
              onClick={handleClear}
            >
              🗑️ CLEAR
            </button>
          </div>
        </div>

        {/* Textarea Code Box */}
        <div style={{ padding: "16px" }}>
          <div className="code-editor-box">
            <pre className="editor-line-numbers">{lineNumbers}</pre>
            <textarea
              className="pixel-textarea"
              rows={10}
              placeholder="// Paste your code snippet here..."
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>

          <div
            style={{
              marginTop: "16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ fontSize: "16px", fontWeight: "bold" }}>
              {loading
                ? "⏳ Analyzing code snippet..."
                : "⚡ Press Submit to begin retro analysis"}
            </div>
            <button
              className="pixel-btn"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "ANALYZING..." : "⚡ SUBMIT"}
            </button>
          </div>
        </div>
      </div>

      {}
      {(output || loading) && (
        <div className="pixel-window">
          <div className="pixel-header" style={{ background: "#3a5a40" }}>
            <span>📋 ANALYSIS_REPORT_VIEWER.LOG</span>
            <button
              className="pixel-win-btn close"
              onClick={() => setOutput("")}
            >
              X
            </button>
          </div>
          <div style={{ padding: "20px" }}>
            {loading ? (
              <div style={{ textAlign: "center", padding: "30px 0" }}>
                <p
                  style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: "12px",
                    color: "#2b4c7e",
                  }}
                >
                  ⏳ COMPUTING PIXEL REPORT...
                </p>
              </div>
            ) : (
              <div className="markdown-body">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {output}
                </ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      )}

      {}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "15px",
          flexWrap: "wrap",
          marginTop: "20px",
        }}
      >
        <span className="retro-sticker" style={{ transform: "rotate(-2deg)" }}>
          ☕ COFFEE & CODE
        </span>
        <span
          className="retro-sticker"
          style={{ transform: "rotate(2deg)", background: "#e1f5fe" }}
        >
          &lt;div&gt; PIXEL PERFECT
        </span>
        <span
          className="retro-sticker"
          style={{ transform: "rotate(-1deg)", background: "#ffebee" }}
        >
          404 BUGS NOT FOUND
        </span>
      </div>
    </div>
  );
}

export default App;
