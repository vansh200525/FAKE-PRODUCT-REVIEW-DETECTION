import { useState } from "react";
import axios from "axios";
import FeatureCard from "../components/FeatureCard";
import ResultPanel from "../components/ResultPanel";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const HOW_IT_WORKS = [
  { number:"1", color:"#3b82f6", title:"Paste Product Link",     description:"Users enter the product link from an eCommerce site, and our system automatically fetches reviews." },
  { number:"2", color:"#4ade80", title:"Web Scraping",           description:"Our system extracts reviews using web scraping, collecting text data for analysis." },
  { number:"3", color:"#f59e0b", title:"AI Review Analysis",     description:"The machine learning model analyzes reviews and detects fake vs. genuine reviews." },
  { number:"4", color:"#ef4444", title:"Fake Review Detection",  description:"The system flags fake reviews, improving online shopping safety for users." },
  { number:"5", color:"#a855f7", title:"Trust Score Calculation",description:"Compare customer ratings and reviews to determine an accurate authenticity score." },
  { number:"6", color:"#06b6d4", title:"Final Result",           description:"Users see a final rating, showing if the product is genuine or fake." },
];

const TECHNOLOGIES = [
  { icon:"🌐", title:"Web Scraping & Data Collection",        description:"Tools like BeautifulSoup, Selenium, and Requests extract product reviews and ratings from eCommerce websites." },
  { icon:"📝", title:"Natural Language Processing (NLP)",     description:"TF-IDF is used to convert textual reviews into numerical representations for further analysis." },
  { icon:"🤖", title:"Machine Learning Classification",       description:"Logistic Regression, Random Forest, and SVM classify reviews as real or fake based on linguistic features." },
  { icon:"🧠", title:"Deep Learning for Advanced Detection",  description:"LSTM is used to detect context-based fake reviews by analyzing sentiment inconsistencies and patterns." },
  { icon:"🚀", title:"Model Deployment & API",                description:"The trained model is deployed using FastAPI, allowing real-time review analysis through a REST API." },
];

