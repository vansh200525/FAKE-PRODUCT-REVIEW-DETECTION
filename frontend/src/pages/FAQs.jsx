import { useState } from "react";

const FAQS = [
  { q:"How does the Fake Product Detection System work?",             a:"Our system uses machine learning to analyze customer reviews and ratings, identifying inconsistencies that may indicate fake products. It combines TF-IDF, Random Forest, XGBoost, and LSTM models." },
  { q:"What data does the system analyze?",                           a:"The system analyzes text reviews, star ratings, review frequency, reviewer history, sentiment patterns, lexical diversity, and many other linguistic features." },
  { q:"Can the system detect fake reviews in real-time?",             a:"Yes! Our system processes reviews within seconds using our FastAPI backend and pre-trained ML models." },
  { q:"How does the system differentiate between fake and genuine?",  a:"It uses NLP to detect unusual language patterns, TF-IDF for keyword analysis, LSTM for context-based anomaly detection, and handcrafted features like exclamation count and capital ratio." },
  { q:"What criteria determine if a product is fake?",               a:"High fake review percentage (above 60%), inflated ratings, repetitive or overly positive language, sudden review spikes, and unverified purchases all contribute." },
  { q:"What measures are taken to prevent false positives?",          a:"We use a Voting Ensemble of three models (LR + RF + XGB) with cross-validation and class-balanced training to minimize false positives." },
  { q:"Does the system provide a confidence score?",                  a:"Yes! Every prediction includes a confidence score (0–100%) and a visual semicircle gauge showing both Fake % and Genuine % breakdown." },
  { q:"Does the system support multiple languages?",                  a:"Currently optimized for English. Multi-language support is on our roadmap for future updates." },
  { q:"How accurate is the fake product detection?",                  a:"Our Voting Ensemble achieves approximately 92% accuracy on the test set with an AUC-ROC of 0.97." },
  { q:"Which eCommerce platforms are supported?",                     a:"Currently Amazon and Flipkart reviews are supported via CSV upload. Direct URL scraping support is coming soon." },
  { q:"How can I upload a product review file?",                      a:"Go to the Working page, select 'Analyze via Scraped CSV File', choose your CSV file (must have a 'text' column) and click Upload." },
  { q:"What happens if a product is marked as fake?",                 a:"The system displays the fake %, shows a red gauge needle, flags suspicious reviews, and highlights key influencing words." },
  { q:"Can I trust the system's results?",                            a:"The system is highly accurate but should be used as a guide alongside your own judgment. No automated system is 100% perfect." },
];

export default function FAQs() {
  const [openIndex, setOpenIndex] = useState(0);
  const toggle = (i) => setOpenIndex(openIndex === i ? -1 : i);

  return (
    <main>
      <section className="section-offwhite" style={{ padding:"70px 0", minHeight:"85vh" }}>
        <div className="container" style={{ maxWidth:820 }}>
          <h2 style={{ textAlign:"center", fontSize:28, fontWeight:700, marginBottom:8, color:"#111" }}>Frequently Asked Questions</h2>
          <p style={{ textAlign:"center", color:"#888", fontSize:13, marginBottom:48 }}>Everything you need to know about the Fake Review Detection System.</p>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {FAQS.map(({ q, a }, i) => (
              <div key={q} style={{ border:"1px solid #ddd", borderRadius:8, overflow:"hidden", background:"#fff", boxShadow: openIndex===i ? "0 4px 16px rgba(0,0,0,0.06)" : "none" }}>
                <button onClick={() => toggle(i)} style={{ width:"100%", padding:"16px 20px", display:"flex", justifyContent:"space-between", alignItems:"center", background:"none", border:"none", cursor:"pointer", fontSize:14, fontWeight:600, textAlign:"left", gap:16, color:"#111", fontFamily:"'DM Sans',sans-serif" }}>
                  {q}
                  <span style={{ fontSize:20, color:"#1a6b3c", flexShrink:0, transition:"transform 0.2s", transform: openIndex===i ? "rotate(45deg)" : "rotate(0deg)", lineHeight:1 }}>+</span>
                </button>
                {openIndex===i && (
                  <div style={{ padding:"0 20px 18px", paddingTop:14, fontSize:13, color:"#555", lineHeight:1.75, borderTop:"1px solid #f0f0f0" }} className="fade-up">{a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
