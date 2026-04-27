export default function FeatureCard({ icon, title, description }) {
  return (
    <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.09)", borderRadius:12, padding:24 }}>
      <div style={{ fontSize:28, marginBottom:12 }}>{icon}</div>
      <h3 style={{ fontSize:15, fontWeight:700, marginBottom:8 }}>{title}</h3>
      <p style={{ fontSize:13, color:"rgba(255,255,255,0.58)", lineHeight:1.7 }}>{description}</p>
    </div>
  );
}
