import { Link } from "react-router-dom";
import StatCard from "../components/StatCard";

const STATS = [
  { icon:"🛒", number:"1.8M+",  label:"Scammed Shoppers in 2023" },
  { icon:"🔍", number:"45%",    label:"Products Found Fake" },
  { icon:"💸", number:"$5.8B+", label:"Losses Due to Scams" },
  { icon:"🛡️", number:"2.5M+",  label:"Fake Product Reports" },
];
const WHY_TRUST = [
  "AI-Powered Detection – Machine learning ensures accuracy",
  "Real-Time Review Processing – Fast and reliable results",
  "User-Friendly – Simple file upload & instant reports",
  "Open Source – Available on GitHub for contributions",
];
const FEATURES = [
  "AI-Powered Fake Review Detection","Real-Time Product Analysis",
  "Trust Score Calculation","Product Authenticity Report",
  "User-Friendly Dashboard","Cross-Platform Support",
  "Automated Review Scraper","Fraud Warning Alerts",
  "Data-Driven Scam Insights",
];

export default function Home() {
  return (
    <main>
      {/* HERO */}
      <section className="section-white" style={{ padding:"80px 0" }}>
        <div className="container" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:48, alignItems:"center" }}>
          <div>
            <h1 style={{ fontSize:40, fontWeight:800, lineHeight:1.2, marginBottom:20, color:"#111" }}>
              Detect Fake Reviews &amp; Ensure Trust in Online Shopping
            </h1>
            <p style={{ fontSize:15, fontWeight:600, color:"#1a6b3c", marginBottom:12 }}>
              AI-Powered Fake Product Detection: Analyzing Reviews and Ratings for Authenticity
            </p>
            <p style={{ fontSize:14, color:"#666", marginBottom:32, lineHeight:1.8 }}>
              Our Fake Product Detection System helps identify fake reviews by analyzing customer feedback.
              Upload product reviews, get insights, and make informed decisions before purchasing.
            </p>
            <div style={{ display:"flex", gap:16, flexWrap:"wrap" }}>
              <Link to="/working" className="btn-primary">Get Started →</Link>
              <a href="#features" className="btn-outline-dark">See More ↓</a>
            </div>
          </div>
          <div style={{ background:"#0d2018", borderRadius:16, padding:"48px 32px", color:"#fff", textAlign:"center" }}>
            <div style={{ fontSize:56, marginBottom:16 }}>🔍</div>
            <p style={{ fontSize:17, fontWeight:700, marginBottom:10 }}>AI Review Analysis</p>
            <p style={{ fontSize:13, color:"rgba(255,255,255,0.55)", lineHeight:1.7 }}>
              Real-time detection powered by NLP &amp; Machine Learning models.
            </p>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="section-mid" style={{ padding:"64px 0" }}>
        <div className="container">
          <h2 style={{ textAlign:"center", fontSize:28, fontWeight:700, marginBottom:8 }}>Online Shopping Fraud Statistics</h2>
          <p style={{ textAlign:"center", color:"rgba(255,255,255,0.55)", fontSize:14, maxWidth:520, margin:"0 auto 48px" }}>
            Fake reviews and scam products affect millions of online shoppers every year.
          </p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:20 }}>
            {STATS.map(s => <StatCard key={s.label} {...s} />)}
          </div>
        </div>
      </section>

      {/* WHY TRUST */}
      <section className="section-offwhite" style={{ padding:"70px 0" }}>
        <div className="container">
          <h2 style={{ textAlign:"center", fontSize:30, fontWeight:700, marginBottom:12 }}>Why Trust Our Detection System?</h2>
          <p style={{ textAlign:"center", color:"#666", fontSize:14, maxWidth:580, margin:"0 auto 48px", lineHeight:1.7 }}>
            Our system uses advanced NLP techniques, ML models, and deep learning to give you accurate results in seconds.
          </p>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, maxWidth:820, margin:"0 auto" }}>
            {WHY_TRUST.map(item => (
              <div key={item} style={{ background:"#fff", border:"1px solid #e5e5e5", borderRadius:8, padding:"14px 18px", display:"flex", alignItems:"center", gap:12, fontSize:14 }}>
                <span style={{ color:"#1a6b3c", fontSize:18 }}>✅</span>{item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="section-dark" style={{ padding:"70px 0" }}>
        <div className="container">
          <h2 style={{ textAlign:"center", fontSize:28, fontWeight:700, marginBottom:8 }}>Key Features of Fake Product Detection System</h2>
          <p style={{ textAlign:"center", color:"rgba(255,255,255,0.5)", fontSize:14, maxWidth:560, margin:"0 auto 48px" }}>
            Our advanced AI-driven system helps users identify fake products by analyzing product reviews with real-time data insights.
          </p>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, maxWidth:900, margin:"0 auto" }}>
            {FEATURES.map((f,i) => (
              <div key={f} style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.09)", borderRadius:8, padding:"13px 18px", display:"flex", alignItems:"center", gap:12, fontSize:14, gridColumn: i===FEATURES.length-1 && FEATURES.length%2!==0 ? "1/-1" : "auto", maxWidth: i===FEATURES.length-1 && FEATURES.length%2!==0 ? "50%" : "100%" }}>
                <span style={{ color:"#4ade80", fontSize:16 }}>✅</span>{f}
              </div>
            ))}
          </div>
          <div style={{ textAlign:"center", marginTop:44 }}>
            <Link to="/working" className="btn-primary">Learn More</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