export default function Working() {
  const [activeTab,  setActiveTab]  = useState("link");
  const [reviewText, setReviewText] = useState("");
  const [csvFile,    setCsvFile]    = useState(null);
  const [loading,    setLoading]    = useState(false);
  const [result,     setResult]     = useState(null);
  const [error,      setError]      = useState("");

  const handleAnalyze = async () => {
    setError(""); setResult(null); setLoading(true);
    try {
      if (activeTab === "link") {
        if (!reviewText.trim()) { setError("Please enter a product link or paste a review text."); setLoading(false); return; }
        const res = await axios.post(`${API_URL}/api/predict`, { review_text: reviewText });
        setResult(res.data);
      } else {
        if (!csvFile) { setError("Please choose a CSV file first."); setLoading(false); return; }
        const fd = new FormData();
        fd.append("file", csvFile);
        const res = await axios.post(`${API_URL}/api/predict-csv`, fd);
        setResult(res.data);
      }
    } catch (e) {
      setError(e.response?.data?.detail || "Connection failed — make sure the backend is running on port 8000.");
    } finally { setLoading(false); }
  };

  const handleReset = () => { setResult(null); setError(""); setReviewText(""); setCsvFile(null); };

  return (
    <main>
      {/* HOW IT WORKS */}
      <section className="section-mid" style={{ padding:"70px 0" }}>
        <div className="container">
          <p style={{ textAlign:"center", fontSize:11, color:"#4ade80", letterSpacing:"0.12em", fontWeight:700, marginBottom:8 }}>Try Now & Verify the Authenticity of Your Next Purchase!</p>
          <h2 style={{ textAlign:"center", fontSize:30, fontWeight:700, marginBottom:48 }}>How Our System Works</h2>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20 }}>
            {HOW_IT_WORKS.map(({ number, color, title, description }) => (
              <div key={number} style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.09)", borderRadius:12, padding:24 }}>
                <div style={{ width:34, height:34, borderRadius:8, background:color+"22", border:`1.5px solid ${color}`, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, color, fontSize:14, marginBottom:14 }}>{number}</div>
                <h3 style={{ fontSize:14, fontWeight:700, marginBottom:8 }}>{title}</h3>
                <p style={{ fontSize:13, color:"rgba(255,255,255,0.55)", lineHeight:1.7 }}>{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DETECTION INTERFACE */}
      <section className="section-offwhite" style={{ padding:"70px 0" }}>
        <div className="container">
          <p style={{ textAlign:"center", fontSize:11, color:"#1a6b3c", letterSpacing:"0.12em", fontWeight:700, marginBottom:8 }}>Detect Fake Reviews & Ensure Authenticity</p>
          <h2 style={{ textAlign:"center", fontSize:28, fontWeight:700, marginBottom:12, color:"#111" }}>AI-Powered Fake Product Detection</h2>
          <p style={{ textAlign:"center", color:"#666", fontSize:13, maxWidth:600, margin:"0 auto 40px", lineHeight:1.7 }}>
            Uncover fake product reviews with our advanced AI-based detection system. By analyzing customer feedback, sentiment patterns, and rating inconsistencies, our model provides an accurate authenticity score.
          </p>
          <div style={{ maxWidth:580, margin:"0 auto" }}>
            {/* Tabs */}
            <div style={{ display:"flex", border:"1px solid #ddd", borderRadius:10, overflow:"hidden", marginBottom:24 }}>
              <button className={activeTab==="csv"  ? "tab-active" : "tab-inactive"} onClick={() => { setActiveTab("csv");  setResult(null); setError(""); }}>Analyze via Scraped CSV File</button>
              <button className={activeTab==="link" ? "tab-active" : "tab-inactive"} onClick={() => { setActiveTab("link"); setResult(null); setError(""); }}>Analyze Product via Link</button>
            </div>
            {/* Input card */}
            <div style={{ background:"#0d1f17", borderRadius:14, padding:28, color:"#fff" }}>
              {activeTab === "csv" ? (
                <>
                  <h3 style={{ fontSize:15, fontWeight:700, marginBottom:8 }}>Upload CSV File</h3>
                  <p style={{ fontSize:12, color:"rgba(255,255,255,0.5)", marginBottom:18, lineHeight:1.7 }}>Upload a CSV file containing product reviews and ratings.</p>
                  <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                    <label style={{ flex:1, padding:"10px 14px", background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:8, fontSize:13, cursor:"pointer", color: csvFile ? "#fff" : "rgba(255,255,255,0.35)" }}>
                      {csvFile ? csvFile.name : "Choose File  No file chosen"}
                      <input type="file" accept=".csv" onChange={e => setCsvFile(e.target.files[0])} style={{ display:"none" }} />
                    </label>
                    <button onClick={handleAnalyze} disabled={loading} className="btn-primary">{loading ? <span className="spinner"/> : "Upload"}</button>
                    <button onClick={handleReset} className="btn-danger">Reset</button>
                  </div>
                </>
              ) : (
                <>
                  <h3 style={{ fontSize:15, fontWeight:700, marginBottom:8 }}>Enter Actual Product Link or Review Text</h3>
                  <p style={{ fontSize:12, color:"rgba(255,255,255,0.5)", marginBottom:18, lineHeight:1.7 }}>Paste a review text or product link. The system will detect if it is fake.</p>
                  <div style={{ display:"flex", gap:10 }}>
                    <input className="input-dark" value={reviewText} onChange={e => setReviewText(e.target.value)} placeholder="https://www.flipkart.com/... or paste review text here" onKeyDown={e => e.key==="Enter" && handleAnalyze()} />
                    <button onClick={handleAnalyze} disabled={loading} className="btn-primary">{loading ? <span className="spinner"/> : "Analyze"}</button>
                    <button onClick={handleReset} className="btn-danger">Reset</button>
                  </div>
                </>
              )}
              {error && <p style={{ color:"#f87171", fontSize:13, marginTop:14 }}>⚠️ {error}</p>}
              <ResultPanel result={result} />
            </div>
          </div>
        </div>
      </section>

      {/* TECHNOLOGIES */}
      <section className="section-mid" style={{ padding:"70px 0" }}>
        <div className="container">
          <h2 style={{ textAlign:"center", fontSize:26, fontWeight:700, marginBottom:48 }}>Technologies &amp; Algorithms Used</h2>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20 }}>
            {TECHNOLOGIES.map(t => <FeatureCard key={t.title} {...t} />)}
          </div>
        </div>
      </section>
    </main>
  );
}
