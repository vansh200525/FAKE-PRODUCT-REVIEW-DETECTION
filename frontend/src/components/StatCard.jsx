export default function StatCard({ icon, number, label }) {
  return (
    <div style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:12, padding:"28px 20px", textAlign:"center" }}>
      <div style={{ fontSize:32, marginBottom:10 }}>{icon}</div>
      <div style={{ fontSize:30, fontWeight:800, color:"#4ade80" }}>{number}</div>
      <div style={{ fontSize:12, color:"rgba(255,255,255,0.55)", marginTop:6 }}>{label}</div>
    </div>
  );
}
